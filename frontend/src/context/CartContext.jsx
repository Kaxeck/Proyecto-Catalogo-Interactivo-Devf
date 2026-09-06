/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback, useMemo } from 'react';

// Creación del Contexto global para el carrito de compras
export const CartContext = createContext();

/**
 * Proveedor del estado global del carrito (CartProvider)
 * Optimizado con useCallback y useMemo para evitar renderizados y cálculos innecesarios
 */
export const CartProvider = ({ children }) => {
  // Estado local para los productos del carrito con inicialización persistente desde localStorage
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('nordic_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Estado para controlar la apertura y cierre del panel lateral (drawer)
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Estado para la información del popup emergente al añadir un producto
  const [toastData, setToastData] = useState(null);

  // Efecto para sincronizar automáticamente el carrito en localStorage ante cada cambio
  useEffect(() => {
    try {
      localStorage.setItem('nordic_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error al guardar carrito en localStorage:', e);
    }
  }, [cart]);

  // Cierra manualmente el popup de notificación
  const closeNotification = useCallback(() => {
    setToastData(null);
  }, []);

  // Muestra el popup de notificación y lo oculta automáticamente tras 3.5 segundos
  const showNotification = useCallback((data) => {
    setToastData(data);
    const timer = setTimeout(() => {
      setToastData(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Función para agregar un producto al carrito (o sumar cantidad si ya existe)
  const addToCart = useCallback((producto, cantidad = 1) => {
    setCart((prevCart) => {
      const existe = prevCart.find((item) => item.id === producto.id);
      if (existe) {
        return prevCart.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + cantidad } : item
        );
      }
      return [...prevCart, { ...producto, cantidad: Math.max(1, cantidad) }];
    });

    // Disparar el popup con los datos del mueble agregado
    showNotification({
      producto,
      cantidad,
    });
  }, [showNotification]);

  // Función para eliminar un producto del carrito por su ID
  const removeFromCart = useCallback((id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  }, []);

  // Función para actualizar la cantidad de un producto (+1 o -1)
  const updateQuantity = useCallback((id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const nuevaCantidad = item.cantidad + delta;
            return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  }, []);

  // Función para vaciar completamente el carrito de compras
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Cálculos derivados memoizados: solo se recalculan cuando el contenido del carrito cambia
  const totalItems = useMemo(
    () => cart.reduce((acc, item) => acc + item.cantidad, 0),
    [cart]
  );

  const totalPrice = useMemo(
    () =>
      cart.reduce(
        (acc, item) => acc + (item.precioDescuento || item.precioOriginal || 0) * item.cantidad,
        0
      ),
    [cart]
  );

  // Memorización del valor del contexto: previene re-renderizados masivos en componentes consumidores
  const contextValue = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      isCartOpen,
      setIsCartOpen,
      toastData,
      closeNotification,
      showNotification,
    }),
    [
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      isCartOpen,
      toastData,
      closeNotification,
      showNotification,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
