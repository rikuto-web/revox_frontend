import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

export const getTokenExpirationTime = (token: string): Date | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return new Date(decoded.exp * 1000);
  } catch {
    return null;
  }
};

export const getUserIdFromToken = (token: string): string | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.sub;
  } catch {
    return null;
  }
};

export const setupTokenRefresh = (token: string, onTokenExpired: () => void) => {
  const expirationTime = getTokenExpirationTime(token);
  
  if (!expirationTime) {
    onTokenExpired();
    return;
  }

  const timeUntilExpiration = expirationTime.getTime() - Date.now();
  const refreshTime = Math.max(timeUntilExpiration - 60000, 0);
  setTimeout(() => {
    onTokenExpired();
  }, refreshTime);
};