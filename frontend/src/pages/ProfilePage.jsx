import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import Boton from '../components/common/Boton';

/**
 * Página de Perfil de Usuario (Ruta Privada /profile)
 * 
 * Solo es accesible para usuarios con un JSON Web Token (JWT) válido.
 * Demuestra el consumo de información privada protegida por autorización.
 */
const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { setIsCartOpen, totalItems } = useCart();
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    logout();
    navigate('/login');
  };

  return (
    <main className="auth-pagina-contenedor">
      <div className="auth-card auth-perfil-card">
        {/* Encabezado del perfil con avatar de usuario verificado */}
        <div className="auth-perfil-avatar">
          <i className="bx bxs-user-check"></i>
        </div>

        <h2>¡Hola, {user?.nombre || 'Usuario'}!</h2>
        <p className="auth-perfil-email">{user?.email || 'No disponible'}</p>
        <span className="auth-perfil-badge">
          <i className="bx bx-badge-check"></i> Cuenta Activa
        </span>

        {/* Detalles de la cuenta del usuario */}
        <div className="auth-perfil-detalles">
          <div className="auth-perfil-fila">
            <span>Nombre completo:</span>
            <strong>{user?.nombre || 'Usuario'}</strong>
          </div>
          <div className="auth-perfil-fila">
            <span>Correo electrónico:</span>
            <strong>{user?.email || ''}</strong>
          </div>
          {user?.telefono && (
            <div className="auth-perfil-fila">
              <span>Teléfono de contacto:</span>
              <strong>{user.telefono}</strong>
            </div>
          )}
          <div className="auth-perfil-fila">
            <span>Fecha de registro:</span>
            <strong>{user?.fechaRegistro || 'Reciente'}</strong>
          </div>
          <div className="auth-perfil-fila">
            <span>Estado de la cuenta:</span>
            <strong style={{ color: '#2e7d32' }}>Activa y Verificada</strong>
          </div>
        </div>

        {/* Panel de acciones rápidas */}
        <div className="auth-perfil-acciones">
          <Link to="/catalogo" style={{ textDecoration: 'none' }}>
            <Boton
              texto="Explorar Catálogo de Muebles"
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
            <i className="bx bx-cart"></i> Ver Mi Carrito ({totalItems} artículos)
          </button>

          <button
            type="button"
            className="auth-btn-logout"
            onClick={handleCerrarSesion}
          >
            <i className="bx bx-log-out"></i> Cerrar Sesión
          </button>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
