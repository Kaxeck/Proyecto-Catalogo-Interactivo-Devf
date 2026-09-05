import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

// Custom Hook para acceder fácilmente al estado global del carrito de compras
export const useCart = () => {
  // Consumo del CartContext
  const context = useContext(CartContext);

  // Validación de seguridad para asegurarse de que el componente esté dentro de CartProvider
  if (!context) {
    throw new Error('useCart debe ser utilizado dentro de un CartProvider');
  }

  return context;
};
