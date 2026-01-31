package auth

import (
	"net/http"
	"os"

	"github.com/google/uuid"
	sharedauth "github.com/saulo-duarte/chronos/internal/shared/auth"
	"github.com/saulo-duarte/chronos/internal/shared/config"
	"github.com/saulo-duarte/chronos/internal/shared/response"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type AuthHandler struct {
	service     *AuthService
	oauthConfig *oauth2.Config
}

var RUN_MODE = os.Getenv("RUN_MODE")

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
	url := h.oauthConfig.AuthCodeURL("state")
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func (h *AuthHandler) GoogleCallback(w http.ResponseWriter, r *http.Request) {
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

	var redirectURL = "https://chronosapp.site"

	if RUN_MODE == "local" {
		redirectURL = "http://localhost:3000"
	}

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
