import { useState, useMemo } from 'react';
import ProductCard from '../components/products/ProductCard';
import { allProducts } from '../data/mockData';

const categorias = ['Todos', 'Salas', 'Comedores', 'Recámaras', 'Estanterías', 'Oficina', 'Decoración'];

// Página de Catálogo: exploración completa con barra de búsqueda reactiva, filtros por categoría y ordenamiento por precio
const CatalogoPage = () => {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [ordenPrecio, setOrdenPrecio] = useState('default');

  // Filtra y ordena los productos en memoria según los criterios seleccionados
  const productosFiltrados = useMemo(() => {
    return allProducts
      .filter((p) => {
        const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
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
  }, [busqueda, categoriaActiva, ordenPrecio]);

  return (
    <main style={{ paddingBottom: '3rem' }}>
      <section className="espacio_lateral">
        <h1>Catálogo de Muebles Nordic</h1>
        <p style={{ textAlign: 'center', color: '#555', marginBottom: '2.5rem' }}>
          Explora nuestra selección completa de muebles nórdicos para cada rincón de tu hogar.
        </p>

        <div className="catalogo-header-bar">
          <div className="catalogo-filtros-fila-superior">
            <div className="catalogo-buscador">
              <i className="bx bx-search" style={{ fontSize: '20px', color: '#7F8C8D' }}></i>
              <input
                type="text"
                placeholder="Buscar por nombre o modelo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              {busqueda && (
                <button
                  type="button"
                  onClick={() => setBusqueda('')}
                  title="Limpiar búsqueda"
                  aria-label="Limpiar búsqueda"
                >
                  &times;
                </button>
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

        {productosFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <i className="bx bx-search-alt" style={{ fontSize: '50px', color: '#BDC3C7' }}></i>
            <h3 style={{ marginTop: '1rem', color: '#2C3E50' }}>No se encontraron muebles</h3>
            <p style={{ color: '#7F8C8D' }}>
              Intenta con otra búsqueda o selecciona otra categoría.
            </p>
          </div>
        ) : (
          <div className="catalogo-grid">
            {productosFiltrados.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default CatalogoPage;
