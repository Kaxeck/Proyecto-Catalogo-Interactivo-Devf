import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import Boton from '../components/common/Boton';

// Página de Autenticación: unifica el Inicio de Sesión, Registro de Cuenta y Panel de Usuario
const AuthPage = ({ defaultTab = 'login' }) => {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const { setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Determina la pestaña inicial según la ruta ("/registro" o "/login") o la propiedad defaultTab
  const [tabActiva, setTabActiva] = useState(() => {
    if (location.pathname === '/registro' || defaultTab === 'registro') {
      return 'registro';
    }
    return 'login';
  });

  // Estados del formulario de Inicio de Sesión
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [mostrarPasswordLogin, setMostrarPasswordLogin] = useState(false);
  const [recordarSesion, setRecordarSesion] = useState(true);

  // Estados del formulario de Registro
  const [regNombre, setRegNombre] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regTelefono, setRegTelefono] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [mostrarPasswordReg, setMostrarPasswordReg] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  // Mensajes de retroalimentación
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  // Sincroniza la pestaña activa si la ruta cambia de /login a /registro o viceversa
  useEffect(() => {
    if (location.pathname === '/registro') {
      setTabActiva('registro');
    } else if (location.pathname === '/login') {
      setTabActiva('login');
    }
    setMensajeError('');
    setMensajeExito('');
  }, [location.pathname]);

  // Manejador del envío de Inicio de Sesión
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setMensajeError('');
    setMensajeExito('');

    if (!loginEmail.trim() || !loginPassword) {
      setMensajeError('Por favor, ingresa tu correo electrónico y contraseña.');
      return;
    }

    const resultado = login(loginEmail, loginPassword);

    if (resultado.success) {
      setMensajeExito('¡Sesión iniciada correctamente! Redirigiendo...');
      setTimeout(() => {
        navigate('/catalogo');
      }, 1200);
    } else {
      setMensajeError(resultado.message || 'Error al iniciar sesión.');
    }
  };

  // Manejador del envío de Registro de Usuario
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setMensajeError('');
    setMensajeExito('');

    if (!regNombre.trim() || !regEmail.trim() || !regPassword) {
      setMensajeError('Por favor, completa todos los campos requeridos.');
      return;
    }

    if (regPassword.length < 6) {
      setMensajeError('La contraseña debe contener al menos 6 caracteres.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setMensajeError('Las contraseñas ingresadas no coinciden.');
      return;
    }

    if (!aceptaTerminos) {
      setMensajeError('Debes aceptar los Términos y Condiciones para crear tu cuenta.');
      return;
    }

    const resultado = register({
      nombre: regNombre,
      email: regEmail,
      telefono: regTelefono,
      password: regPassword,
    });

    if (resultado.success) {
      setMensajeExito('¡Cuenta creada con éxito! Bienvenido a Muebles Nordic.');
      setTimeout(() => {
        navigate('/catalogo');
      }, 1200);
    } else {
      setMensajeError(resultado.message || 'Error al crear la cuenta.');
    }
  };

  // Acción simulada de recuperación de contraseña
  const handleRecuperarPassword = () => {
    const correo = loginEmail.trim();
    if (!correo) {
      alert('Ingresa tu correo electrónico en el campo para enviarte las instrucciones de recuperación.');
    } else {
      alert(`Hemos enviado un enlace de recuperación al correo: ${correo}`);
    }
  };

  // Si el usuario ya se encuentra autenticado, mostramos su panel de perfil
  if (isAuthenticated && user) {
    return (
      <main className="auth-pagina-contenedor">
        <div className="auth-card auth-perfil-card">
          <div className="auth-perfil-avatar">
            <i className="bx bxs-user-check"></i>
          </div>

          <h2>¡Hola, {user.nombre}!</h2>
          <p className="auth-perfil-email">{user.email}</p>
          <span className="auth-perfil-badge">
            <i className="bx bx-badge-check"></i> Cuenta Activa
          </span>

          <div className="auth-perfil-detalles">
            <div className="auth-perfil-fila">
              <span>Nombre registrado:</span>
              <strong>{user.nombre}</strong>
            </div>
            {user.telefono && (
              <div className="auth-perfil-fila">
                <span>Teléfono de contacto:</span>
                <strong>{user.telefono}</strong>
              </div>
            )}
            <div className="auth-perfil-fila">
              <span>Fecha de registro:</span>
              <strong>{user.fechaRegistro || 'Reciente'}</strong>
            </div>
          </div>

          <div className="auth-perfil-acciones">
            <Link to="/catalogo" style={{ textDecoration: 'none' }}>
              <Boton
                texto="Explorar Catálogo"
                className="btn-primary"
                style={{ width: '100%', padding: '12px' }}
              />
            </Link>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsCartOpen(true)}
              style={{ width: '100%', padding: '12px' }}
            >
              <i className="bx bx-cart"></i> Ver Mi Carrito
            </button>
            <button
              type="button"
              className="auth-btn-logout"
              onClick={logout}
            >
              <i className="bx bx-log-out"></i> Cerrar Sesión
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-pagina-contenedor">
      <div className="auth-card">
        {/* Encabezado con logotipo e indicador de marca */}
        <div className="auth-header">
          <img src="/img/Logo.png" alt="Logo Nordic" className="auth-logo-img" />
          <h1>Bienvenido a Muebles Nordic</h1>
          <p>Tu espacio de diseño y confort para el hogar</p>
        </div>

        {/* Pestañas para alternar entre Iniciar Sesión y Registro */}
        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tabActiva === 'login'}
            className={`auth-tab-btn ${tabActiva === 'login' ? 'activa' : ''}`}
            onClick={() => {
              setTabActiva('login');
              setMensajeError('');
              setMensajeExito('');
            }}
          >
            <i className="bx bx-log-in-circle"></i> Iniciar Sesión
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tabActiva === 'registro'}
            className={`auth-tab-btn ${tabActiva === 'registro' ? 'activa' : ''}`}
            onClick={() => {
              setTabActiva('registro');
              setMensajeError('');
              setMensajeExito('');
            }}
          >
            <i className="bx bx-user-plus"></i> Crear Cuenta
          </button>
        </div>

        {/* Notificaciones de error y éxito */}
        {mensajeError && (
          <div className="auth-alerta error" role="alert">
            <i className="bx bx-error-circle"></i>
            <span>{mensajeError}</span>
          </div>
        )}

        {mensajeExito && (
          <div className="auth-alerta exito" role="alert">
            <i className="bx bx-check-circle"></i>
            <span>{mensajeExito}</span>
          </div>
        )}

        {/* Formulario de Inicio de Sesión */}
        {tabActiva === 'login' && (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <div className="auth-campo">
              <label htmlFor="login-email">Correo Electrónico:</label>
              <div className="auth-input-wrapper">
                <i className="bx bx-envelope auth-input-icono"></i>
                <input
                  id="login-email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-campo">
              <label htmlFor="login-password">Contraseña:</label>
              <div className="auth-input-wrapper">
                <i className="bx bx-lock-alt auth-input-icono"></i>
                <input
                  id="login-password"
                  type={mostrarPasswordLogin ? 'text' : 'password'}
                  placeholder="Ingresa tu contraseña"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-btn-password-toggle"
                  onClick={() => setMostrarPasswordLogin(!mostrarPasswordLogin)}
                  title={mostrarPasswordLogin ? 'Ocultar contraseña' : 'Ver contraseña'}
                  aria-label="Alternar visibilidad de contraseña"
                >
                  <i className={`bx ${mostrarPasswordLogin ? 'bx-show' : 'bx-hide'}`}></i>
                </button>
              </div>
            </div>

            <div className="auth-fila-opciones">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={recordarSesion}
                  onChange={(e) => setRecordarSesion(e.target.checked)}
                />
                <span>Recordar sesión</span>
              </label>
              <button
                type="button"
                className="auth-link-recuperar"
                onClick={handleRecuperarPassword}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <Boton
              type="submit"
              texto="Ingresar a mi Cuenta"
              className="btn-primary"
              style={{ width: '100%', padding: '13px', fontSize: '1.05rem', marginTop: '10px' }}
            />

            <div className="auth-cambio-tab">
              <span>¿Aún no tienes cuenta?</span>{' '}
              <button
                type="button"
                className="auth-link-accion"
                onClick={() => setTabActiva('registro')}
              >
                Crear una cuenta gratis
              </button>
            </div>
          </form>
        )}

        {/* Formulario de Registro de Usuario */}
        {tabActiva === 'registro' && (
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <div className="auth-campo">
              <label htmlFor="reg-nombre">Nombre Completo:</label>
              <div className="auth-input-wrapper">
                <i className="bx bx-user auth-input-icono"></i>
                <input
                  id="reg-nombre"
                  type="text"
                  placeholder="Ej. Ana Morales"
                  value={regNombre}
                  onChange={(e) => setRegNombre(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-campo">
              <label htmlFor="reg-email">Correo Electrónico:</label>
              <div className="auth-input-wrapper">
                <i className="bx bx-envelope auth-input-icono"></i>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-campo">
              <label htmlFor="reg-telefono">Teléfono (opcional para entregas):</label>
              <div className="auth-input-wrapper">
                <i className="bx bx-phone auth-input-icono"></i>
                <input
                  id="reg-telefono"
                  type="tel"
                  placeholder="+52 55 1234 5678"
                  value={regTelefono}
                  onChange={(e) => setRegTelefono(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-campo">
              <label htmlFor="reg-password">Contraseña (mínimo 6 caracteres):</label>
              <div className="auth-input-wrapper">
                <i className="bx bx-lock-alt auth-input-icono"></i>
                <input
                  id="reg-password"
                  type={mostrarPasswordReg ? 'text' : 'password'}
                  placeholder="Crea una contraseña segura"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="auth-btn-password-toggle"
                  onClick={() => setMostrarPasswordReg(!mostrarPasswordReg)}
                  title={mostrarPasswordReg ? 'Ocultar contraseña' : 'Ver contraseña'}
                  aria-label="Alternar visibilidad de contraseña"
                >
                  <i className={`bx ${mostrarPasswordReg ? 'bx-show' : 'bx-hide'}`}></i>
                </button>
              </div>
            </div>

            <div className="auth-campo">
              <label htmlFor="reg-confirm">Confirmar Contraseña:</label>
              <div className="auth-input-wrapper">
                <i className="bx bx-check-shield auth-input-icono"></i>
                <input
                  id="reg-confirm"
                  type={mostrarPasswordReg ? 'text' : 'password'}
                  placeholder="Repite tu contraseña"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-fila-terminos">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={aceptaTerminos}
                  onChange={(e) => setAceptaTerminos(e.target.checked)}
                  required
                />
                <span>
                  Acepto los <a href="#terminos" onClick={(e) => e.preventDefault()}>Términos y Condiciones</a> y la Política de Privacidad de Nordic.
                </span>
              </label>
            </div>

            <Boton
              type="submit"
              texto="Registrar mi Cuenta"
              className="btn-secondary"
              style={{ width: '100%', padding: '13px', fontSize: '1.05rem', marginTop: '10px' }}
            />

            <div className="auth-cambio-tab">
              <span>¿Ya tienes una cuenta registrada?</span>{' '}
              <button
                type="button"
                className="auth-link-accion"
                onClick={() => setTabActiva('login')}
              >
                Inicia sesión aquí
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
};

export default AuthPage;
