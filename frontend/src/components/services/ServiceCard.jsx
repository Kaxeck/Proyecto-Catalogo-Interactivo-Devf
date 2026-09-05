// Tarjeta de Servicio: destaca beneficios comerciales (envíos, atención al cliente y garantías) con iconografía Boxicons
const ServiceCard = ({ servicio }) => {
  return (
    <article className="servicios-card">
      <i className={servicio.icono}></i>

      <h3>{servicio.titulo1}</h3>
      <h3>{servicio.titulo2}</h3>

      <p>{servicio.descripcion1}</p>
      <p>{servicio.descripcion2}</p>
    </article>
  );
};

export default ServiceCard;
