import axios from "axios";
import AuthService from "./AuthService";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8081/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const user = AuthService.getCurrentUser();
    if (user && user.accessToken) {
      config.headers["Authorization"] = "Bearer " + user.accessToken;
      console.log("Access token adicionado ao cabeçalho da requisição.");
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
      console.log("Token expirado. Tentando renovar...");
      originalRequest._retry = true;

      try {
        const newAccessToken = await AuthService.renewToken();
        if (newAccessToken) {
          console.log(
            "Token atualizado com sucesso. Reenviando a requisição original."
          );
          axiosInstance.defaults.headers["Authorization"] =
            "Bearer " + newAccessToken;
          originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;
          return axiosInstance(originalRequest);
        }
      } catch {
        console.error(
          "Erro na renovação do token. Redirecionando para o login."
        );
        AuthService.Logout();
        window.location.href = "/auth/login";
      }
    } else if (!error.response) {
      console.error("Erro de rede ou de configuração:", error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
