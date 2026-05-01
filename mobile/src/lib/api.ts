import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001/api/v1",
  withCredentials: true,
  timeout: 10000, // 10 seconds
});

// Interceptor to add the Bearer token to every request
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // All backend responses wrap data in a { success, data } object
    // We unwrap here to provide direct access to the data in services
    if (response.data && response.data.success === true) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
      // We can't easily redirect here without context, but we can clear the token
      SecureStore.deleteItemAsync("auth_token");
    }
    const apiError = error.response?.data?.error;
    return Promise.reject(apiError || { message: "Erro inesperado na API" });
  }
);

export default api;
