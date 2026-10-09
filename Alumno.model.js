const baseModel = require('./baseModel');

module.exports = baseModel('alumnos', ['nombre', 'apellido', 'dni', 'email', 'fecha_nacimiento']);