package resources

import (
	"encoding/json"
	"fmt"
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
	var dto CreateResourceDTO

	contentType := r.Header.Get("Content-Type")
	if contentType == "application/json" || contentType == "" {
		if err := json.NewDecoder(r.Body).Decode(&dto); err != nil {
			response.Error(w, http.StatusBadRequest, "INVALID_PAYLOAD", "Payload inválido")
			return
		}
	} else {
		// Multipart Form
		err := r.ParseMultipartForm(10 << 20) // 10MB limit
		if err != nil {
			response.Error(w, http.StatusBadRequest, "INVALID_PAYLOAD", "Erro ao processar formulário")
			return
		}

		collectionIDStr := r.FormValue("collection_id")
		collectionID, err := uuid.Parse(collectionIDStr)
		if err != nil {
			response.Error(w, http.StatusBadRequest, "INVALID_COLLECTION_ID", "ID de collection inválido")
			return
		}

		title := r.FormValue("title")
		description := r.FormValue("description")
		resourceType := ResourceType(r.FormValue("type"))
		path := r.FormValue("path")

		dto = CreateResourceDTO{
			CollectionID: collectionID,
			Title:        title,
			Type:         resourceType,
			Path:         path,
		}

		if description != "" {
			dto.Description = &description
		}

		if resourceType == ResourceTypeFile {
			file, header, err := r.FormFile("file")
			if err != nil {
				response.Error(w, http.StatusBadRequest, "FILE_REQUIRED", "Arquivo é obrigatório para o tipo FILE")
				return
			}
			defer file.Close()

			dto.File = file
			dto.Size = header.Size
			mime := header.Header.Get("Content-Type")
			dto.MimeType = &mime

			if dto.Path == "" {
				dto.Path = fmt.Sprintf("%s/%s", collectionID.String(), header.Filename)
			}
		}
	}

	resource, err := h.service.Create(r.Context(), &dto)
	if err != nil {
		fmt.Printf("DEBUG: Error creating resource: %v\n", err)
		switch err {
		case ErrUnauthorized:
			response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", err.Error())
		case ErrInvalidResourceType:
			response.Error(w, http.StatusBadRequest, "INVALID_TYPE", err.Error())
		case ErrCollectionNotFound:
			response.Error(w, http.StatusNotFound, "COLLECTION_NOT_FOUND", err.Error())
		default:
			response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Erro ao criar resource: "+err.Error())
		}
		return
	}

	response.JSON(w, http.StatusCreated, resource)
}

func (h *Handler) GetByID(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_ID", "ID inválido")
		return
	}

	resource, err := h.service.GetByID(r.Context(), id)
	if err != nil {
		switch err {
		case ErrUnauthorized:
			response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", err.Error())
		case ErrResourceNotFound:
			response.Error(w, http.StatusNotFound, "RESOURCE_NOT_FOUND", err.Error())
		default:
			response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Erro ao buscar resource")
		}
		return
	}

	response.JSON(w, http.StatusOK, resource)
}

func (h *Handler) GetByCollectionID(w http.ResponseWriter, r *http.Request) {
	collectionIDStr := chi.URLParam(r, "collectionId")
	collectionID, err := uuid.Parse(collectionIDStr)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_COLLECTION_ID", "ID de collection inválido")
		return
	}

	resources, err := h.service.GetByCollectionID(r.Context(), collectionID)
	if err != nil {
		switch err {
		case ErrUnauthorized:
			response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", err.Error())
		default:
			response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Erro ao buscar resources")
		}
		return
	}

	response.JSON(w, http.StatusOK, resources)
}

func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_ID", "ID inválido")
		return
	}

	var dto UpdateResourceDTO
	if err := json.NewDecoder(r.Body).Decode(&dto); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_PAYLOAD", "Payload inválido")
		return
	}

	resource, err := h.service.Update(r.Context(), id, &dto)
	if err != nil {
		switch err {
		case ErrUnauthorized:
			response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", err.Error())
		case ErrResourceNotFound:
			response.Error(w, http.StatusNotFound, "RESOURCE_NOT_FOUND", err.Error())
		default:
			response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Erro ao atualizar resource")
		}
		return
	}

	response.JSON(w, http.StatusOK, resource)
}

func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_ID", "ID inválido")
		return
	}

	err = h.service.Delete(r.Context(), id)
	if err != nil {
		switch err {
		case ErrUnauthorized:
			response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", err.Error())
		case ErrResourceNotFound:
			response.Error(w, http.StatusNotFound, "RESOURCE_NOT_FOUND", err.Error())
		default:
			response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Erro ao deletar resource")
		}
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
