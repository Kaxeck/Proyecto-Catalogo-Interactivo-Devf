/**
 * Middleware para capturar rutas inexistentes (404)
 */
const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Middleware centralizado para el manejo de errores HTTP y excepciones de Mongoose
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Error interno del servidor';

  // Error de ID inválido de Mongoose (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Recurso no encontrado (ID inválido)';
  }

  // Error de campos requeridos o validación de Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // Error de clave duplicada en MongoDB (ej. email ya registrado)
  if (err.code === 11000) {
    statusCode = 400;
    const campo = Object.keys(err.keyValue)[0];
    message = `El valor ingresado para el campo '${campo}' ya está registrado.`;
  }

  res.status(statusCode).json({
    mensaje: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = {
  notFound,
  errorHandler
};
