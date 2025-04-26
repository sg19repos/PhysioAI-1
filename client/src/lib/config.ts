export const config = {
  apiUrl: import.meta.env.VITE_API_URL || (import.meta.env.DEV 
    ? 'http://localhost:5000/api' 
    : '/api'),
  environment: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
}; 