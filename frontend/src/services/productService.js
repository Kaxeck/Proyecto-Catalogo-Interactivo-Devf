import { api } from '../api';
import { allProducts, getProductById as getMockProductById, promocionesData } from '../data/mockData';

// Servicio de Productos: consume la API REST de Express con fallback automático a mockData si el servidor está apagado

// Obtiene la lista completa de productos con soporte para filtros
export const getProducts = async (params = {}) => {
  try {
    const response = await api.get('/products', { params });
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return allProducts;
  } catch {
    // Si el backend aún no está encendido o no responde, utilizamos los datos locales de respaldo
    console.info('[productService] Backend no disponible, utilizando mockData local.');
    return allProducts;
  }
};

// Obtiene la ficha técnica de un producto por su ID
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    if (response.data) {
      return response.data;
    }
    return getMockProductById(id);
  } catch {
    console.info(`[productService] Detalle de producto #${id} obtenido desde mockData local.`);
    return getMockProductById(id);
  }
};

// Obtiene los muebles destacados en promoción para el carrusel
export const getPromociones = async () => {
  try {
    const response = await api.get('/products/promociones');
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return promocionesData;
  } catch {
    return promocionesData;
  }
};
