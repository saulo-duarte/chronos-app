package auth

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"strings"

	"golang.org/x/crypto/argon2"
)

// Parameters for Argon2id
const (
	timeCost = 1
	memory   = 64 * 1024
	threads  = 4
	keyLen   = 32
	saltLen  = 16
)

func HashPassword(password string) (string, error) {
	salt := make([]byte, saltLen)
	if _, err := rand.Read(salt); err != nil {
		return "", err
	}

	hash := argon2.IDKey([]byte(password), salt, timeCost, memory, threads, keyLen)

	b64Salt := base64.RawStdEncoding.EncodeToString(salt)
	b64Hash := base64.RawStdEncoding.EncodeToString(hash)

	return fmt.Sprintf("$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s", argon2.Version, memory, timeCost, threads, b64Salt, b64Hash), nil
}

func VerifyPassword(password, encodedHash string) (bool, error) {
	parts := strings.Split(encodedHash, "$")
	if len(parts) != 6 {
		return false, errors.New("invalid hash format")
	}

	var version int
	_, err := fmt.Sscanf(parts[2], "v=%d", &version)
	if err != nil {
		return false, err
	}
	if version != argon2.Version {
		return false, errors.New("incompatible version")
	}

	var mem, t, p uint32
	_, err = fmt.Sscanf(parts[3], "m=%d,t=%d,p=%d", &mem, &t, &p)
	if err != nil {
		return false, err
	}

	salt, err := base64.RawStdEncoding.DecodeString(parts[4])
	if err != nil {
		return false, err
	}

	decodedHash, err := base64.RawStdEncoding.DecodeString(parts[5])
	if err != nil {
		return false, err
	}

	hashAttempt := argon2.IDKey([]byte(password), salt, t, mem, uint8(p), uint32(len(decodedHash)))

	if len(decodedHash) != len(hashAttempt) {
		return false, nil
	}
	for i := range decodedHash {
		if decodedHash[i] != hashAttempt[i] {
			return false, nil
		}
	}

	return true, nil
}
