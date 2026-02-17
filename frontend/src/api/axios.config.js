import axios from "axios";
console.log('API URL:', import.meta.env.VITE_API_URL);  // ← Add this

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Add Token to requests
api.interceptors.request.use(
  (config) => {
     console.log('Making request to:', config.url);
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log('Request error:', error); 
    return Promise.reject(error);
  }
);

// Handle Response errors
api.interceptors.response.use(
  (response) => response.data,
  
  (error) => {
    console.log('Response error:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;