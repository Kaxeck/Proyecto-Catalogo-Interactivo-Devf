import axios from 'axios';

// Instancia centralizada de Axios para la comunicación con el Backend en Express
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // Tiempo límite de 5 segundos por petición
});

// Interceptor de peticiones: adjunta automáticamente el token JWT en las solicitudes privadas
api.interceptors.request.use(
  (config) => {
    try {
      // 1. Obtención directa del token JWT
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      }

      // 2. Fallback por si la sesión está empaquetada en el objeto 'nordic_user'
      const savedUser = localStorage.getItem('nordic_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (e) {
      console.error('Error al recuperar token de sesión:', e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas: manejo unificado de errores de red o expiración de sesión
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el servidor responde 401 (No autorizado / token expirado), se puede limpiar la sesión
    if (error.response && error.response.status === 401) {
      console.warn('Sesión no autorizada o expirada en el servidor.');
    }
    return Promise.reject(error);
  }
);

export default api;
