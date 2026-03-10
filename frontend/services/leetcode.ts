import api from "@/lib/api";
import { 
  LeetCodeProblemSchema, 
  CreateLeetCodeProblemSchema, 
  UpdateLeetCodeProblemSchema, 
  ReviewSchema 
} from "@/schemas/leetcode";

export const leetcodeService = {
  getProblems: async () => {
    const res = await api.get<LeetCodeProblemSchema[]>("/leetcode");
    return res.data;
  },

  getDueProblems: async () => {
    const res = await api.get<LeetCodeProblemSchema[]>("/leetcode/due");
    return res.data;
  },

  createProblem: async (dto: CreateLeetCodeProblemSchema) => {
    const res = await api.post<LeetCodeProblemSchema>("/leetcode", dto);
    return res.data;
  },

  updateProblem: async (id: string, dto: UpdateLeetCodeProblemSchema) => {
    const res = await api.put<LeetCodeProblemSchema>(`/leetcode/${id}`, dto);
    return res.data;
  },

  reviewProblem: async (id: string, dto: ReviewSchema) => {
    const res = await api.post<LeetCodeProblemSchema>(`/leetcode/${id}/review`, dto);
    return res.data;
  },

  deleteProblem: async (id: string) => {
    await api.delete(`/leetcode/${id}`);
  },
};
