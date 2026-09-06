import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Componente de Ruta Privada / Protegida (PrivateRoute)
 * 
 * Basado en el patrón de autenticación y autorización en MERN con JWT:
 * 1. Lee el token almacenado en localStorage ('token' o sesión activa).
 * 2. Valida si el usuario está debidamente autenticado mediante el contexto global de Auth.
 * 3. Si está autenticado, permite el acceso renderizando los componentes hijos (children).
 * 4. Si no cuenta con credenciales válidas, restringe el acceso y redirige automáticamente
 *    a la pantalla de inicio de sesión (/login) mediante el componente <Navigate />.
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('token');

  // Si existe el token JWT o el contexto confirma la autenticación, se concede el acceso
  if (isAuthenticated || token) {
    return children;
  }

  // Si no está autenticado, se redirige a /login impidiendo el acceso a la ruta privada
  return <Navigate to="/login" replace />;
};

export default PrivateRoute;
