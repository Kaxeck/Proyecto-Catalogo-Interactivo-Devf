import { createContext, useState, useEffect } from 'react';

// Creación del Contexto global para el carrito de compras
export const CartContext = createContext();

// Proveedor del estado global del carrito (CartProvider)
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

  // Muestra el popup de notificación y lo oculta automáticamente tras 3.5 segundos
  const showNotification = (data) => {
    setToastData(data);
    setTimeout(() => {
      setToastData(null);
    }, 3500);
  };

  // Cierra manualmente el popup de notificación
  const closeNotification = () => {
    setToastData(null);
  };

  // Función para agregar un producto al carrito (o sumar cantidad si ya existe)
  const addToCart = (producto, cantidad = 1) => {
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
  };

  // Función para eliminar un producto del carrito por su ID
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Función para actualizar la cantidad de un producto (+1 o -1)
  const updateQuantity = (id, delta) => {
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
  };

  // Función para vaciar completamente el carrito de compras
  const clearCart = () => {
    setCart([]);
  };

  // Cálculos derivados: Cantidad total de artículos y precio total acumulado
  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrice = cart.reduce(
    (acc, item) => acc + (item.precioDescuento || item.precioOriginal || 0) * item.cantidad,
    0
  );

  return (
    // Proveedor con todos los valores y métodos compartidos
    <CartContext.Provider
      value={{
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
