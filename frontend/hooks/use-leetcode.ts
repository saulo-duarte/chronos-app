import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leetcodeService } from "@/services/leetcode";
import { queryKeys } from "@/lib/query-keys";
import type {
    CreateLeetCodeProblemDTO,
    UpdateLeetCodeProblemDTO,
    ReviewDTO,
} from "@/types";

export function useLeetCodeProblems() {
    return useQuery({
        queryKey: queryKeys.leetcode.all,
        queryFn: () => leetcodeService.getProblems(),
    });
}

export function useDueProblems() {
    return useQuery({
        queryKey: queryKeys.leetcode.due,
        queryFn: () => leetcodeService.getDueProblems(),
    });
}

export function useCreateProblem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: CreateLeetCodeProblemDTO) => leetcodeService.createProblem(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.leetcode.all });
        },
    });
}

export function useUpdateProblem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            dto,
        }: {
            id: string;
            dto: UpdateLeetCodeProblemDTO;
        }) => leetcodeService.updateProblem(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.leetcode.all });
        },
    });
}

export function useReviewProblem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: ReviewDTO }) => 
            leetcodeService.reviewProblem(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.leetcode.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.leetcode.due });
        },
    });
}

export function useDeleteProblem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => leetcodeService.deleteProblem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.leetcode.all });
        },
    });
}
