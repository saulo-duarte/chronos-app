package sharedauth

import (
	"net/http"
	"os"
	"time"
)

const AuthCookieName = "token"

func SetAuthCookie(w http.ResponseWriter, token string) {
	secure := os.Getenv("RUN_MODE") != "local"

	http.SetCookie(w, &http.Cookie{
		Name:     AuthCookieName,
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   secure,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   3600 * 24 * 30,
		Expires:  time.Now().Add(time.Hour * 24 * 30),
	})
}

func CleanAuthCookie(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:   AuthCookieName,
		Value:  "",
		Path:   "/",
		MaxAge: -1,
	})
}
