// // frontend/api.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api", // ok
// });

export async function loginUser({ email, password }) {
  const response = await fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha: password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro no login");
  }

  return response.json();
}

// export default api;
