import { useCart } from '../../hooks/useCart';

// Botón flotante fijado en la esquina inferior para acceso rápido al carrito con contador dinámico
const BotonFlotante = () => {
  const { totalItems, setIsCartOpen, isCartOpen } = useCart();

  // Se oculta automáticamente cuando el drawer del carrito está abierto para no superponerse
  if (isCartOpen) return null;

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="boton-flotante"
      aria-label="Abrir carrito de compras"
      title="Ver carrito de compras"
    >
      <i className="bx bx-cart bx-md"></i>
      {totalItems > 0 && <span className="badge-contador">{totalItems}</span>}
    </button>
  );
};

export default BotonFlotante;
