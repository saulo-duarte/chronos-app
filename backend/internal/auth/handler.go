package auth

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/google/uuid"
	sharedauth "github.com/saulo-duarte/chronos/internal/shared/auth"
	"github.com/saulo-duarte/chronos/internal/shared/config"
	"github.com/saulo-duarte/chronos/internal/shared/response"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"strings"
)

type AuthHandler struct {
	service     *AuthService
	oauthConfig *oauth2.Config
}

func NewAuthHandler(service *AuthService, cfg *config.Config) *AuthHandler {
	return &AuthHandler{
		service: service,
		oauthConfig: &oauth2.Config{
			RedirectURL:  cfg.GoogleRedirectURL,
			ClientID:     cfg.GoogleClientID,
			ClientSecret: cfg.GoogleClientSecret,
			Scopes: []string{
				"https://www.googleapis.com/auth/userinfo.email",
				"https://www.googleapis.com/auth/userinfo.profile",
			},
			Endpoint: google.Endpoint,
		},
	}
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	// Allow the popup to communicate back for OAuth
	w.Header().Set("Cross-Origin-Opener-Policy", "same-origin-allow-popups")
	
	platform := r.URL.Query().Get("platform")
	redirectURI := r.URL.Query().Get("redirect_to")
	
	state := "state"
	if platform == "mobile" {
		if redirectURI != "" {
			state = "mobile|" + redirectURI
		} else {
			state = "mobile"
		}
	}
	url := h.oauthConfig.AuthCodeURL(state)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func (h *AuthHandler) GoogleCallback(w http.ResponseWriter, r *http.Request) {
	// Allow the popup to communicate back for OAuth
	w.Header().Set("Cross-Origin-Opener-Policy", "same-origin-allow-popups")

	code := r.URL.Query().Get("code")
	if code == "" {
		response.Error(w, http.StatusBadRequest, "MISSING_CODE", "Código não fornecido")
		return
	}

	googleUser, err := h.service.VerifyGoogleCode(r.Context(), h.oauthConfig, code)
	if err != nil {
		response.Error(w, http.StatusUnauthorized, "AUTH_FAILED", err.Error())
		return
	}

	result, err := h.service.AuthenticateGoogleUser(*googleUser)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "SERVICE_ERROR", err.Error())
		return
	}

	sharedauth.SetAuthCookie(w, result.AccessToken)

	state := r.URL.Query().Get("state")
	if len(state) >= 6 && state[:6] == "mobile" {
		mobileRedirectURL := "chronos-mobile://auth-callback"
		
		// Check for dynamic redirect URI in state (e.g., mobile|http://localhost:8081)
		if len(state) > 7 && state[6] == '|' {
			mobileRedirectURL = state[7:]
		}

		// Ensure we have a query separator
		separator := "?"
		if strings.Contains(mobileRedirectURL, "?") {
			separator = "&"
		}
		
		target := mobileRedirectURL + separator + "token=" + result.AccessToken
		log.Printf("[AUTH_DEBUG] Redirecionando mobile para: %s", target)
		http.Redirect(w, r, target, http.StatusTemporaryRedirect)
		return
	}

	runMode := os.Getenv("RUN_MODE")
	redirectURL := "https://chronosapp.site"

	if runMode == "local" {
		redirectURL = "http://localhost:3000"
	}

	log.Printf("[AUTH_DEBUG] RunMode capturado: '%s'", runMode)
	log.Printf("[AUTH_DEBUG] Redirecionando usuário %s para: %s", googleUser.Email, redirectURL)

	http.Redirect(w, r, redirectURL, http.StatusTemporaryRedirect)
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	sharedauth.CleanAuthCookie(w)
	response.JSON(w, http.StatusOK, map[string]string{"message": "Logout realizado com sucesso"})
}

func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(sharedauth.UserContextKey).(uuid.UUID)
	if !ok {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Contexto de usuário inválido")
		return
	}

	user, err := h.service.GetMe(userID.String())
	if err != nil {
		response.Error(w, http.StatusNotFound, "USER_NOT_FOUND", "Usuário não encontrado")
		return
	}

	response.JSON(w, http.StatusOK, user)
}

func (h *AuthHandler) GetService() *AuthService {
	return h.service
}

func (h *AuthHandler) RegisterWithEmail(w http.ResponseWriter, r *http.Request) {
	var dto RegisterDTO
	if err := json.NewDecoder(r.Body).Decode(&dto); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_REQUEST", "Dados inválidos")
		return
	}

	result, err := h.service.RegisterWithEmail(dto)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "REGISTRATION_FAILED", err.Error())
		return
	}

	sharedauth.SetAuthCookie(w, result.AccessToken)
	response.JSON(w, http.StatusOK, result)
}

func (h *AuthHandler) LoginWithEmail(w http.ResponseWriter, r *http.Request) {
	var dto LoginWithEmailDTO
	if err := json.NewDecoder(r.Body).Decode(&dto); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_REQUEST", "Dados inválidos")
		return
	}

	result, err := h.service.LoginWithEmail(dto)
	if err != nil {
		response.Error(w, http.StatusUnauthorized, "LOGIN_FAILED", "Credenciais inválidas")
		return
	}

	sharedauth.SetAuthCookie(w, result.AccessToken)
	response.JSON(w, http.StatusOK, result)
}
