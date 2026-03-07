import axios from "axios";

const api = axios.create({
  baseURL:         import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // cookies ke liye zaroori
});

export async function registerApi(data) {
  const res = await api.post("/api/auth/register", data);
  return res.data;
}

export async function loginApi(data) {
  const res = await api.post("/api/auth/login", data);
  return res.data;
}

export async function logoutApi() {
  const res = await api.post("/api/auth/logout");
  return res.data;
}

export async function getMeApi() {
  const res = await api.get("/api/auth/me");
  return res.data;
}