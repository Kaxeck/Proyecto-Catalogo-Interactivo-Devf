const Service = require('../models/Service');

/**
 * @desc    Obtener lista de todos los servicios y garantías
 * @route   GET /api/services
 * @access  Público
 */
const getServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ createdAt: 1 });
    res.status(200).json(services);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices
};
