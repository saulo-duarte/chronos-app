import api from "@/lib/api";
import { 
  ResourceSchema, 
  CreateResourceSchema, 
  UpdateResourceSchema 
} from "@/schemas/resources";

export const resourceService = {
  getResources: async (collectionId: string) => {
    const res = await api.get<ResourceSchema[]>(`/resources/collection/${collectionId}`);
    return res.data;
  },

  getAllResources: async () => {
    const res = await api.get<ResourceSchema[]>("/resources");
    return res.data;
  },

  getResource: async (id: string) => {
    const res = await api.get<ResourceSchema>(`/resources/${id}`);
    return res.data;
  },

  createResource: async (dto: CreateResourceSchema) => {
    const res = await api.post<ResourceSchema>("/resources", dto);
    return res.data;
  },

  updateResource: async (id: string, dto: UpdateResourceSchema) => {
    const res = await api.put<ResourceSchema>(`/resources/${id}`, dto);
    return res.data;
  },

  deleteResource: async (id: string) => {
    await api.delete(`/resources/${id}`);
  },
};
