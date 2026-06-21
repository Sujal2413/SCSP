import axios from "axios";

// Backend base URL. Set VITE_API_BASE_URL at build time (e.g. your hosted
// Django backend) for deployment; falls back to local dev otherwise.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;