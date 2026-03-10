import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService, User } from "@/services/auth";
import { queryKeys } from "@/lib/query-keys";
import { useRouter } from "next/navigation";
import { APIError } from "@/lib/api";

export function useMe() {
    return useQuery<User, APIError>({
        queryKey: queryKeys.auth.me,
        queryFn: () => authService.getMe(),
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useLogout() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            queryClient.setQueryData(queryKeys.auth.me, null);
            router.push("/login");
        },
    });
}

export function useLoginWithGoogle() {
    const login = () => {
        window.location.href = authService.getLoginUrl();
    };

    return { login };
}
