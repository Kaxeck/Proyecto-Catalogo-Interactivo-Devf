import { useState, useEffect } from 'react';
import ServiceCard from '../components/services/ServiceCard';
import { getServices } from '../services/contentService';

// Página de Servicios: consulta los servicios y garantías desde MongoDB Atlas
const ServiciosPage = () => {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchServices = async () => {
      try {
        setCargando(true);
        const data = await getServices();
        if (isMounted) setServicios(data);
      } catch {
        if (isMounted) setError('No se pudieron cargar los servicios.');
      } finally {
        if (isMounted) setCargando(false);
      }
    };

    fetchServices();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main style={{ paddingBottom: '4rem' }}>
      <section id="servicios">
        <h1>Nuestros Servicios</h1>
        <p style={{ textAlign: 'center', color: '#555', marginBottom: '2.5rem' }}>
          Compromiso, calidad y respaldo en cada entrega y atención posventa.
        </p>

        {cargando && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <i className="bx bx-loader-alt bx-spin" style={{ fontSize: '36px', color: '#2C3E50' }}></i>
          </div>
        )}

        {!cargando && error && (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#E74C3C' }}>
            <p>{error}</p>
          </div>
        )}

        {!cargando && !error && (
          <div className="servicios-contenedor">
            {servicios.map((servicio) => (
              <ServiceCard key={servicio.id || servicio._id} servicio={servicio} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default ServiciosPage;
