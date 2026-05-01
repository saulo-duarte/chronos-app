import api from "../lib/api";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";

export interface User {
  id: string;
  email: string;
  name?: string;
}

export const authService = {
  getMe: async (): Promise<User> => {
    // response.data handled by axios interceptor
    return api.get("/auth/me");
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  },

  loginWithEmail: async (data: any): Promise<{ access_token: string }> => {
    return api.post("/auth/login/email", data);
  },

  register: async (data: any): Promise<{ access_token: string }> => {
    return api.post("/auth/register", data);
  },

  getLoginUrl: (redirectUri?: string) => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001/api/v1";
    let url = `${apiUrl}/auth/login?platform=mobile`;
    if (redirectUri) {
      url += `&redirect_to=${encodeURIComponent(redirectUri)}`;
    }
    return url;
  },

  saveToken: async (token: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  getToken: async () => {
    return SecureStore.getItemAsync(TOKEN_KEY);
  },
};
