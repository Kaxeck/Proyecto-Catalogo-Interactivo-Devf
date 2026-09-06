import { api } from '../api';

// Servicio de Autenticación: maneja las solicitudes de login, registro y perfil con la API REST

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
    const mensaje =
      error.response?.data?.message || 'Error de conexión con el servidor de autenticación.';
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
    const mensaje =
      error.response?.data?.message || 'Error al comunicarse con el servidor de registro.';
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
    return {
      success: false,
      message: 'No se pudo obtener el perfil del usuario.',
    };
  }
};
