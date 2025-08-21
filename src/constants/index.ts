export const APP_CONFIG = {
  name: 'REVOX',
  description: 'バイク整備記録アプリ',
  version: '1.0.0',
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
  googleClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  BIKES: '/bikes',
  BIKE_DETAIL: '/bikes/:bikeId',
  MAINTENANCE: '/maintenance',
  AI: '/ai',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
} as const;

export const QUERY_KEYS = {
  BIKES: 'bikes',
  BIKE: 'bike',
  CATEGORIES: 'categories',
  MAINTENANCE_TASKS: 'maintenance-tasks',
  AI_QUESTIONS: 'ai-questions',
  USER: 'user',
} as const;