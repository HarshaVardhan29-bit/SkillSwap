// frontend/src/api/axios.js
import axios from "axios";

// Use environment variable for production, fallback to localhost for development
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

// helper to set / clear auth token header
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;
