// frontend/src/api/axios.js
import axios from "axios";

// In production (Render), frontend is served by backend, so use relative URL
// In development, use localhost backend
const BASE_URL = import.meta.env.MODE === 'production' 
  ? '/api'  // Relative URL when served from same domain
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

console.log('🌐 API Base URL:', BASE_URL);
console.log('🔧 Mode:', import.meta.env.MODE);

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
