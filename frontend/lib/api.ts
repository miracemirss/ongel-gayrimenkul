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
    const publicRoutes = ['/public'];
    
    // Only GET /cms/pages/:type (where type is 'about', 'services', or 'mortgage') is public
    // All other CMS endpoints require authentication
    const isPublicCmsRoute = 
      config.method?.toLowerCase() === 'get' &&
      config.url?.match(/^\/cms\/pages\/(about|services|mortgage)$/i);
    
    const isPublicRoute = publicRoutes.some(route => config.url?.includes(route)) || isPublicCmsRoute;
    
    if (isPublicRoute) {
      return config;
    }
    
    // Add token for all other requests
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
      const token = localStorage.getItem('access_token');
      
      // Check if token is expired (optional check)
      // The backend already validated the token, so this is just for user feedback
      
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/onglgyrmnkl-admin')) {
        window.location.href = '/onglgyrmnkl-admin';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

