// frontend/src/api/axios.js
import axios from "axios";

// Use environment variable for production, fallback to production backend URL
const BASE_URL = import.meta.env.VITE_API_URL || 
                 (import.meta.env.MODE === 'production' 
                   ? 'https://skillswap-a3re.onrender.com/api' 
                   : 'http://localhost:5000/api');

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
