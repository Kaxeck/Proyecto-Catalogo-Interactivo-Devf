import { api } from '../api';

// Servicio de Pedidos: envía el carrito de compras a la base de datos y consulta el historial

// Envía la orden de compra generada desde el carrito
export const createOrderRequest = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return {
      success: true,
      order: response.data.order || response.data,
    };
  } catch {
    console.info('[orderService] Backend offline, registrando orden local simulada.');
    return {
      success: true,
      simulated: true,
      order: {
        id: `ord_${Date.now()}`,
        ...orderData,
        estado: 'pagado',
        fecha: new Date().toISOString(),
      },
    };
  }
};

// Obtiene el historial de órdenes del usuario autenticado
export const getMyOrdersRequest = async () => {
  try {
    const response = await api.get('/orders/my-orders');
    return response.data || [];
  } catch {
    return [];
  }
};
