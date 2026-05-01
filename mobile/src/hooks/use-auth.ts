import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService, User } from "../services/auth.service";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export function useMe() {
  return useQuery<User, Error>({
    queryKey: ["auth", "me"],
    queryFn: () => authService.getMe(),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
    },
  });
}

export function useLoginWithGoogle() {
  const queryClient = useQueryClient();

  const login = async () => {
    try {
      // Generate the correct redirect URI for the current platform/environment
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: "chronos-mobile",
        path: "auth-callback",
      });

      console.log("Redirect URI:", redirectUri);

      const loginUrl = authService.getLoginUrl(redirectUri);
      
      // Open the browser for authentication
      const result = await WebBrowser.openAuthSessionAsync(
        loginUrl,
        redirectUri
      );

      if (result.type === "success") {
        const { url } = result;
        // Extract token from URL (e.g., chronos-mobile://auth-callback?token=... or http://localhost:8081/auth-callback?token=...)
        let token = "";
        if (url.includes("token=")) {
          token = url.split("token=")[1].split("&")[0];
        }
        
        if (token) {
          await authService.saveToken(token);
          // Force immediate invalidation and re-fetch of 'me' query
          await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
        }
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      alert(`Erro ao fazer login: ${error.message || "Tente novamente mais tarde."}`);
    }
  };

  return { login };
}

export function useLoginWithEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => authService.loginWithEmail(data),
    onSuccess: async (result) => {
      await authService.saveToken(result.access_token);
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => authService.register(data),
    onSuccess: async (result) => {
      await authService.saveToken(result.access_token);
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}
