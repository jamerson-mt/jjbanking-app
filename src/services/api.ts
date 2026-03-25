import axios from "axios";

export const api = axios.create({
  // Garanta que o IP 10.0.0.9 é o do seu PC e a porta é a 5000 (mapeada no Docker)
  baseURL: "http://10.0.0.9:5000/api",
  timeout: 15000, // 15 segundos
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    // Previne que o iOS tente usar cache de requisições falhas
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  },
});

// Interceptor para logar erros de rede no terminal do Expo
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("=== ERRO DE CONEXÃO ===");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Dados:", error.response.data);
    } else if (error.request) {
      console.error(
        "O sinal saiu do iPhone, mas o servidor não respondeu (Firewall?)",
      );
    } else {
      console.error("Mensagem:", error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
