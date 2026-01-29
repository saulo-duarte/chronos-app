package collections

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
	var dto CreateCollectionDTO
	if err := json.NewDecoder(r.Body).Decode(&dto); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_PAYLOAD", "Payload inválido")
		return
	}

	collection, err := h.service.Create(r.Context(), &dto)
	if err != nil {
		h.handleError(w, err)
		return
	}

	response.JSON(w, http.StatusCreated, collection)
}

func (h *Handler) GetAll(w http.ResponseWriter, r *http.Request) {
	collections, err := h.service.GetAll(r.Context())
	if err != nil {
		h.handleError(w, err)
		return
	}

	response.JSON(w, http.StatusOK, collections)
}

func (h *Handler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_ID", "ID inválido")
		return
	}

	collection, err := h.service.GetByID(r.Context(), id)
	if err != nil {
		h.handleError(w, err)
		return
	}

	response.JSON(w, http.StatusOK, collection)
}

func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_ID", "ID inválido")
		return
	}

	var dto UpdateCollectionDTO
	if err := json.NewDecoder(r.Body).Decode(&dto); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_PAYLOAD", "Payload inválido")
		return
	}

	collection, err := h.service.Update(r.Context(), id, &dto)
	if err != nil {
		h.handleError(w, err)
		return
	}

	response.JSON(w, http.StatusOK, collection)
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

	response.JSON(w, http.StatusOK, map[string]string{"message": "Coleção excluída com sucesso"})
}

func (h *Handler) handleError(w http.ResponseWriter, err error) {
	switch err {
	case ErrCollectionNotFound:
		response.Error(w, http.StatusNotFound, "COLLECTION_NOT_FOUND", err.Error())
	case ErrUnauthorized:
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", err.Error())
	default:
		response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Erro interno no servidor")
	}
}
