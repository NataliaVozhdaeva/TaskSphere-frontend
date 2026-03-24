import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await api({
      url: endpoint,
      ...options,
    });
    
    return response.data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  login: (credentials) => api.post('/login/', credentials),
  
  register: (userData) => api.post('/register/', userData),
  
  logout: () => api.post('/logout/'),
};

// Tasks API calls
export const tasksAPI = {
  getTasks: () => api.get('/tasks/'),
  
  getTask: (id) => api.get(`/tasks/${id}/`),
  
  createTask: (taskData) => api.post('/tasks/', taskData),
  
  updateTask: (id, taskData) => api.put(`/tasks/${id}/`, taskData),
  
  patchTask: (id, taskData) => api.patch(`/tasks/${id}/`, taskData),
  
  deleteTask: (id) => api.delete(`/tasks/${id}/`),
};
