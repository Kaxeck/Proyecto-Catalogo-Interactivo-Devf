const express = require('express');
const router = express.Router();
const { getIdeas, getIdeaById } = require('../controllers/ideaController');

router.get('/', getIdeas);
router.get('/:id', getIdeaById);

module.exports = router;
