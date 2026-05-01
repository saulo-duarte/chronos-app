import api from "../lib/api";
import { 
    Collection, 
    CreateCollectionDTO, 
    UpdateCollectionDTO 
} from "../types";

export const collectionService = {
    getCollections: async (): Promise<Collection[]> => {
        const response = await api.get("/collections");
        return response as any;
    },

    getCollection: async (id: string): Promise<Collection> => {
        const response = await api.get(`/collections/${id}`);
        return response as any;
    },

    createCollection: async (dto: CreateCollectionDTO): Promise<Collection> => {
        const response = await api.post("/collections", dto);
        return response as any;
    },

    updateCollection: async (id: string, dto: UpdateCollectionDTO): Promise<Collection> => {
        const response = await api.patch(`/collections/${id}`, dto);
        return response as any;
    },

    deleteCollection: async (id: string): Promise<void> => {
        await api.delete(`/collections/${id}`);
    },
};
