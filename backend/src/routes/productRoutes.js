const express = require('express');
const router = express.Router();
const {
  getProducts,
  getPromociones,
  getProductById
} = require('../controllers/productController');

// @route   GET /api/products
router.get('/', getProducts);

// @route   GET /api/products/promociones
// Nota: Debe ser declarada antes de /:id para evitar colisión de rutas
router.get('/promociones', getPromociones);

// @route   GET /api/products/:id
router.get('/:id', getProductById);

module.exports = router;
