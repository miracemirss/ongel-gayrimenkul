export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'agent';
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// Import token utils dynamically to avoid circular dependencies
let tokenUtils: any = null;
function getTokenUtils() {
  if (!tokenUtils && typeof window !== 'undefined') {
    try {
      tokenUtils = require('./token-utils');
    } catch (e) {
      console.warn('Token utils not available:', e);
    }
  }
  return tokenUtils;
}

export const auth = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(errorData.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    }

    const data: AuthResponse = await response.json();
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/onglgyrmnkl-admin';
  },

  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  },

  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  },

  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    
    // Check if token is expired
    const utils = getTokenUtils();
    if (utils && utils.isTokenExpired) {
      try {
        if (utils.isTokenExpired(token)) {
          // Token expired, clear it
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          return false;
        }
      } catch (error) {
        // If token validation fails, assume token is valid to avoid false negatives
        console.warn('Token validation error:', error);
      }
    }
    
    return true;
  },
  
  checkTokenValidity: (): boolean => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    
    const utils = getTokenUtils();
    if (utils && utils.isTokenExpired) {
      try {
        return !utils.isTokenExpired(token);
      } catch (error) {
        return false;
      }
    }
    return true; // If utils not available, assume valid
  },
};

