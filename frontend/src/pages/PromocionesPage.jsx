import { useState, useEffect } from 'react';
import ProductCard from '../components/products/ProductCard';
import PromotionCarousel from '../components/products/PromotionCarousel';
import { getPromociones } from '../services/productService';

// Página de Promociones: consulta ofertas y muebles con descuento desde MongoDB Atlas
const PromocionesPage = () => {
  const [promociones, setPromociones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPromos = async () => {
      try {
        setCargando(true);
        setError(null);
        const data = await getPromociones();
        if (isMounted) {
          setPromociones(data);
        }
      } catch {
        if (isMounted) {
          setError('No fue posible cargar las promociones desde el servidor.');
        }
      } finally {
        if (isMounted) {
          setCargando(false);
        }
      }
    };

    fetchPromos();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main style={{ paddingBottom: '3rem' }}>
      <section className="espacio_promociones">
        <h1>Promociones Especiales</h1>
        <p style={{ textAlign: 'center', color: '#555', marginBottom: '2.5rem' }}>
          Aprovecha los descuentos exclusivos en piezas seleccionadas de diseño nórdico.
        </p>

        {cargando && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <i className="bx bx-loader-alt bx-spin" style={{ fontSize: '40px', color: '#2C3E50' }}></i>
            <p style={{ marginTop: '1rem', color: '#7F8C8D' }}>Cargando ofertas activas...</p>
          </div>
        )}

        {!cargando && error && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p style={{ color: '#E74C3C' }}>{error}</p>
          </div>
        )}

        {!cargando && !error && (
          <>
            <h2 style={{ textAlign: 'left', marginBottom: '1rem', fontSize: '1.5rem' }}>
              Ofertas Destacadas en Carrusel
            </h2>
            <PromotionCarousel productos={promociones} />

            <h2 style={{ textAlign: 'left', marginTop: '3rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
              Todas las Ofertas Disponibles ({promociones.length})
            </h2>
            <div className="catalogo-grid">
              {promociones.map((producto) => (
                <ProductCard key={producto.id || producto._id} producto={producto} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default PromocionesPage;
