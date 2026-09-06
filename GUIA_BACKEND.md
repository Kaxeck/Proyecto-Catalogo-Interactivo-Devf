# 🛡️ Guía de Backend MERN: Autenticación, JWT y Rutas Privadas

Este documento reúne la arquitectura, configuración y código necesario para el Backend en Node.js, Express y MongoDB, cubriendo la autenticación de usuarios y la protección de rutas privadas mediante **JSON Web Tokens (JWT)**.

---

## 1. Arquitectura del Backend

```text
backend/
├── config/
│   └── db.js                 # Conexión a MongoDB con Mongoose
├── controllers/
│   ├── authController.js     # Lógica de login, registro y perfil
│   ├── productController.js  # CRUD del catálogo de muebles
│   └── orderController.js    # Creación y consulta de pedidos
├── middleware/
│   └── authMiddleware.js     # Middleware 'protect' para validar el JWT
├── models/
│   ├── User.js               # Esquema de Usuario y hash de contraseñas con bcryptjs
│   ├── Product.js            # Esquema del catálogo
│   └── Order.js              # Esquema de pedidos y carritos
├── routes/
│   ├── authRoutes.js         # Rutas públicas (/api/auth/register, /api/auth/login)
│   ├── privateRoutes.js      # Rutas privadas (/api/auth/profile protegida)
│   ├── productRoutes.js      # Rutas de productos (/api/products)
│   └── orderRoutes.js        # Rutas de órdenes (/api/orders)
├── .env                      # Variables de entorno (PORT, MONGO_URI, JWT_SECRET)
├── server.js                 # Punto de entrada de Express
└── package.json
```

---

## 2. Instalación de Dependencias

```bash
cd backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken dotenv cors
npm install -D nodemon
```

---

## 3. Variables de Entorno (`.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster0.mongodb.net/catalogo_muebles?retryWrites=true&w=majority
JWT_SECRET=super_clave_secreta_jwt_nordic_2026
NODE_ENV=development
```

---

## 4. Implementación del Servidor (`server.js`)

```javascript
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const privateRoutes = require('./routes/privateRoutes');

dotenv.config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Montaje de rutas
app.use('/api/auth', authRoutes);
app.use('/api/auth', privateRoutes);

// Conexión a la base de datos
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Conectado exitosamente'))
  .catch((err) => console.error('Error al conectar MongoDB:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
```

---

## 5. Modelo de Usuario con Hash de Contraseña (`models/User.js`)

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: 6,
    },
    telefono: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

// Encriptar contraseña con bcryptjs antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Método para verificar la contraseña en el inicio de sesión
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

---

## 6. Controlador de Autenticación (`controllers/authController.js`)

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Función auxiliar para generar el JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '8h' });
};

// @desc    Registro de nuevo usuario
// @route   POST /api/auth/register
// @access  Público
exports.registerUser = async (req, res) => {
  const { name, email, password, telefono } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }

    const user = await User.create({ name, email, password, telefono });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        nombre: user.name,
        email: user.email,
        telefono: user.telefono,
        fechaRegistro: user.createdAt,
      },
    });
  } catch (error) {
    res.status(400).json({ message: 'Error al registrar usuario.', error: error.message });
  }
};

// @desc    Inicio de sesión
// @route   POST /api/auth/login
// @access  Público
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          nombre: user.name,
          email: user.email,
          telefono: user.telefono,
          fechaRegistro: user.createdAt,
        },
      });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas (correo o contraseña incorrectos).' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor al autenticar.', error: error.message });
  }
};
```

---

## 7. Middleware de Protección de Rutas (`middleware/authMiddleware.js`)

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Verificar si la petición contiene la cabecera 'Authorization: Bearer <token>'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Adjuntar el usuario decodificado a la petición (excluyendo la contraseña)
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido o expirado, acceso denegado' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'No autorizado, token no encontrado en la cabecera' });
  }
};

module.exports = protect;
```

---

## 8. Rutas Privadas (`routes/privateRoutes.js`)

```javascript
const express = require('express');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// @desc    Obtener perfil de usuario autenticado
// @route   GET /api/auth/profile
// @access  Privado (requiere JWT)
router.get('/profile', protect, (req, res) => {
  res.json({
    message: 'Ruta protegida accedida correctamente',
    user: {
      id: req.user._id,
      nombre: req.user.name,
      email: req.user.email,
      telefono: req.user.telefono,
      role: req.user.role,
      fechaRegistro: req.user.createdAt,
    },
  });
});

module.exports = router;
```

---

## 9. Rutas de Autenticación (`routes/authRoutes.js`)

```javascript
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
```

---

## 10. Cómo Probar las Rutas con Postman o Thunder Client

1. **Registrar un usuario:**
   - **POST** `http://localhost:5000/api/auth/register`
   - Body (JSON):
     ```json
     {
       "name": "Carlos Mendoza",
       "email": "carlos@example.com",
       "password": "password123"
     }
     ```
   - Respuesta esperada: `201 Created` con `{ "token": "eyJh...", "user": {...} }`.

2. **Acceder a la ruta privada `/profile` SIN token:**
   - **GET** `http://localhost:5000/api/auth/profile`
   - Respuesta esperada: `401 Unauthorized` -> `{"error": "No autorizado, token no encontrado"}`.

3. **Acceder a la ruta privada `/profile` CON token:**
   - **GET** `http://localhost:5000/api/auth/profile`
   - Headers:
     `Authorization: Bearer <token_obtenido>`
   - Respuesta esperada: `200 OK` -> `{"message": "Ruta protegida accedida correctamente", "user": {...}}`.
