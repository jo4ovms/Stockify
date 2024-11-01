import axios from "axios";

const API_URL = "http://localhost:8081/api/auth";

const AuthService = {
  async login(username, password) {
    try {
      const response = await axios.post(`${API_URL}/signin`, {
        username,
        password,
      });
      console.log("Resposta do login:", response.data);
      if (
        response.data &&
        response.data.accessToken &&
        response.data.tokenType
      ) {
        console.log("Login bem-sucedido. Armazenando tokens no localStorage.");
        AuthService.storeUser(response.data);
      } else {
        console.error("Erro: Tokens de autenticação ausentes na resposta.");
      }
      return response.data;
    } catch (error) {
      console.error("Erro ao efetuar o login:", error);
      throw new Error("Falha ao efetuar o login");
    }
  },
  storeUser(data) {
    localStorage.setItem("user", JSON.stringify(data));
    const tokenPayload = JSON.parse(atob(data.accessToken.split(".")[1]));
    localStorage.setItem("tokenExpiration", tokenPayload.exp * 1000);
  },
  Logout() {
    console.log("Logout efetuado. Removendo usuário do localStorage.");
    localStorage.removeItem("user");
  },

  register(username, email, password) {
    return axios.post(`${API_URL}/signup`, {
      username,
      email,
      password,
    });
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  },

  async renewToken() {
    const user = this.getCurrentUser();
    if (user && user.refreshToken) {
      //console.log("Tentando renovar o token...");
      try {
        const response = await axios.post(`${API_URL}/refresh-token`, {
          refreshToken: user.refreshToken,
        });
        if (response.data.accessToken) {
          //console.log("Token renovado com sucesso.");
          user.accessToken = response.data.accessToken;
          this.storeUser(user);
          return response.data.accessToken;
        } else {
          console.error(
            "Erro: Novo accessToken ausente na resposta de renovação."
          );
        }
      } catch (error) {
        console.error("Erro ao renovar o token:", error);
        throw new Error("Falha ao renovar o token");
      }
    } else {
      console.error("Erro: Refresh token inválido ou ausente.");
    }
    throw new Error("Refresh token inválido");
  },

  isTokenExpiringSoon(bufferTimeInSeconds = 30) {
    const user = this.getCurrentUser();
    if (user && user.accessToken) {
      const tokenPayload = JSON.parse(atob(user.accessToken.split(".")[1]));
      const expirationTime = tokenPayload.exp * 1000;
      const currentTime = Date.now();
      const bufferTime = bufferTimeInSeconds * 1000;

      return expirationTime - currentTime < bufferTime;
    }
    return true;
  },
};

export default AuthService;
