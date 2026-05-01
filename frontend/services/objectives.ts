import api from "@/lib/api";
import { 
  ObjectiveSchema, 
  CreateObjectiveSchema, 
  UpdateObjectiveSchema 
} from "@/schemas/objectives";

export const objectiveService = {
  getObjectives: async () => {
    const res = await api.get<ObjectiveSchema[]>("/objectives");
    return res.data;
  },

  getObjective: async (id: string) => {
    const res = await api.get<ObjectiveSchema>(`/objectives/${id}`);
    return res.data;
  },

  createObjective: async (dto: CreateObjectiveSchema) => {
    const res = await api.post<ObjectiveSchema>("/objectives", dto);
    return res.data;
  },

  updateObjective: async (id: string, dto: UpdateObjectiveSchema) => {
    const res = await api.patch<ObjectiveSchema>(`/objectives/${id}`, dto);
    return res.data;
  },

  deleteObjective: async (id: string) => {
    await api.delete(`/objectives/${id}`);
  },
};
