import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type {
    LeetCodeProblem,
    CreateLeetCodeProblemDTO,
    UpdateLeetCodeProblemDTO,
    ReviewDTO,
} from "@/types";

export function useLeetCodeProblems() {
    return useQuery({
        queryKey: ["leetcode"],
        queryFn: async () => {
            const { data } = await api.get<LeetCodeProblem[]>("/leetcode");
            return data;
        },
    });
}

export function useDueProblems() {
    return useQuery({
        queryKey: ["leetcode", "due"],
        queryFn: async () => {
            const { data } = await api.get<LeetCodeProblem[]>("/leetcode/due");
            return data;
        },
    });
}

export function useCreateProblem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (dto: CreateLeetCodeProblemDTO) => {
            const { data } = await api.post<LeetCodeProblem>("/leetcode", dto);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leetcode"] });
        },
    });
}

export function useUpdateProblem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            dto,
        }: {
            id: string;
            dto: UpdateLeetCodeProblemDTO;
        }) => {
            const { data } = await api.put<LeetCodeProblem>(`/leetcode/${id}`, dto);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leetcode"] });
        },
    });
}

export function useReviewProblem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, dto }: { id: string; dto: ReviewDTO }) => {
            const { data } = await api.post<LeetCodeProblem>(
                `/leetcode/${id}/review`,
                dto
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leetcode"] });
        },
    });
}

export function useDeleteProblem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/leetcode/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leetcode"] });
        },
    });
}
