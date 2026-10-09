const baseView = require('./baseView');

module.exports = baseView((c) => ({ ...c, cupo_disponible: c.cupo - c.inscriptos }));