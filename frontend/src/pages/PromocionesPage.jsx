import ProductCard from '../components/products/ProductCard';
import PromotionCarousel from '../components/products/PromotionCarousel';
import { promocionesData } from '../data/mockData';

// Página de Promociones: muestra muebles con descuentos activos tanto en carrusel horizontal como en cuadrícula completa
const PromocionesPage = () => {
  return (
    <main style={{ paddingBottom: '3rem' }}>
      <section className="espacio_promociones">
        <h1>Promociones Especiales</h1>
        <p style={{ textAlign: 'center', color: '#555', marginBottom: '2.5rem' }}>
          Aprovecha los descuentos exclusivos en piezas seleccionadas de diseño nórdico.
        </p>

        <h2 style={{ textAlign: 'left', marginBottom: '1rem', fontSize: '1.5rem' }}>
          Ofertas Destacadas en Carrusel
        </h2>
        <PromotionCarousel productos={promocionesData} />

        <h2 style={{ textAlign: 'left', marginTop: '3rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
          Todas las Ofertas Disponibles
        </h2>
        <div className="catalogo-grid">
          {promocionesData.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default PromocionesPage;
