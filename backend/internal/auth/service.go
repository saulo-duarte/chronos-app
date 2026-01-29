package auth

import (
	"context"
	"encoding/json"

	sharedauth "github.com/saulo-duarte/chronos/internal/shared/auth"
	"golang.org/x/oauth2"
)

type AuthService struct {
	repo       *AuthRepository
	jwtService *sharedauth.TokenService
}

func NewAuthService(r *AuthRepository, j *sharedauth.TokenService) *AuthService {
	return &AuthService{repo: r, jwtService: j}
}

func (s *AuthService) AuthenticateGoogleUser(googleUser GoogleUserDTO) (*LoginResponse, error) {
	user := &User{
		GoogleID: googleUser.ID,
		Email:    googleUser.Email,
		Name:     googleUser.Name,
	}

	if err := s.repo.UpsertUser(user); err != nil {
		return nil, err
	}

	token, err := s.jwtService.Generate(user.ID.String())
	if err != nil {
		return nil, err
	}

	return &LoginResponse{
		AccessToken: token,
		TokenType:   "Bearer",
	}, nil
}

func (s *AuthService) VerifyGoogleCode(ctx context.Context, config *oauth2.Config, code string) (*GoogleUserDTO, error) {
	t, err := config.Exchange(ctx, code)
	if err != nil {
		return nil, err
	}

	client := config.Client(ctx, t)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var gUser GoogleUserDTO
	if err := json.NewDecoder(resp.Body).Decode(&gUser); err != nil {
		return nil, err
	}
	return &gUser, nil
}

func (s *AuthService) GetMe(userID string) (*User, error) {
	return s.repo.GetByID(userID)
}
