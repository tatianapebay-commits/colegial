const baseController = require('./baseController');
const model = require('../models/alumno.model');
const view = require('../views/json/alumno.view');

module.exports = baseController({
  model,
  view,
  label: 'Alumno',
  required: ['nombre', 'apellido', 'dni', 'email'],
});