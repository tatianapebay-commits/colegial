const baseController = require('./baseController');
const model = require('../models/profesor.model');
const view = require('../views/json/profesor.view');

module.exports = baseController({
  model,
  view,
  label: 'Profesor',
  required: ['nombre', 'apellido', 'email'],
});
