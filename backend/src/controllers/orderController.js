const Order = require('../models/Order');

/**
 * @desc    Procesar y guardar una nueva orden de compra creada desde el carrito
 * @route   POST /api/orders
 * @access  Privado
 */
const createOrder = async (req, res, next) => {
  try {
    const { productos, subtotal, costoEnvio, total } = req.body;

    if (!productos || productos.length === 0) {
      res.status(400);
      throw new Error('No se han especificado productos en la orden de compra');
    }

    const order = new Order({
      usuario: req.user._id,
      productos,
      subtotal,
      costoEnvio: costoEnvio || 0,
      total,
      estado: 'pagado'
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener el historial completo de pedidos del usuario autenticado
 * @route   GET /api/orders/my-orders
 * @access  Privado
 */
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ usuario: req.user._id })
      .populate('productos.producto', 'nombre imagen categoria')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders
};
