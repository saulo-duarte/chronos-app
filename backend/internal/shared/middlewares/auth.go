package middlewares

import (
	"context"
	"errors"
	"net/http"
	"strings"

	"github.com/google/uuid"
	sharedauth "github.com/saulo-duarte/chronos/internal/shared/auth"
	"github.com/saulo-duarte/chronos/internal/shared/response"
)

func Auth(jwtSvc *sharedauth.TokenService) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			println("DEBUG: Request Origin:", r.Header.Get("Origin"))
			println("DEBUG: Cookie header:", r.Header.Get("Cookie"))

			token := extractToken(r)
			if token == "" {
				println("DEBUG: Token missing in request")
				response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Token missing")
				return
			}

			userIDStr, err := jwtSvc.Validate(token)
			if err != nil {
				println("DEBUG: JWT Validation failed:", err.Error())
				response.Error(w, http.StatusUnauthorized, "INVALID_TOKEN", err.Error())
				return
			}

			userID, err := uuid.Parse(userIDStr)
			if err != nil {
				println("DEBUG: Failed to parse userID to UUID:", userIDStr)
				response.Error(w, http.StatusUnauthorized, "INVALID_TOKEN", "invalid user id in token")
				return
			}

			ctx := context.WithValue(r.Context(), sharedauth.UserContextKey, userID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func GetUserIDFromContext(ctx context.Context) (uuid.UUID, error) {
	userID, ok := ctx.Value(sharedauth.UserContextKey).(uuid.UUID)
	if !ok {
		return uuid.Nil, errors.New("user not found in context")
	}
	return userID, nil
}

func extractToken(r *http.Request) string {
	authHeader := r.Header.Get("Authorization")
	if authHeader != "" {
		return strings.Replace(authHeader, "Bearer ", "", 1)
	}
	cookie, err := r.Cookie("token")
	if err == nil {
		return cookie.Value
	}
	return ""
}
