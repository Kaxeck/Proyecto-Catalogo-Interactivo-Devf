const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Genera un token JWT firmado con el ID del usuario
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secreto_desarrollo', {
    expiresIn: '30d'
  });
};

/**
 * @desc    Registrar un nuevo usuario
 * @route   POST /api/auth/register
 * @access  Público
 */
const registerUser = async (req, res, next) => {
  try {
    const { nombre, email, password, telefono } = req.body;

    if (!nombre || !email || !password) {
      res.status(400);
      throw new Error('Por favor complete todos los campos obligatorios (nombre, email, password)');
    }

    // Comprobar si el usuario ya existe
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      res.status(400);
      throw new Error('El correo electrónico ya está registrado');
    }

    // Crear el nuevo usuario
    const user = await User.create({
      nombre,
      email: email.toLowerCase(),
      password,
      telefono: telefono || ''
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono,
        rol: user.rol,
        token: generateToken(user._id)
      });
    } else {
      res.status(400);
      throw new Error('Datos de usuario inválidos');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Autenticar usuario e iniciar sesión
 * @route   POST /api/auth/login
 * @access  Público
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Por favor ingrese correo electrónico y contraseña');
    }

    // Buscar el usuario por su correo
    const user = await User.findOne({ email: email.toLowerCase() });

    // Verificar existencia y comparar hash de la contraseña
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono,
        rol: user.rol,
        token: generateToken(user._id)
      });
    } else {
      res.status(401);
      throw new Error('Credenciales inválidas (correo o contraseña incorrectos)');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener perfil del usuario autenticado
 * @route   GET /api/auth/profile
 * @access  Privado
 */
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404);
      throw new Error('Usuario no encontrado');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};
