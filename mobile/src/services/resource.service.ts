import api from "../lib/api";
import { 
    Resource, 
    CreateResourceDTO, 
    UpdateResourceDTO 
} from "../types";

export const resourceService = {
    getResources: async (collectionId?: string): Promise<Resource[]> => {
        const url = collectionId ? `/resources/collection/${collectionId}` : "/resources";
        const response = await api.get(url);
        return response as any;
    },

    getResource: async (id: string): Promise<Resource> => {
        const response = await api.get(`/resources/${id}`);
        return response as any;
    },

    createResource: async (data: CreateResourceDTO | FormData): Promise<Resource> => {
        const isFormData = data instanceof FormData;
        const response = await api.post("/resources", data, {
            headers: {
                "Content-Type": isFormData ? "multipart/form-data" : "application/json",
            },
        });
        return response as any;
    },

    updateResource: async (id: string, dto: UpdateResourceDTO): Promise<Resource> => {
        const response = await api.patch(`/resources/${id}`, dto);
        return response as any;
    },

    deleteResource: async (id: string): Promise<void> => {
        await api.delete(`/resources/${id}`);
    },
};
