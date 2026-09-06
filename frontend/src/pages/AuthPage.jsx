import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import Boton from '../components/common/Boton';

// ==========================================
// Esquemas de Validación con Zod (Frontend)
// ==========================================

// Esquema de validación para el Inicio de Sesión
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'El correo electrónico es obligatorio')
    .email('Ingresa un correo electrónico con formato válido (ej. usuario@correo.com)'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  recordarSesion: z.boolean().optional(),
});

// Esquema de validación para el Registro de Usuario
const registerSchema = z
  .object({
    nombre: z
      .string()
      .trim()
      .min(1, 'El nombre completo es obligatorio')
      .min(3, 'El nombre debe contener al menos 3 caracteres'),
    email: z
      .string()
      .trim()
      .min(1, 'El correo electrónico es obligatorio')
      .email('Ingresa un correo electrónico con formato válido (ej. usuario@correo.com)'),
    telefono: z.string().trim().optional(),
    password: z
      .string()
      .min(1, 'La contraseña es obligatoria')
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z
      .string()
      .min(1, 'Confirma tu contraseña'),
    aceptaTerminos: z.boolean().refine((val) => val === true, {
      message: 'Debes aceptar los Términos y Condiciones para crear tu cuenta',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas ingresadas no coinciden',
    path: ['confirmPassword'],
  });

/**
 * Página de Autenticación (Login, Registro y Panel de Perfil)
 * Integra validaciones avanzadas con React Hook Form y esquemas de Zod
 */
const AuthPage = ({ defaultTab = 'login' }) => {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const { setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Control de pestaña activa derivado de la URL actual
  const tabActiva =
    location.pathname === '/registro' || (location.pathname !== '/login' && defaultTab === 'registro')
      ? 'registro'
      : 'login';

  // Sincronizar limpieza de mensajes cuando cambia la ruta
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setMensajeError('');
    setMensajeExito('');
  }

  const cambiarTab = (nuevaTab) => {
    navigate(nuevaTab === 'registro' ? '/registro' : '/login');
    setMensajeError('');
    setMensajeExito('');
  };

  // Visibilidad de contraseñas
  const [mostrarPasswordLogin, setMostrarPasswordLogin] = useState(false);
  const [mostrarPasswordReg, setMostrarPasswordReg] = useState(false);

  // Mensajes de retroalimentación de la API o servidor
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  // 1. Hook Form para Inicio de Sesión
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoggingIn },
    reset: resetLogin,
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
      recordarSesion: true,
    },
  });

  // 2. Hook Form para Registro de Cuenta
  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: regErrors, isSubmitting: isRegistering },
    reset: resetRegister,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: {
      nombre: '',
      email: '',
      telefono: '',
      password: '',
      confirmPassword: '',
      aceptaTerminos: false,
    },
  });

  // Manejador del envío de Inicio de Sesión
  const onLoginSubmit = async (data) => {
    setMensajeError('');
    setMensajeExito('');

    const resultado = await login(data.email, data.password);

    if (resultado.success) {
      setMensajeExito('¡Sesión iniciada correctamente! Redirigiendo...');
      resetLogin();
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } else {
      setMensajeError(resultado.message || 'Error al iniciar sesión.');
    }
  };

  // Manejador del envío de Registro
  const onRegisterSubmit = async (data) => {
    setMensajeError('');
    setMensajeExito('');

    const resultado = await register({
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      password: data.password,
    });

    if (resultado.success) {
      setMensajeExito('¡Cuenta creada con éxito! Bienvenido a Muebles Nordic.');
      resetRegister();
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } else {
      setMensajeError(resultado.message || 'Error al crear la cuenta.');
    }
  };

  // Acción de recuperación de contraseña simulada
  const handleRecuperarPassword = () => {
    alert('Ingresa tu correo electrónico en el campo correspondiente para enviarte las instrucciones.');
  };

  // Si el usuario ya está autenticado, mostramos su panel de perfil
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
            <div className="auth-perfil-fila">
              <span>Estado de la cuenta:</span>
              <strong style={{ color: '#2e7d32' }}>Activa y Verificada</strong>
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
        {/* Encabezado con logotipo de la tienda */}
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
            onClick={() => cambiarTab('login')}
          >
            <i className="bx bx-log-in-circle"></i> Iniciar Sesión
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tabActiva === 'registro'}
            className={`auth-tab-btn ${tabActiva === 'registro' ? 'activa' : ''}`}
            onClick={() => cambiarTab('registro')}
          >
            <i className="bx bx-user-plus"></i> Crear Cuenta
          </button>
        </div>

        {/* Notificaciones globales de error o éxito */}
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

        {/* ==================================================== */}
        {/* Formulario de Inicio de Sesión con React Hook Form */}
        {/* ==================================================== */}
        {tabActiva === 'login' && (
          <form className="auth-form" onSubmit={handleLoginSubmit(onLoginSubmit)} noValidate>
            <div className="auth-campo">
              <label htmlFor="login-email">Correo Electrónico:</label>
              <div className={`auth-input-wrapper ${loginErrors.email ? 'has-error' : ''}`}>
                <i className="bx bx-envelope auth-input-icono"></i>
                <input
                  id="login-email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  autoComplete="email"
                  {...registerLogin('email')}
                />
              </div>
              {loginErrors.email && (
                <span className="auth-error-inline">
                  <i className="bx bx-error-circle"></i> {loginErrors.email.message}
                </span>
              )}
            </div>

            <div className="auth-campo">
              <label htmlFor="login-password">Contraseña:</label>
              <div className={`auth-input-wrapper ${loginErrors.password ? 'has-error' : ''}`}>
                <i className="bx bx-lock-alt auth-input-icono"></i>
                <input
                  id="login-password"
                  type={mostrarPasswordLogin ? 'text' : 'password'}
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                  {...registerLogin('password')}
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
              {loginErrors.password && (
                <span className="auth-error-inline">
                  <i className="bx bx-error-circle"></i> {loginErrors.password.message}
                </span>
              )}
            </div>

            <div className="auth-fila-opciones">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  {...registerLogin('recordarSesion')}
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
              texto={isLoggingIn ? 'Iniciando sesión...' : 'Ingresar a mi Cuenta'}
              className="btn-primary"
              disabled={isLoggingIn}
              style={{ width: '100%', padding: '13px', fontSize: '1.05rem', marginTop: '10px' }}
            />

            <div className="auth-cambio-tab">
              <span>¿Aún no tienes cuenta?</span>{' '}
              <button
                type="button"
                className="auth-link-accion"
                onClick={() => cambiarTab('registro')}
              >
                Crear una cuenta gratis
              </button>
            </div>
          </form>
        )}

        {/* ==================================================== */}
        {/* Formulario de Registro de Usuario con React Hook Form */}
        {/* ==================================================== */}
        {tabActiva === 'registro' && (
          <form className="auth-form" onSubmit={handleRegisterSubmit(onRegisterSubmit)} noValidate>
            <div className="auth-campo">
              <label htmlFor="reg-nombre">Nombre Completo:</label>
              <div className={`auth-input-wrapper ${regErrors.nombre ? 'has-error' : ''}`}>
                <i className="bx bx-user auth-input-icono"></i>
                <input
                  id="reg-nombre"
                  type="text"
                  placeholder="Ej. Ana Morales"
                  autoComplete="name"
                  {...registerRegister('nombre')}
                />
              </div>
              {regErrors.nombre && (
                <span className="auth-error-inline">
                  <i className="bx bx-error-circle"></i> {regErrors.nombre.message}
                </span>
              )}
            </div>

            <div className="auth-campo">
              <label htmlFor="reg-email">Correo Electrónico:</label>
              <div className={`auth-input-wrapper ${regErrors.email ? 'has-error' : ''}`}>
                <i className="bx bx-envelope auth-input-icono"></i>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="tu@correo.com"
                  autoComplete="email"
                  {...registerRegister('email')}
                />
              </div>
              {regErrors.email && (
                <span className="auth-error-inline">
                  <i className="bx bx-error-circle"></i> {regErrors.email.message}
                </span>
              )}
            </div>

            <div className="auth-campo">
              <label htmlFor="reg-telefono">Teléfono (opcional para entregas):</label>
              <div className={`auth-input-wrapper ${regErrors.telefono ? 'has-error' : ''}`}>
                <i className="bx bx-phone auth-input-icono"></i>
                <input
                  id="reg-telefono"
                  type="tel"
                  placeholder="+52 55 1234 5678"
                  autoComplete="tel"
                  {...registerRegister('telefono')}
                />
              </div>
              {regErrors.telefono && (
                <span className="auth-error-inline">
                  <i className="bx bx-error-circle"></i> {regErrors.telefono.message}
                </span>
              )}
            </div>

            <div className="auth-campo">
              <label htmlFor="reg-password">Contraseña (mínimo 6 caracteres):</label>
              <div className={`auth-input-wrapper ${regErrors.password ? 'has-error' : ''}`}>
                <i className="bx bx-lock-alt auth-input-icono"></i>
                <input
                  id="reg-password"
                  type={mostrarPasswordReg ? 'text' : 'password'}
                  placeholder="Crea una contraseña segura"
                  autoComplete="new-password"
                  {...registerRegister('password')}
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
              {regErrors.password && (
                <span className="auth-error-inline">
                  <i className="bx bx-error-circle"></i> {regErrors.password.message}
                </span>
              )}
            </div>

            <div className="auth-campo">
              <label htmlFor="reg-confirm">Confirmar Contraseña:</label>
              <div className={`auth-input-wrapper ${regErrors.confirmPassword ? 'has-error' : ''}`}>
                <i className="bx bx-check-shield auth-input-icono"></i>
                <input
                  id="reg-confirm"
                  type={mostrarPasswordReg ? 'text' : 'password'}
                  placeholder="Repite tu contraseña"
                  autoComplete="new-password"
                  {...registerRegister('confirmPassword')}
                />
              </div>
              {regErrors.confirmPassword && (
                <span className="auth-error-inline">
                  <i className="bx bx-error-circle"></i> {regErrors.confirmPassword.message}
                </span>
              )}
            </div>

            <div className="auth-fila-terminos">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  {...registerRegister('aceptaTerminos')}
                />
                <span>
                  Acepto los <a href="#terminos" onClick={(e) => e.preventDefault()}>Términos y Condiciones</a> y la Política de Privacidad de Nordic.
                </span>
              </label>
            </div>
            {regErrors.aceptaTerminos && (
              <span className="auth-error-inline" style={{ marginTop: '-8px', marginBottom: '8px' }}>
                <i className="bx bx-error-circle"></i> {regErrors.aceptaTerminos.message}
              </span>
            )}

            <Boton
              type="submit"
              texto={isRegistering ? 'Creando cuenta...' : 'Registrar mi Cuenta'}
              className="btn-secondary"
              disabled={isRegistering}
              style={{ width: '100%', padding: '13px', fontSize: '1.05rem', marginTop: '10px' }}
            />

            <div className="auth-cambio-tab">
              <span>¿Ya tienes una cuenta registrada?</span>{' '}
              <button
                type="button"
                className="auth-link-accion"
                onClick={() => cambiarTab('login')}
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
