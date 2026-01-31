import axios, { AxiosResponse, AxiosError } from "axios";

export interface APIError {
  code: string;
  message: string;
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  error?: APIError;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1",
  withCredentials: true,
});

api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError<any>) => {
    const apiError = error.response?.data?.error;
    return Promise.reject(apiError || { message: "Erro inesperado na API" });
  }
);

export default api;
