import axios from "axios";

// Cria uma instância configurada do Axios
const api = axios.create({
  baseURL: "http://localhost:5000/api", // URL base do seu back-end
});

// Exemplo de função de login
export async function loginUser(credentials) {
  const response = await api.post("/login", credentials);
  return response.data;
}

export default api;