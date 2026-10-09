const baseController = require('./baseController');
const model = require('../models/inscripcion.model');
const view = require('../views/json/inscripcion.view');

module.exports = baseController({
  model,
  view,
  label: 'Inscripción',
  required: ['alumno_id', 'curso_id'],
});