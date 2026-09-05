import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Restablece la posición de la ventana hacia arriba cada vez que cambia la ruta activa
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
