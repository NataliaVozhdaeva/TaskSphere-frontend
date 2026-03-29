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
  getTasks: async () => {
    const response = await api.get("/tasks/");
    return response.data;
  },

  getTask: async (id) => {
    const response = await api.get(`/tasks/${id}/`);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post("/tasks/", taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}/`, taskData);
    return response.data;
  },

  patchTask: async (id, taskData) => {
    const response = await api.patch(`/tasks/${id}/`, taskData);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}/`);
    return response.data;
  },
};
