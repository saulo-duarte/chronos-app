import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { APIError } from "@/lib/api";
import { useRouter } from "next/navigation";

export interface User {
    id: string;
    email: string;
    name: string;
}

export function useMe() {
    return useQuery<User, APIError>({
        queryKey: ["me"],
        queryFn: async () => {
            const res = await api.get<any>("/auth/me");
            return res.data as User;
        },
        retry: false,
    });
}

export function useLogout() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: async () => {
            await api.post("/auth/logout");
            queryClient.setQueryData(["me"], null);
        },
        onSuccess: () => {
            router.push("/login");
        },
    });
}

export function useLoginWithGoogle() {
    const login = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
    };

    return { login };
}
