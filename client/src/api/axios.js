import axios from "axios";

// Create an Axios instance with base URL and cookie support enabled
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

// Interceptor to inject JWT token from localStorage into Authorization headers if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
