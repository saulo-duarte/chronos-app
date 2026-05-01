import api from "../lib/api";
import { 
    LeetCodeProblem, 
    CreateLeetCodeProblemDTO, 
    UpdateLeetCodeProblemDTO, 
    ReviewDTO 
} from "../types";

export const leetcodeService = {
    getProblems: async (): Promise<LeetCodeProblem[]> => {
        const response = await api.get("/leetcode");
        return response as any;
    },

    getDueProblems: async (): Promise<LeetCodeProblem[]> => {
        const response = await api.get("/leetcode/due");
        return response as any;
    },

    createProblem: async (dto: CreateLeetCodeProblemDTO): Promise<LeetCodeProblem> => {
        const response = await api.post("/leetcode", dto);
        return response as any;
    },

    updateProblem: async (id: string, dto: UpdateLeetCodeProblemDTO): Promise<LeetCodeProblem> => {
        const response = await api.patch(`/leetcode/${id}`, dto);
        return response as any;
    },

    deleteProblem: async (id: string): Promise<void> => {
        await api.delete(`/leetcode/${id}`);
    },

    reviewProblem: async (id: string, dto: ReviewDTO): Promise<LeetCodeProblem> => {
        const response = await api.post(`/leetcode/${id}/review`, dto);
        return response as any;
    },
};
