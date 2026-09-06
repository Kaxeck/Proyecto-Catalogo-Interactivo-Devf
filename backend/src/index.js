const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Conectar a la base de datos de MongoDB Atlas
connectDB();

const app = express();

// Middleware para habilitar CORS (aceptar peticiones desde el frontend)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  })
);

// Middleware para parsear el cuerpo de las peticiones en formato JSON
app.use(express.json());

// Ruta raíz de verificación de estado
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    mensaje: 'Servidor RESTful API del Catálogo Interactivo en línea 🚀',
    version: '1.0.0'
  });
});

// Montar las rutas principales de la API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Middlewares de manejo de errores HTTP y 404
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Servidor backend ejecutándose en el puerto ${PORT} (http://localhost:${PORT})`);
});
