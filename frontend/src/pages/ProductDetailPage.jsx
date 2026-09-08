import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getProducts } from '../services/productService';
import { useCart } from '../hooks/useCart';
import ProductCard from '../components/products/ProductCard';
import Boton from '../components/common/Boton';

// Página de Detalle de Producto: consulta la ficha técnica desde MongoDB Atlas
const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [producto, setProducto] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [esFavorito, setEsFavorito] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchDetalle = async () => {
      try {
        setCargando(true);
        setError(null);
        const data = await getProductById(id);
        if (!data) {
          throw new Error('Producto no encontrado');
        }
        if (isMounted) {
          setProducto(data);
          // Cargar productos relacionados de la misma categoría
          try {
            const all = await getProducts();
            if (isMounted && Array.isArray(all)) {
              const otros = all.filter((p) => (p.id || p._id) !== (data.id || data._id));
              const mismaCat = otros.filter((p) => p.categoria === data.categoria);
              setRelacionados((mismaCat.length >= 3 ? mismaCat : otros).slice(0, 4));
            }
          } catch {
            // Relacionados opcionales
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'No se pudo cargar el producto');
        }
      } finally {
        if (isMounted) {
          setCargando(false);
        }
      }
    };

    fetchDetalle();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (cargando) {
    return (
      <main style={{ minHeight: '60vh', textAlign: 'center', padding: '5rem 1rem' }}>
        <i className="bx bx-loader-alt bx-spin" style={{ fontSize: '42px', color: '#2C3E50' }}></i>
        <p style={{ marginTop: '1rem', color: '#7F8C8D' }}>Cargando detalles del mueble...</p>
      </main>
    );
  }

  if (error || !producto) {
    return (
      <main style={{ minHeight: '60vh', textAlign: 'center', padding: '4rem 1rem' }}>
        <h2 style={{ color: '#2C3E50' }}>Producto no encontrado</h2>
        <p style={{ color: '#7F8C8D', marginBottom: '2rem' }}>
          El mueble que buscas no está disponible en la base de datos o ha cambiado de identificador.
        </p>
        <Link to="/catalogo">
          <Boton texto="Volver al Catálogo" className="btn-primary" />
        </Link>
      </main>
    );
  }

  const calcularDescuento = () => {
    if (producto.precioOriginal && producto.precioDescuento) {
      const ahorro = Math.round(
        ((producto.precioOriginal - producto.precioDescuento) / producto.precioOriginal) * 100
      );
      return `-${ahorro}%`;
    }
    return null;
  };

  return (
    <main className="pagina-detalle-producto">
      <div className="detalle-contenedor">
        <nav className="detalle-breadcrumb">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/catalogo">Catálogo</Link>
          <span>/</span>
          <span className="breadcrumb-activo">{producto.nombre}</span>
        </nav>

        <div className="detalle-grid">
          <div className="detalle-galeria">
            <div className="detalle-img-card">
              {producto.isOfertaPlus && <span className="producto-badge">Oferta Plus</span>}
              <i
                className={`bx bxs-heart bx-sm icono-corazon ${esFavorito ? 'activo' : ''}`}
                onClick={() => setEsFavorito(!esFavorito)}
                title={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              ></i>
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="detalle-img-principal"
              />
            </div>
          </div>

          <div className="detalle-info">
            <span className="detalle-categoria">{producto.categoria}</span>
            <h1 className="detalle-titulo">{producto.nombre}</h1>

            <div className="detalle-rating-row">
              <div className="estrellas">
                <i className="bx bxs-star"></i>
                <i className="bx bxs-star"></i>
                <i className="bx bxs-star"></i>
                <i className="bx bxs-star"></i>
                <i className="bx bxs-star-half"></i>
              </div>
              <span className="detalle-rating-num">{producto.rating || 4.9}</span>
              <span className="detalle-opiniones">
                ({producto.opinionesCount || 24} opiniones verificadas)
              </span>
            </div>

            <div className="detalle-precios-box">
              {producto.precioOriginal && (
                <span className="detalle-precio-tachado">${producto.precioOriginal}</span>
              )}
              <span className="detalle-precio-actual">
                ${producto.precioDescuento || producto.precioOriginal} MXN
              </span>
              {calcularDescuento() && (
                <span className="detalle-descuento-tag">{calcularDescuento()}</span>
              )}
            </div>

            <p className="detalle-descripcion">{producto.descripcion}</p>

            <div className="detalle-especificaciones">
              <div className="especificacion-item">
                <i className="bx bx-ruler"></i>
                <div>
                  <strong>Dimensiones:</strong>
                  <p>{producto.dimensiones || 'Dimensiones estándar'}</p>
                </div>
              </div>
              <div className="especificacion-item">
                <i className="bx bx-cube"></i>
                <div>
                  <strong>Materiales:</strong>
                  <p>{producto.materiales || 'Madera tratada y acabados finos'}</p>
                </div>
              </div>
              <div className="especificacion-item">
                <i className="bx bx-check-shield"></i>
                <div>
                  <strong>Garantía:</strong>
                  <p>{producto.garantia || '1 año de garantía de fábrica'}</p>
                </div>
              </div>
            </div>

            <div className="detalle-compra-seccion">
              <div className="detalle-cantidad-selector">
                <button
                  type="button"
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  aria-label="Disminuir cantidad"
                >
                  -
                </button>
                <span>{cantidad}</span>
                <button
                  type="button"
                  onClick={() => setCantidad(cantidad + 1)}
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="detalle-btn-agregar"
                onClick={() => addToCart(producto, cantidad)}
              >
                <i className="bx bx-cart bx-sm"></i> Agregar al Carrito
              </button>
            </div>

            <div className="detalle-beneficios">
              <p>
                <i className="bx bx-package"></i> Envíos gratis a partir de $200 a todo el país.
              </p>
              <p>
                <i className="bx bx-refresh"></i> 30 días de garantía y devolución transparente.
              </p>
            </div>
          </div>
        </div>

        {relacionados.length > 0 && (
          <section className="detalle-relacionados-seccion">
            <h2>Productos Relacionados</h2>
            <div className="catalogo-grid">
              {relacionados.map((rel) => (
                <ProductCard key={rel.id || rel._id} producto={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default ProductDetailPage;
