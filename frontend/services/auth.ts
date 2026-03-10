import api from "@/lib/api";

export interface User {
  id: string;
  email: string;
  name?: string;
}

export const authService = {
  getMe: async () => {
    const res = await api.get<User>("/auth/me");
    return res.data;
  },

  logout: async () => {
    await api.post("/auth/logout");
  },

  getLoginUrl: () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
    return `${apiUrl}/auth/login`;
  },
};
