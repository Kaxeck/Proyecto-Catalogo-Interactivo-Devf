import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { allProducts, getProductById } from '../data/mockData';
import { useCart } from '../hooks/useCart';
import ProductCard from '../components/products/ProductCard';
import Boton from '../components/common/Boton';

// Página de Detalle de Producto: vista exhaustiva del mueble con galería, especificaciones, selector de unidades y recomendados
const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [cantidad, setCantidad] = useState(1);
  const [esFavorito, setEsFavorito] = useState(false);

  // Búsqueda síncrona y optimizada del producto por su identificador único
  const producto = useMemo(() => getProductById(id), [id]);

  // Obtiene sugerencias de muebles de la misma categoría o catálogo general
  const relacionados = useMemo(() => {
    if (!producto) return [];
    const otros = allProducts.filter((p) => p.id !== producto.id);
    const mismaCat = otros.filter((p) => p.categoria === producto.categoria);
    return (mismaCat.length >= 3 ? mismaCat : otros).slice(0, 4);
  }, [producto]);

  if (!producto) {
    return (
      <main style={{ minHeight: '60vh', textAlign: 'center', padding: '4rem 1rem' }}>
        <h2 style={{ color: '#2C3E50' }}>Producto no encontrado</h2>
        <p style={{ color: '#7F8C8D', marginBottom: '2rem' }}>
          El mueble que buscas no está disponible o ha cambiado de dirección.
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
              <span className="detalle-precio-actual">${producto.precioDescuento} MXN</span>
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
                  <p>{producto.dimensiones}</p>
                </div>
              </div>
              <div className="especificacion-item">
                <i className="bx bx-cube"></i>
                <div>
                  <strong>Materiales:</strong>
                  <p>{producto.materiales}</p>
                </div>
              </div>
              <div className="especificacion-item">
                <i className="bx bx-check-shield"></i>
                <div>
                  <strong>Garantía:</strong>
                  <p>{producto.garantia}</p>
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
                <ProductCard key={rel.id} producto={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default ProductDetailPage;
