const baseController = require('./baseController');
const model = require('../models/curso.model');
const view = require('../views/json/curso.view');

module.exports = baseController({
  model,
  view,
  label: 'Curso',
  required: ['nombre', 'cupo'],
});