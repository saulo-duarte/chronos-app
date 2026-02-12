package leetcode

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/saulo-duarte/chronos/internal/shared/response"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	var dto CreateProblemDTO
	if err := json.NewDecoder(r.Body).Decode(&dto); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_PAYLOAD", "Payload inválido")
		return
	}

	problem, err := h.service.Create(r.Context(), &dto)
	if err != nil {
		h.handleError(w, err)
		return
	}

	response.JSON(w, http.StatusCreated, problem)
}

func (h *Handler) GetAll(w http.ResponseWriter, r *http.Request) {
	problems, err := h.service.GetAll(r.Context())
	if err != nil {
		h.handleError(w, err)
		return
	}

	response.JSON(w, http.StatusOK, problems)
}

func (h *Handler) GetDue(w http.ResponseWriter, r *http.Request) {
	problems, err := h.service.GetDueProblems(r.Context())
	if err != nil {
		h.handleError(w, err)
		return
	}

	response.JSON(w, http.StatusOK, problems)
}

func (h *Handler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_ID", "ID inválido")
		return
	}

	problem, err := h.service.GetByID(r.Context(), id)
	if err != nil {
		h.handleError(w, err)
		return
	}

	response.JSON(w, http.StatusOK, problem)
}

func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_ID", "ID inválido")
		return
	}

	var dto UpdateProblemDTO
	if err := json.NewDecoder(r.Body).Decode(&dto); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_PAYLOAD", "Payload inválido")
		return
	}

	problem, err := h.service.Update(r.Context(), id, &dto)
	if err != nil {
		h.handleError(w, err)
		return
	}

	response.JSON(w, http.StatusOK, problem)
}

func (h *Handler) Review(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_ID", "ID inválido")
		return
	}

	var dto ReviewDTO
	if err := json.NewDecoder(r.Body).Decode(&dto); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_PAYLOAD", "Payload inválido")
		return
	}

	problem, err := h.service.Review(r.Context(), id, &dto)
	if err != nil {
		h.handleError(w, err)
		return
	}

	response.JSON(w, http.StatusOK, problem)
}

func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_ID", "ID inválido")
		return
	}

	if err := h.service.Delete(r.Context(), id); err != nil {
		h.handleError(w, err)
		return
	}

	response.JSON(w, http.StatusOK, map[string]string{"message": "Problema excluído com sucesso"})
}

func (h *Handler) handleError(w http.ResponseWriter, err error) {
	switch err {
	case ErrProblemNotFound:
		response.Error(w, http.StatusNotFound, "PROBLEM_NOT_FOUND", err.Error())
	case ErrInvalidScore:
		response.Error(w, http.StatusBadRequest, "INVALID_SCORE", err.Error())
	case ErrInvalidPattern:
		response.Error(w, http.StatusBadRequest, "INVALID_PATTERN", err.Error())
	case ErrInvalidDifficulty:
		response.Error(w, http.StatusBadRequest, "INVALID_DIFFICULTY", err.Error())
	case ErrUnauthorizedAccess:
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", err.Error())
	default:
		response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Erro interno no servidor")
	}
}
