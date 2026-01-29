package sharedauth

import "net/http"

const AuthCookieName = "token"

func SetAuthCookie(w http.ResponseWriter, token string) {
	http.SetCookie(w, &http.Cookie{
		Name:     AuthCookieName,
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   3600 * 24 * 7,
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
