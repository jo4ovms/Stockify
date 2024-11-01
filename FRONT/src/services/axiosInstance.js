import axios from "axios";
import AuthService from "./AuthService";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8081/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const user = AuthService.getCurrentUser();

    if (user && user.accessToken && AuthService.isTokenExpiringSoon()) {
      try {
        const newAccessToken = await AuthService.renewToken();
        if (newAccessToken) {
          config.headers["Authorization"] = "Bearer " + newAccessToken;
        }
      } catch (error) {
        console.error("Erro ao renovar o token antes da requisição:", error);
        AuthService.Logout();
        window.location.href = "/auth/login";
        return Promise.reject(error);
      }
    } else if (user && user.accessToken) {
      config.headers["Authorization"] = "Bearer " + user.accessToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await AuthService.renewToken();
        if (newAccessToken) {
          axiosInstance.defaults.headers["Authorization"] =
            "Bearer " + newAccessToken;
          originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Erro ao renovar o token. Redirecionando para o login.");
        AuthService.Logout();
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    } else if (!error.response) {
      console.error("Erro de rede ou configuração:", error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
