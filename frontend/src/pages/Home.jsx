import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PromotionCarousel from '../components/products/PromotionCarousel';
import ProductCard from '../components/products/ProductCard';
import IdeaCard from '../components/ideas/IdeaCard';
import ServiceCard from '../components/services/ServiceCard';
import Boton from '../components/common/Boton';
import { getPromociones, getProducts } from '../services/productService';
import { getIdeas, getServices } from '../services/contentService';

// Página de Inicio (Home): 100% conectada a MongoDB Atlas (Promociones, Catálogo, Ideas y Servicios)
const Home = () => {
  const [promociones, setPromociones] = useState([]);
  const [catalogo, setCatalogo] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const cargarDatos = async () => {
      try {
        setCargando(true);
        const [promosData, productsData, ideasData, servicesData] = await Promise.all([
          getPromociones(),
          getProducts(),
          getIdeas(),
          getServices()
        ]);

        if (isMounted) {
          setPromociones(promosData);
          setCatalogo(productsData.slice(0, 8));
          setIdeas(ideasData);
          setServicios(servicesData);
        }
      } catch (err) {
        console.error('Error cargando datos de inicio:', err);
      } finally {
        if (isMounted) {
          setCargando(false);
        }
      }
    };

    cargarDatos();
    return () => {
      isMounted = false;
    };
  }, []);

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
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <i className="bx bx-loader-alt bx-spin" style={{ fontSize: '36px', color: '#2C3E50' }}></i>
          </div>
        ) : (
          <PromotionCarousel productos={promociones} />
        )}
      </section>

      <section className="espacio_lateral" id="catalogo">
        <h2>Catálogo</h2>
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <i className="bx bx-loader-alt bx-spin" style={{ fontSize: '36px', color: '#2C3E50' }}></i>
          </div>
        ) : (
          <div className="catalogo-grid">
            {catalogo.map((producto) => (
              <ProductCard key={producto.id || producto._id} producto={producto} />
            ))}
          </div>
        )}
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
          {ideas.map((idea) => (
            <IdeaCard key={idea.id || idea._id} idea={idea} />
          ))}
        </div>
      </section>

      <section id="servicios">
        <h2>Servicios</h2>
        <div className="servicios-contenedor">
          {servicios.map((servicio) => (
            <ServiceCard key={servicio.id || servicio._id} servicio={servicio} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
