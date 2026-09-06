import { api } from '../api';

/**
 * Servicio de Autenticación: maneja las solicitudes de login, registro y perfil con la API REST
 * Incluye extracción y formateo inteligente de errores de express-validator y errorHandler
 */

// Extrae el mensaje de error de respuestas HTTP, soportando express-validator y errorHandler
const extractErrorMessage = (error, defaultFallback) => {
  if (!error.response) return defaultFallback;
  const data = error.response.data;

  // 1. Manejo de arreglo de errores de express-validator: [{ msg: '...', path: '...' }]
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.map((err) => err.msg || err.message).join('. ');
  }

  // 2. Manejo de middleware errorHandler de Express: { error: { message: '...' } }
  if (data?.error?.message) {
    return data.error.message;
  }

  // 3. Manejo de respuesta estándar de Express: { message: '...' }
  if (data?.message) {
    return data.message;
  }

  return defaultFallback;
};

// Inicia sesión enviando credenciales al backend
export const loginRequest = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return {
      success: true,
      token: response.data.token,
      user: response.data.user,
    };
  } catch (error) {
    const mensaje = extractErrorMessage(
      error,
      'Error de conexión con el servidor de autenticación.'
    );
    return {
      success: false,
      message: mensaje,
      networkError: !error.response,
    };
  }
};

// Registra un nuevo usuario en la base de datos
export const registerRequest = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return {
      success: true,
      token: response.data.token,
      user: response.data.user,
    };
  } catch (error) {
    const mensaje = extractErrorMessage(
      error,
      'Error al comunicarse con el servidor de registro.'
    );
    return {
      success: false,
      message: mensaje,
      networkError: !error.response,
    };
  }
};

// Obtiene los datos del perfil activo utilizando el token JWT
export const getProfileRequest = async () => {
  try {
    const response = await api.get('/auth/profile');
    return {
      success: true,
      user: response.data.user || response.data,
    };
  } catch (error) {
    const mensaje = extractErrorMessage(
      error,
      'No se pudo obtener el perfil del usuario.'
    );
    return {
      success: false,
      message: mensaje,
    };
  }
};
