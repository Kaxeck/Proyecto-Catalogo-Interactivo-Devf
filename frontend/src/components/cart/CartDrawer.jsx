import { useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import Boton from '../common/Boton';
import { createOrderRequest } from '../../services/orderService';

// Panel lateral (Drawer) del Carrito: lista de productos, control de cantidades (+/-), desglose de envío y total
const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
    totalItems,
    closeNotification,
  } = useCart();

  const navigate = useNavigate();

  // Procesa la orden de compra en la API de Express (o fallback simulado si está offline)
  const handleCheckout = async () => {
    const totalFinal = totalPrice >= 200 ? totalPrice : totalPrice + 99;
    const costoEnvio = totalPrice >= 200 ? 0 : 99;

    await createOrderRequest({
      productos: cart.map((item) => ({
        producto: item.id,
        cantidad: item.cantidad,
        precioUnitario: item.precioDescuento || item.precioOriginal,
      })),
      subtotal: totalPrice,
      costoEnvio,
      total: totalFinal,
    });

    alert(
      `¡Gracias por tu compra!\nTotal procesado: $${totalFinal.toLocaleString()} MXN\nTu orden ha sido registrada con éxito.`
    );
    clearCart();
    setIsCartOpen(false);
  };

  // Bloquea el scroll de la página de fondo cuando el carrito está abierto para evitar desplazamiento no deseado
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      if (closeNotification) closeNotification();
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen, closeNotification]);

  if (!isCartOpen) return null;

  // Cierra el carrito y redirige al catálogo general
  const irAlCatalogo = () => {
    setIsCartOpen(false);
    navigate('/catalogo');
  };

  // Cierra el carrito y navega a la ficha del producto seleccionado
  const verProducto = (id) => {
    setIsCartOpen(false);
    navigate(`/producto/${id}`);
  };

  return (
    <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <div className="cart-header-title">
            <i className="bx bx-shopping-bag"></i>
            <h3>Carrito de Compras</h3>
            <span className="cart-header-badge">{totalItems}</span>
          </div>
          <button
            type="button"
            className="btn-cerrar-cart"
            onClick={() => setIsCartOpen(false)}
            aria-label="Cerrar carrito"
          >
            <i className="bx bx-x"></i>
          </button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-vacio">
              <div className="cart-vacio-icono">
                <i className="bx bx-cart"></i>
              </div>
              <h4>Tu carrito está vacío</h4>
              <p>Explora nuestras colecciones nórdicas y encuentra la pieza perfecta para tu hogar.</p>
              <div style={{ marginTop: '24px' }}>
                <Boton
                  texto="Explorar Catálogo"
                  onClick={irAlCatalogo}
                  className="btn-secondary"
                  style={{ width: '100%', padding: '12px' }}
                />
              </div>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="cart-item-img"
                    onClick={() => verProducto(item.id)}
                    style={{ cursor: 'pointer' }}
                    title="Ver detalle"
                  />
                  <div className="cart-item-info">
                    <h4
                      className="cart-item-nombre"
                      onClick={() => verProducto(item.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {item.nombre}
                    </h4>
                    <span className="cart-item-categoria">{item.categoria}</span>
                    <div className="cart-item-precio">
                      ${((item.precioDescuento || item.precioOriginal) * item.cantidad).toLocaleString()} MXN
                    </div>
                  </div>
                  <div className="cart-item-acciones">
                    <div className="cart-qty-control">
                      <button
                        type="button"
                        className="cart-btn-qty"
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label="Disminuir cantidad"
                      >
                        -
                      </button>
                      <span className="cart-qty-number">{item.cantidad}</span>
                      <button
                        type="button"
                        className="cart-btn-qty"
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="cart-btn-eliminar"
                      onClick={() => removeFromCart(item.id)}
                      title="Eliminar del carrito"
                      aria-label="Eliminar del carrito"
                    >
                      <i className="bx bx-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-resumen-fila">
              <span>Subtotal:</span>
              <span>${totalPrice.toLocaleString()} MXN</span>
            </div>
            <div className="cart-resumen-fila envio">
              <span>Envío nacional:</span>
              <span className="texto-verde">
                {totalPrice >= 200 ? 'Gratis' : '$99 MXN'}
              </span>
            </div>
            <div className="cart-total-row">
              <span>Total Estimado:</span>
              <span>
                ${(totalPrice >= 200 ? totalPrice : totalPrice + 99).toLocaleString()} MXN
              </span>
            </div>

            <div className="cart-acciones-botones">
              <Boton
                texto="Vaciar"
                onClick={clearCart}
                className="btn-outline-danger"
              />
              <Boton
                texto="Continuar Compra"
                onClick={handleCheckout}
                className="btn-checkout"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
