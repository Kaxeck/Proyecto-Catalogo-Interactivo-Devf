import { useState, useMemo, useEffect } from 'react';
import ProductCard from '../components/products/ProductCard';
import { getProducts } from '../services/productService';

const categorias = ['Todos', 'Salas', 'Comedores', 'Recámaras', 'Estanterías', 'Oficina', 'Decoración'];

// Página de Catálogo: exploración completa con datos reales de MongoDB Atlas
const CatalogoPage = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [errorBusqueda, setErrorBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [ordenPrecio, setOrdenPrecio] = useState('default');

  const cargarProductos = async () => {
    try {
      setCargando(true);
      setErrorCarga(null);
      const data = await getProducts();
      setProductos(data);
    } catch (err) {
      console.error('Error cargando catálogo:', err);
      setErrorCarga('No se pudieron cargar los productos desde el servidor.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // Sanitiza y valida la entrada del usuario en el buscador
  const handleBusquedaChange = (e) => {
    const valor = e.target.value;

    // Validación contra caracteres potencialmente inseguros (HTML, scripts o inyecciones)
    if (/[<>{}\\]/.test(valor)) {
      setErrorBusqueda('La búsqueda no permite caracteres especiales como <, >, { o }');
      return;
    }

    // Validación de longitud máxima
    if (valor.length > 50) {
      setErrorBusqueda('El término de búsqueda no debe exceder 50 caracteres.');
      return;
    }

    setErrorBusqueda('');
    setBusqueda(valor);
  };

  // Limpia el buscador y reinicia los filtros
  const handleLimpiarBusqueda = () => {
    setBusqueda('');
    setErrorBusqueda('');
  };

  // Filtra y ordena los productos en memoria según los criterios seleccionados
  const productosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return productos
      .filter((p) => {
        const coincideNombre = termino === '' || (p.nombre && p.nombre.toLowerCase().includes(termino));
        const coincideCategoria =
          categoriaActiva === 'Todos' || p.categoria === categoriaActiva;
        return coincideNombre && coincideCategoria;
      })
      .sort((a, b) => {
        const precioA = a.precioDescuento || a.precioOriginal;
        const precioB = b.precioDescuento || b.precioOriginal;

        if (ordenPrecio === 'menor') return precioA - precioB;
        if (ordenPrecio === 'mayor') return precioB - precioA;
        return 0;
      });
  }, [productos, busqueda, categoriaActiva, ordenPrecio]);

  return (
    <main style={{ paddingBottom: '3rem' }}>
      <section className="espacio_lateral">
        <h1>Catálogo de Muebles Nordic</h1>
        <p style={{ textAlign: 'center', color: '#555', marginBottom: '2.5rem' }}>
          Explora nuestra selección completa de muebles nórdicos para cada rincón de tu hogar.
        </p>

        <div className="catalogo-header-bar">
          <div className="catalogo-filtros-fila-superior">
            <div>
              <div className={`catalogo-buscador ${errorBusqueda ? 'has-error' : ''}`}>
                <i className="bx bx-search" style={{ fontSize: '20px', color: '#7F8C8D' }}></i>
                <input
                  type="text"
                  placeholder="Buscar por nombre o modelo..."
                  value={busqueda}
                  onChange={handleBusquedaChange}
                  maxLength={50}
                />
                {busqueda && (
                  <button
                    type="button"
                    onClick={handleLimpiarBusqueda}
                    title="Limpiar búsqueda"
                    aria-label="Limpiar búsqueda"
                  >
                    &times;
                  </button>
                )}
              </div>
              {errorBusqueda && (
                <span className="catalogo-busqueda-error">
                  <i className="bx bx-error-circle"></i> {errorBusqueda}
                </span>
              )}
            </div>

            <select
              value={ordenPrecio}
              onChange={(e) => setOrdenPrecio(e.target.value)}
              className="catalogo-orden-select"
            >
              <option value="default">Ordenar por: Defecto</option>
              <option value="menor">Precio: Menor a Mayor</option>
              <option value="mayor">Precio: Mayor a Menor</option>
            </select>
          </div>

          <div className="catalogo-filtros-categoria">
            {categorias.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filtro-chip ${categoriaActiva === cat ? 'activo' : ''}`}
                onClick={() => setCategoriaActiva(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Estado de carga */}
        {cargando && (
          <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <i className="bx bx-loader-alt bx-spin" style={{ fontSize: '42px', color: '#2C3E50' }}></i>
            <p style={{ marginTop: '1rem', color: '#7F8C8D', fontSize: '1.05rem' }}>
              Cargando catálogo desde la base de datos...
            </p>
          </div>
        )}

        {/* Estado de error */}
        {!cargando && errorCarga && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <i className="bx bx-error-circle" style={{ fontSize: '48px', color: '#E74C3C' }}></i>
            <h3 style={{ marginTop: '1rem', color: '#2C3E50' }}>Ocurrió un error</h3>
            <p style={{ color: '#7F8C8D', marginBottom: '1.5rem' }}>{errorCarga}</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={cargarProductos}
              style={{ padding: '10px 24px' }}
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Contador de resultados */}
        {!cargando && !errorCarga && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', color: '#7F8C8D', fontSize: '0.92rem' }}>
              <span>
                Mostrando <strong>{productosFiltrados.length}</strong> de <strong>{productos.length}</strong> muebles disponibles
              </span>
              {busqueda && (
                <span style={{ color: '#2C3E50', fontWeight: 500 }}>
                  Filtro activo: &ldquo;{busqueda}&rdquo;
                </span>
              )}
            </div>

            {productosFiltrados.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <i className="bx bx-search-alt" style={{ fontSize: '50px', color: '#BDC3C7' }}></i>
                <h3 style={{ marginTop: '1rem', color: '#2C3E50' }}>No se encontraron muebles</h3>
                <p style={{ color: '#7F8C8D', marginBottom: '1.5rem' }}>
                  {busqueda
                    ? `No existen coincidencias para "${busqueda}" en la categoría ${categoriaActiva}.`
                    : 'No hay muebles disponibles en esta categoría.'}
                </p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    handleLimpiarBusqueda();
                    setCategoriaActiva('Todos');
                  }}
                  style={{ padding: '10px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <i className="bx bx-reset"></i> Restablecer Búsqueda y Filtros
                </button>
              </div>
            ) : (
              <div className="catalogo-grid">
                {productosFiltrados.map((producto) => (
                  <ProductCard key={producto.id || producto._id} producto={producto} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default CatalogoPage;
