import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

// Componente de Barra de Navegación: incluye enlaces principales, buscador, botón del carrito, acceso de usuario y menú responsivo
const Navbar = () => {
  // Control de estado para desplegar u ocultar el menú de navegación móvil
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Alterna la visibilidad del menú hamburguesa en dispositivos móviles
  const toggleMenu = () => {
    setMenuAbierto((prev) => !prev);
  };

  // Cierra el menú al seleccionar cualquier ruta
  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  // Redirige al catálogo completo para realizar búsquedas
  const irABuscador = () => {
    navigate('/catalogo');
    cerrarMenu();
  };

  // Redirige a la ruta privada del perfil si está autenticado, o al login si es invitado
  const irAUsuario = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
    cerrarMenu();
  };

  return (
    <nav className="navegacion">
      <input
        className="checkbox"
        type="checkbox"
        id="menu"
        checked={menuAbierto}
        readOnly
        aria-hidden="true"
        tabIndex={-1}
      />
      <ul className="lista-navegacion">
        <div className="nav-izq">
          <li>
            <Link to="/" onClick={cerrarMenu}>
              <img src="/img/Logo.png" alt="Logo de Nordic" className="logo-img" />
            </Link>
          </li>
          <div className={`contenedor-navsection ${menuAbierto ? 'menu-abierto' : ''}`}>
            <li className="seccion-nav">
              <NavLink
                to="/promociones"
                className={({ isActive }) => (isActive ? 'active-link' : '')}
                onClick={cerrarMenu}
              >
                Promociones
              </NavLink>
            </li>
            <li className="seccion-nav">
              <NavLink
                to="/catalogo"
                className={({ isActive }) => (isActive ? 'active-link' : '')}
                onClick={cerrarMenu}
              >
                Catálogo
              </NavLink>
            </li>
            <li className="seccion-nav">
              <NavLink
                to="/ideas"
                className={({ isActive }) => (isActive ? 'active-link' : '')}
                onClick={cerrarMenu}
              >
                Ideas
              </NavLink>
            </li>
            <li className="seccion-nav">
              <NavLink
                to="/servicios"
                className={({ isActive }) => (isActive ? 'active-link' : '')}
                onClick={cerrarMenu}
              >
                Servicios
              </NavLink>
            </li>
          </div>
        </div>

        <div className="nav-der">
          <li>
            <button
              type="button"
              className="nav-icono-btn"
              onClick={irABuscador}
              title="Buscar en el catálogo"
              aria-label="Buscar en el catálogo"
            >
              <i className="bx bx-search"></i>
            </button>
          </li>
          <li>
            <button
              type="button"
              className="nav-icono-btn nav-btn-usuario"
              onClick={irAUsuario}
              title={isAuthenticated && user ? `Mi Cuenta (${user.nombre})` : "Iniciar Sesión o Registrarse"}
              aria-label={isAuthenticated && user ? `Cuenta de ${user.nombre}` : "Iniciar Sesión o Registrarse"}
            >
              <i className={isAuthenticated ? "bx bxs-user-circle" : "bx bx-user"}></i>
              {isAuthenticated && <span className="indicador-usuario-online" title="Sesión iniciada"></span>}
            </button>
          </li>
          <li>
            <button
              type="button"
              className="nav-icono-btn"
              onClick={() => setIsCartOpen(true)}
              title="Ver carrito de compras"
              aria-label="Ver carrito de compras"
            >
              <i className="bx bx-cart"></i>
              {totalItems > 0 && <span className="badge-contador">{totalItems}</span>}
            </button>
          </li>
          <li className="icono-menu">
            <button
              type="button"
              className="menu-hamburguesa-btn"
              onClick={toggleMenu}
              aria-label={menuAbierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
              aria-expanded={menuAbierto}
            >
              <i className={menuAbierto ? 'bx bx-x' : 'bx bx-menu'}></i>
            </button>
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
