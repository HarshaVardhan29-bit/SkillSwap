// frontend/src/api/axios.js
import axios from "axios";

// create axios instance
const api = axios.create({
  // change port if your backend is on a different one
  baseURL: "http://localhost:5000/api",
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
