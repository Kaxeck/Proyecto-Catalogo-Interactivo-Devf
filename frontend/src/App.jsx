import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopBanner from './components/layout/TopBanner';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import BotonFlotante from './components/common/BotonFlotante';
import Toast from './components/common/Toast';
import ScrollToTop from './components/common/ScrollToTop';
import LoadingSpinner from './components/common/LoadingSpinner';
import PrivateRoute from './components/common/PrivateRoute';

import './assets/style.css';

// Carga diferida (Code Splitting con React.lazy): reduce el tamaño del bundle inicial descargado por el navegador
const Home = lazy(() => import('./pages/Home'));
const CatalogoPage = lazy(() => import('./pages/CatalogoPage'));
const PromocionesPage = lazy(() => import('./pages/PromocionesPage'));
const IdeasPage = lazy(() => import('./pages/IdeasPage'));
const ServiciosPage = lazy(() => import('./pages/ServiciosPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

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

      {/* Carga diferida de páginas con Suspense y un indicador de carga animado */}
      <Suspense fallback={<LoadingSpinner mensaje="Cargando página..." />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/promociones" element={<PromocionesPage />} />
          <Route path="/catalogo" element={<CatalogoPage />} />
          <Route path="/producto/:id" element={<ProductDetailPage />} />
          <Route path="/ideas" element={<IdeasPage />} />
          <Route path="/servicios" element={<ServiciosPage />} />
          <Route path="/login" element={<AuthPage defaultTab="login" />} />
          <Route path="/registro" element={<AuthPage defaultTab="registro" />} />

          {/* Rutas Privadas: protegidas con JWT mediante el componente PrivateRoute */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>

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
