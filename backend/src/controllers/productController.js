const Product = require('../models/Product');

/**
 * @desc    Obtener lista completa de muebles con soporte para filtros por categoría y búsqueda por palabra clave
 * @route   GET /api/products
 * @access  Público
 */
const getProducts = async (req, res, next) => {
  try {
    const { categoria, search } = req.query;
    const filter = {};

    // Filtrar por categoría específica si no es 'Todos'
    if (categoria && categoria !== 'Todos') {
      filter.categoria = categoria;
    }

    // Búsqueda insensible a mayúsculas/minúsculas por nombre o descripción
    if (search) {
      filter.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { descripcion: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener lista de muebles en promoción u Oferta Plus
 * @route   GET /api/products/promociones
 * @access  Público
 */
const getPromociones = async (req, res, next) => {
  try {
    const promociones = await Product.find({
      $or: [
        { isOfertaPlus: true },
        { precioDescuento: { $ne: null, $gt: 0 } }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json(promociones);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener la ficha técnica individual de un mueble por su ID
 * @route   GET /api/products/:id
 * @access  Público
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404);
      throw new Error('Producto no encontrado');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getPromociones,
  getProductById
};
