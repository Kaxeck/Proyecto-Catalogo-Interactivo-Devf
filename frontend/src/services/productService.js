import { api } from '../api';

/**
 * Servicio de Productos: Consume la API RESTful de Express conectada a MongoDB Atlas
 */

// Obtiene la lista completa de productos desde la base de datos (con soporte para filtros de categoría y búsqueda)
export const getProducts = async (params = {}) => {
  try {
    const response = await api.get('/products', { params });
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('[productService] Error al obtener productos del backend:', error);
    throw error;
  }
};

// Obtiene la ficha técnica de un producto por su ID (_id) desde MongoDB
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`[productService] Error al obtener producto #${id}:`, error);
    throw error;
  }
};

// Obtiene los muebles destacados en promoción o con descuento desde MongoDB
export const getPromociones = async () => {
  try {
    const response = await api.get('/products/promociones');
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('[productService] Error al obtener promociones del backend:', error);
    throw error;
  }
};
