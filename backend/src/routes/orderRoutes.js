const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders
} = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

// Todas las rutas de pedidos requieren autenticación con token JWT
router.use(protect);

// @route   POST /api/orders - Procesar compra del carrito
router.post('/', createOrder);

// @route   GET /api/orders/my-orders - Obtener historial de pedidos del usuario
router.get('/my-orders', getMyOrders);

module.exports = router;
