import { useState } from 'react';

// Componente de Pie de Página: incluye formulario de Newsletter, enlaces institucionales y pasarelas de pago
const Footer = () => {
  // Estado local para captura de correo y retroalimentación visual al usuario
  const [email, setEmail] = useState('');
  const [suscrito, setSuscrito] = useState(false);

  // Maneja el envío del formulario y resetea el campo tras confirmar suscripción
  const handleSuscripcion = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSuscrito(true);
      setEmail('');
      setTimeout(() => setSuscrito(false), 4000);
    }
  };

  return (
    <footer>
      {/* Sección Newsletter con formulario interactivo */}
      <aside className="newsletter">
        <h2 className="txt-newsletter">
          <span>Suscríbete a</span>
          <span>nuestro Newsletter</span>
        </h2>
        <div className="contenedor-newsletter">
          <form className="form-suscripcion" onSubmit={handleSuscripcion}>
            <label htmlFor="newsletter-email">Correo Electrónico:</label>
            <div className="contenedor-form-suscripcion">
              <input
                id="newsletter-email"
                type="email"
                placeholder="Deja tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Suscribirse</button>
            </div>
            {suscrito && (
              <p className="newsletter-feedback">
                ¡Gracias por suscribirte! Pronto recibirás novedades y descuentos exclusivos.
              </p>
            )}
          </form>
        </div>
      </aside>

      {/* Bloques de enlaces de información, redes sociales y métodos de pago */}
      <div className="contactanos-pagos">
        <section>
          <h3>Informacion</h3>
          <ul className="lista-informacion">
            <li>
              <a href="https://www.google.com/" target="_blank" rel="noopener noreferrer">
                Terminos y Condiciones
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
                Politica de Privacidad
              </a>
            </li>
            <li>
              <a href="https://www.wikipedia.org/" target="_blank" rel="noopener noreferrer">
                Envios y Devoluciones
              </a>
            </li>
            <li>
              <a href="https://www.amazon.com.mx/" target="_blank" rel="noopener noreferrer">
                Sobre Nosotros
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h3>Siguenos</h3>
          <ul className="listas-footer">
            <li>
              <a href="https://www.facebook.com/mexicohm" target="_blank" rel="noopener noreferrer">
                <i className="bxl bx-facebook-circle bx-sm"></i>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/hm/" target="_blank" rel="noopener noreferrer">
                <i className="bxl bx-instagram bx-sm"></i>
              </a>
            </li>
            <li>
              <a href="https://www.tiktok.com/@calvinklein?lang=es" target="_blank" rel="noopener noreferrer">
                <i className="bxl bx-tiktok bx-sm"></i>
              </a>
            </li>
            <li>
              <a href="https://x.com/CalvinKlein" target="_blank" rel="noopener noreferrer">
                <i className="bxl bx-twitter-x bx-sm"></i>
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h3>Metodos de pago</h3>
          <ul className="listas-footer">
            <li><i className="bxl bx-visa bx-md"></i> Visa</li>
            <li><i className="bxl bx-mastercard bx-md"></i> Mastercard</li>
            <li><i className="bxl bx-paypal bx-md"></i> PayPal</li>
            <li><i className="bxl bx-amex bx-md"></i> American Express</li>
          </ul>
        </section>
      </div>

      <section>
        <p>Derechos reservados © {new Date().getFullYear()} Muebles Nordic</p>
      </section>
    </footer>
  );
};

export default Footer;
