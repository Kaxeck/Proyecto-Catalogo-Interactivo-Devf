const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware para proteger rutas privadas verificando el JWT Bearer Token
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Obtener el token del encabezado (Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // Verificar y decodificar el token con la clave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_desarrollo');

      // Buscar el usuario en la BD y adjuntarlo a la petición sin el hash de contraseña
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('No autorizado, usuario no encontrado');
      }

      return next();
    } catch (error) {
      console.error('Error de autenticación JWT:', error.message);
      res.status(401);
      return next(new Error('No autorizado, token inválido o expirado'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('No autorizado, no se proporcionó ningún token'));
  }
};

/**
 * Middleware opcional para restringir acceso exclusivo a administradores
 */
const admin = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    res.status(403);
    next(new Error('Acceso denegado, se requieren privilegios de administrador'));
  }
};

module.exports = {
  protect,
  admin
};
