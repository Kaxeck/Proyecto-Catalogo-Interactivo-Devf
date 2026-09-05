import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopBanner from './components/layout/TopBanner';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import BotonFlotante from './components/common/BotonFlotante';
import Toast from './components/common/Toast';
import ScrollToTop from './components/common/ScrollToTop';

import Home from './pages/Home';
import CatalogoPage from './pages/CatalogoPage';
import PromocionesPage from './pages/PromocionesPage';
import IdeasPage from './pages/IdeasPage';
import ServiciosPage from './pages/ServiciosPage';
import ProductDetailPage from './pages/ProductDetailPage';

import './assets/style.css';

// Componente principal de la aplicación: define las rutas (SPA) y los componentes globales persistentes
function App() {
  return (
    <BrowserRouter>
      {/* Restablece el scroll arriba al cambiar de página */}
      <ScrollToTop />

      {/* Franja superior con anuncios promocionales */}
      <TopBanner />

      {/* Barra de navegación principal con accesos y contador del carrito */}
      <Navbar />

      {/* Definición de rutas del catálogo y páginas de contenido */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/promociones" element={<PromocionesPage />} />
        <Route path="/catalogo" element={<CatalogoPage />} />
        <Route path="/producto/:id" element={<ProductDetailPage />} />
        <Route path="/ideas" element={<IdeasPage />} />
        <Route path="/servicios" element={<ServiciosPage />} />
        <Route path="*" element={<Home />} />
      </Routes>

      {/* Pie de página con enlaces institucionales y suscripción al newsletter */}
      <Footer />

      {/* Panel lateral deslizable para gestionar las compras */}
      <CartDrawer />

      {/* Botón flotante para acceso rápido al carrito */}
      <BotonFlotante />

      {/* Notificación emergente temporal al añadir artículos al carrito */}
      <Toast />
    </BrowserRouter>
  );
}

export default App;
