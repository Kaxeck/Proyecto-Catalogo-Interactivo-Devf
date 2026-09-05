import { useCart } from '../../hooks/useCart';

// Notificación emergente (Toast): confirma al usuario cuando un mueble ha sido agregado con éxito al carrito
const Toast = () => {
  // Consume el estado de notificación global y los métodos de apertura del carrito
  const { toastData, closeNotification, setIsCartOpen } = useCart();

  if (!toastData || !toastData.producto) return null;

  const { producto } = toastData;

  // Cierra la notificación y despliega de inmediato el panel lateral del carrito
  const abrirCarrito = () => {
    closeNotification();
    setIsCartOpen(true);
  };

  return (
    <div className="popup-agregado-contenedor" role="dialog" aria-live="polite">
      <div className="popup-agregado-card">
        <div className="popup-agregado-header">
          <div className="popup-agregado-titulo">
            <i className="bx bx-check-circle popup-icono-check"></i>
            <span>¡Agregado al Carrito!</span>
          </div>
          <button
            type="button"
            className="popup-btn-cerrar"
            onClick={closeNotification}
            aria-label="Cerrar notificación"
          >
            &times;
          </button>
        </div>

        <div className="popup-agregado-body">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="popup-agregado-img"
          />
          <div className="popup-agregado-detalles">
            <h4 className="popup-producto-nombre">{producto.nombre}</h4>
            <div className="popup-producto-precios">
              <span className="popup-precio">
                ${(producto.precioDescuento || producto.precioOriginal).toLocaleString()} MXN
              </span>
            </div>
          </div>
        </div>

        <div className="popup-agregado-acciones">
          <button
            type="button"
            className="popup-btn-ver-carrito"
            onClick={abrirCarrito}
          >
            <i className="bx bx-cart"></i> Ver Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
