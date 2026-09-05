import ProductCard from './ProductCard';

// Carrusel horizontal de promociones destacadas: renderiza una lista desplazable de tarjetas de producto
const PromotionCarousel = ({ productos = [] }) => {
  return (
    <div className="promociones-carrousel">
      <div className="promocion-contenedor">
        {productos.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  );
};

export default PromotionCarousel;
