const Idea = require('../models/Idea');

/**
 * @desc    Obtener todas las ideas y artículos de inspiración
 * @route   GET /api/ideas
 * @access  Público
 */
const getIdeas = async (req, res, next) => {
  try {
    const ideas = await Idea.find().sort({ createdAt: 1 });
    res.status(200).json(ideas);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener una idea por su ID
 * @route   GET /api/ideas/:id
 * @access  Público
 */
const getIdeaById = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      res.status(404);
      throw new Error('Idea no encontrada');
    }
    res.status(200).json(idea);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getIdeas,
  getIdeaById
};
