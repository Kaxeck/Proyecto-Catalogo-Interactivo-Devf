/**
 * Componente LoadingSpinner: indicador de carga animado y accesible
 * Utilizado como fallback en Suspense para componentes cargados con React.lazy
 */
const LoadingSpinner = ({ mensaje = 'Cargando contenido...' }) => {
  return (
    <div
      className="loading-fallback-contenedor"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="spinner-aro"></div>
      <p className="loading-texto">{mensaje}</p>
    </div>
  );
};

export default LoadingSpinner;
