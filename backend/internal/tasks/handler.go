package tasks

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
	var dto CreateTaskDTO
	if err := json.NewDecoder(r.Body).Decode(&dto); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_PAYLOAD", "Payload inválido")
		return
	}

	task, err := h.service.Create(r.Context(), &dto)
	if err != nil {
		h.handleError(w, err)
		return
	}

	response.JSON(w, http.StatusCreated, task)
}

func (h *Handler) GetAll(w http.ResponseWriter, r *http.Request) {
	tasks, err := h.service.GetAllByUserID(r.Context())
	if err != nil {
		h.handleError(w, err)
		return
	}

	response.JSON(w, http.StatusOK, tasks)
}

func (h *Handler) GetByCollection(w http.ResponseWriter, r *http.Request) {
	collectionID, err := uuid.Parse(chi.URLParam(r, "collectionID"))
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_COLLECTION_ID", "ID de coleção inválido")
		return
	}

	tasks, err := h.service.GetByCollection(r.Context(), collectionID)
	if err != nil {
		h.handleError(w, err)
		return
	}

	response.JSON(w, http.StatusOK, tasks)
}

func (h *Handler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_ID", "ID inválido")
		return
	}

	task, err := h.service.GetByID(r.Context(), id)
	if err != nil {
		h.handleError(w, err)
		return
	}

	response.JSON(w, http.StatusOK, task)
}

func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_ID", "ID inválido")
		return
	}

	var dto UpdateTaskDTO
	if err := json.NewDecoder(r.Body).Decode(&dto); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_PAYLOAD", "Payload inválido")
		return
	}

	task, err := h.service.Update(r.Context(), id, &dto)
	if err != nil {
		h.handleError(w, err)
		return
	}

	response.JSON(w, http.StatusOK, task)
}

func (h *Handler) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_ID", "ID inválido")
		return
	}

	var payload struct {
		Status Status `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_PAYLOAD", "Status inválido")
		return
	}

	task, err := h.service.UpdateStatus(r.Context(), id, payload.Status)
	if err != nil {
		h.handleError(w, err)
		return
	}

	response.JSON(w, http.StatusOK, task)
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

	response.JSON(w, http.StatusOK, map[string]string{"message": "Tarefa excluída com sucesso"})
}

func (h *Handler) handleError(w http.ResponseWriter, err error) {
	switch err {
	case ErrTaskNotFound:
		response.Error(w, http.StatusNotFound, "TASK_NOT_FOUND", err.Error())
	case ErrInvalidTaskStatus:
		response.Error(w, http.StatusBadRequest, "INVALID_STATUS", err.Error())
	case ErrInvalidTaskPriority:
		response.Error(w, http.StatusBadRequest, "INVALID_PRIORITY", err.Error())
	case ErrUnauthorized:
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", err.Error())
	case ErrTaskNotBelongsToUser:
		response.Error(w, http.StatusForbidden, "FORBIDDEN", err.Error())
	default:
		response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Erro interno no servidor")
	}
}
