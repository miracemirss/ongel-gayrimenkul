import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token (skip for public endpoints)
api.interceptors.request.use(
  (config) => {
    // Don't add token for public endpoints
    const publicRoutes = ['/public', '/cms/pages/'];
    const isPublicRoute = publicRoutes.some(route => config.url?.includes(route));
    
    if (isPublicRoute) {
      return config;
    }
    
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to admin login
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/onglgyrmnkl-admin';
    }
    return Promise.reject(error);
  }
);

export default api;

