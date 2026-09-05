// Botón reutilizable con estilos predefinidos (btn-primary, btn-secondary, btn-danger) y soporte para eventos
const Boton = ({ texto, onClick, className = 'btn-primary', children, type = 'button', disabled = false, ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn ${className}`}
      disabled={disabled}
      {...props}
    >
      {texto || children}
    </button>
  );
};

export default Boton;
