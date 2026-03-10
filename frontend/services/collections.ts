import api from "@/lib/api";
import { 
  CollectionSchema, 
  CreateCollectionSchema, 
  UpdateCollectionSchema 
} from "@/schemas/collections";

export const collectionService = {
  getCollections: async () => {
    const res = await api.get<CollectionSchema[]>("/collections");
    return res.data;
  },

  getCollection: async (id: string) => {
    const res = await api.get<CollectionSchema>(`/collections/${id}`);
    return res.data;
  },

  createCollection: async (dto: CreateCollectionSchema) => {
    const res = await api.post<CollectionSchema>("/collections", dto);
    return res.data;
  },

  updateCollection: async (id: string, dto: UpdateCollectionSchema) => {
    const res = await api.put<CollectionSchema>(`/collections/${id}`, dto);
    return res.data;
  },

  deleteCollection: async (id: string) => {
    await api.delete(`/collections/${id}`);
  },
};
