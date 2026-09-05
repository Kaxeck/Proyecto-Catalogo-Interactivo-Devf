// Franja superior de avisos: marquesina con animación continua en bucle infinito (CSS spin)
const TopBanner = () => {
  return (
    <header className="top-banner">
      <div className="grupo-banner">
        <p>Envios gratis a partir de $499</p>
        <p>Atencion al cliente 24/7</p>
        <p>Devoluciones gratis en 30 dias</p>
        <p>Pago 100% seguro y confiable</p>
      </div>
      {/* Segundo bloque clonado con aria-hidden para mantener el flujo continuo de la marquesina */}
      <div aria-hidden="true" className="grupo-banner">
        <p>Envios gratis a partir de $499</p>
        <p>Atencion al cliente 24/7</p>
        <p>Devoluciones gratis en 30 dias</p>
        <p>Pago 100% seguro y confiable</p>
      </div>
    </header>
  );
};

export default TopBanner;
