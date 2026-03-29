import axios from "axios";

export const api = axios.create({
  baseURL: "https://jjbanking.exibba.site/api",
  timeout: 13000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Cache-Control": "no-cache",
  },
});

// // Interceptor Ajustado
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Se a API respondeu, vamos logar o conteúdo real do erro (ex: CPF já cadastrado)
//     if (error.response) {
//       console.error(
//         "Erro da API (Dados):",
//         JSON.stringify(error.response.data),
//       );
//     } else {
//       console.error("Erro de Conexão/Rede:", error.message);
//     }

//     return Promise.reject(error);
//   },
// );

export default api;
