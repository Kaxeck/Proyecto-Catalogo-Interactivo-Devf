import ServiceCard from '../components/services/ServiceCard';
import { serviciosData } from '../data/mockData';

// Página de Servicios: exposición detallada de coberturas de envío, soporte 24/7 y políticas de satisfacción
const ServiciosPage = () => {
  return (
    <main style={{ paddingBottom: '4rem' }}>
      <section id="servicios">
        <h1>Nuestros Servicios</h1>
        <p style={{ textAlign: 'center', color: '#555', marginBottom: '2.5rem' }}>
          Compromiso, calidad y respaldo en cada entrega y atención posventa.
        </p>

        <div className="servicios-contenedor">
          {serviciosData.map((servicio) => (
            <ServiceCard key={servicio.id} servicio={servicio} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default ServiciosPage;
