import { memo } from 'react';

/**
 * Tarjeta de Servicio (ServiceCard)
 * Optimizado con React.memo para evitar re-renderizados estáticos
 */
const ServiceCard = memo(({ servicio }) => {
  return (
    <article className="servicios-card">
      <i className={servicio.icono}></i>

      <h3>{servicio.titulo1}</h3>
      <h3>{servicio.titulo2}</h3>

      <p>{servicio.descripcion1}</p>
      <p>{servicio.descripcion2}</p>
    </article>
  );
});

ServiceCard.displayName = 'ServiceCard';

export default ServiceCard;
