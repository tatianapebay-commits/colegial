const baseView = require('./baseView');

module.exports = baseView((p) => ({ ...p, nombre_completo: `${p.nombre} ${p.apellido}` }));