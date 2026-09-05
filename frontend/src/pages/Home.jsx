import { Link } from 'react-router-dom';
import PromotionCarousel from '../components/products/PromotionCarousel';
import ProductCard from '../components/products/ProductCard';
import IdeaCard from '../components/ideas/IdeaCard';
import ServiceCard from '../components/services/ServiceCard';
import Boton from '../components/common/Boton';
import { promocionesData, catalogoData, ideasData, serviciosData } from '../data/mockData';

// Página de Inicio (Home): presenta el banner principal interactivo, carrusel de promociones, catálogo destacado, ideas y servicios
const Home = () => {
  return (
    <main>
      {/* Sección Hero / Presentación con imagen responsiva (picture) */}
      <section className="home_section" id="home">
        <picture className="home1-img">
          <source media="(max-width: 768px)" srcSet="/img/Presentacion-mobile.png" />
          <source media="(min-width: 769px)" srcSet="/img/Presentacion.png" />
          <img
            src="/img/Presentacion.png"
            alt="Presentación de Nordic"
            className="home-img"
            loading="eager"
          />
        </picture>
        <div className="home2-img">
          <img
            src="/img/Decoracion Interior.png"
            alt="Decoración Interior"
            className="home-img"
            loading="lazy"
          />
        </div>
        <div className="home3-img">
          <img
            src="/img/Temporada Invierno.png"
            alt="Temporada Invierno"
            className="home-img"
            loading="lazy"
          />
        </div>
      </section>

      <section className="espacio_promociones" id="promociones">
        <h2>Promociones</h2>
        <PromotionCarousel productos={promocionesData} />
      </section>

      <section className="espacio_lateral" id="catalogo">
        <h2>Catálogo</h2>
        <div className="catalogo-grid">
          {catalogoData.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link to="/catalogo">
            <Boton
              texto="Ver Catálogo Completo y Filtros"
              className="btn-primary"
              style={{ padding: '12px 28px', fontSize: '1.05rem' }}
            />
          </Link>
        </div>
      </section>

      <section className="espacio_lateral_idea" id="ideas">
        <h2>Ideas</h2>
        <div>
          {ideasData.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      </section>

      <section id="servicios">
        <h2>Servicios</h2>
        <div className="servicios-contenedor">
          {serviciosData.map((servicio) => (
            <ServiceCard key={servicio.id} servicio={servicio} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
