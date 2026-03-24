import axios from "axios";

// Get API URL from environment variables
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000;

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for debugging
if (process.env.REACT_APP_DEBUG === "true") {
  api.interceptors.request.use(
    (config) => {
      console.log(
        `API Request: ${config.method?.toUpperCase()} ${config.url}`,
        config.data,
      );
      return config;
    },
    (error) => {
      console.error("API Request Error:", error);
      return Promise.reject(error);
    },
  );

  // Response interceptor for debugging
  api.interceptors.response.use(
    (response) => {
      console.log(
        `API Response: ${response.status} ${response.config.url}`,
        response.data,
      );
      return response;
    },
    (error) => {
      console.error(
        "API Response Error:",
        error.response?.data || error.message,
      );
      return Promise.reject(error);
    },
  );
}

// Authentication API calls
export const authAPI = {
  login: (credentials) => api.post("/login/", credentials),

  register: (userData) => api.post("/register/", userData),

  logout: () => api.post("/logout/"),
};

// Tasks API calls
export const tasksAPI = {
  getTasks: () => api.get("/tasks/"),

  getTask: (id) => api.get(`/tasks/${id}/`),

  createTask: (taskData) => api.post("/tasks/", taskData),

  updateTask: (id, taskData) => api.put(`/tasks/${id}/`, taskData),

  patchTask: (id, taskData) => api.patch(`/tasks/${id}/`, taskData),

  deleteTask: (id) => api.delete(`/tasks/${id}/`),
};
