import { api } from '../api';

/**
 * Servicio de Contenido Editorial: consume las colecciones de Ideas y Servicios desde MongoDB Atlas
 */

// Obtiene los artículos de ideas e inspiración de diseño
export const getIdeas = async () => {
  try {
    const response = await api.get('/ideas');
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('[contentService] Error al obtener ideas:', error);
    throw error;
  }
};

// Obtiene la lista de servicios y garantías
export const getServices = async () => {
  try {
    const response = await api.get('/services');
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('[contentService] Error al obtener servicios:', error);
    throw error;
  }
};
