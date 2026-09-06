import { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

/**
 * Tarjeta de Producto (ProductCard)
 * Optimizado con React.memo para evitar re-renders innecesarios en listas grandes de productos
 */
const ProductCard = memo(({ producto }) => {
  const [esFavorito, setEsFavorito] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Alterna el estado del corazón de favoritos sin disparar la navegación al detalle
  const toggleFavorito = useCallback((e) => {
    e.stopPropagation();
    setEsFavorito((prev) => !prev);
  }, []);

  // Agrega el mueble directamente al carrito sin activar la navegación de la tarjeta
  const handleAddToCart = useCallback((e) => {
    e.stopPropagation();
    addToCart(producto);
  }, [addToCart, producto]);

  const handleNavegarDetalle = useCallback(() => {
    navigate(`/producto/${producto.id}`);
  }, [navigate, producto.id]);

  return (
    <div
      className="producto-tarjeta"
      onClick={handleNavegarDetalle}
      style={{ cursor: 'pointer' }}
      title={`Ver detalles de ${producto.nombre}`}
    >
      {producto.isOfertaPlus && <span className="producto-badge">Oferta Plus</span>}

      <i
        className={`bx bxs-heart bx-sm icono-corazon ${esFavorito ? 'activo' : ''}`}
        onClick={toggleFavorito}
        title={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        aria-label="Favorito"
      ></i>

      <img src={producto.imagen} alt={producto.nombre} className="producto-img" loading="lazy" />

      <h3>{producto.nombre}</h3>

      <div className="precios">
        {producto.precioOriginal && (
          <span className="precios-original">${producto.precioOriginal}</span>
        )}
        <span className="precios-descuento">${producto.precioDescuento}</span>
      </div>

      <button
        type="button"
        className="btn-carrito"
        onClick={handleAddToCart}
        title="Agregar al carrito"
        aria-label={`Agregar ${producto.nombre} al carrito`}
      >
        <i className="bx bx-cart bx-md"></i>
      </button>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
