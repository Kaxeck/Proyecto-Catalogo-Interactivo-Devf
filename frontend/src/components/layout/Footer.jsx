import { useState } from 'react';
import { z } from 'zod';

// Esquema de validación con Zod para el formulario de Newsletter
const newsletterSchema = z
  .string()
  .trim()
  .min(1, 'Por favor, ingresa tu correo electrónico.')
  .email('Ingresa un correo electrónico válido (ej. usuario@correo.com)');

// Componente de Pie de Página: incluye formulario de Newsletter, enlaces institucionales y pasarelas de pago
const Footer = () => {
  // Estado local para captura de correo y retroalimentación visual al usuario
  const [email, setEmail] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  // Maneja el envío del formulario con validación Zod y persistencia local
  const handleSuscripcion = (e) => {
    e.preventDefault();
    setMensajeError('');
    setMensajeExito('');

    // 1. Validación de esquema con Zod
    const resultado = newsletterSchema.safeParse(email);
    if (!resultado.success) {
      setMensajeError(resultado.error.issues[0]?.message || 'Correo inválido.');
      return;
    }

    // 2. Control de duplicados en el almacenamiento local
    try {
      const suscriptores = JSON.parse(localStorage.getItem('nordic_newsletter') || '[]');
      const correoNormalizado = email.trim().toLowerCase();

      if (suscriptores.includes(correoNormalizado)) {
        setMensajeError('Este correo electrónico ya se encuentra suscrito a nuestro Newsletter.');
        return;
      }

      suscriptores.push(correoNormalizado);
      localStorage.setItem('nordic_newsletter', JSON.stringify(suscriptores));
    } catch {
      // Continuar en caso de fallo en almacenamiento
    }

    // 3. Confirmación de suscripción exitosa
    setMensajeExito('¡Gracias por suscribirte! Pronto recibirás novedades y descuentos exclusivos.');
    setEmail('');
    setTimeout(() => setMensajeExito(''), 5000);
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
          <form className="form-suscripcion" onSubmit={handleSuscripcion} noValidate>
            <label htmlFor="newsletter-email">Correo Electrónico:</label>
            <div className="contenedor-form-suscripcion">
              <input
                id="newsletter-email"
                type="email"
                placeholder="Deja tu correo"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (mensajeError) setMensajeError('');
                }}
                className={mensajeError ? 'has-error' : ''}
              />
              <button type="submit">Suscribirse</button>
            </div>

            {/* Mensaje de error de validación */}
            {mensajeError && (
              <p className="newsletter-feedback error">
                <i className="bx bx-error-circle"></i> {mensajeError}
              </p>
            )}

            {/* Mensaje de éxito */}
            {mensajeExito && (
              <p className="newsletter-feedback exito">
                <i className="bx bx-check-circle"></i> {mensajeExito}
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
