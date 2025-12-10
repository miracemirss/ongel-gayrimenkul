/**
 * JWT Token utility functions
 */

export interface TokenPayload {
  email: string;
  sub: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Decode JWT token without verification (client-side only)
 * Note: This doesn't verify the signature, only decodes the payload
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return true;
  
  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();
  
  // Add 5 minute buffer to avoid edge cases
  return currentTime >= (expirationTime - 5 * 60 * 1000);
}

/**
 * Get token expiration time in milliseconds
 */
export function getTokenExpirationTime(token: string): number | null {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return null;
  
  return payload.exp * 1000;
}

/**
 * Get time until token expires in milliseconds
 */
export function getTimeUntilExpiration(token: string): number | null {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) return null;
  
  return Math.max(0, expirationTime - Date.now());
}

