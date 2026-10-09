const baseView = require('./baseView');

const fecha = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : d);

module.exports = baseView((i) => ({ ...i, fecha_inscripcion: fecha(i.fecha_inscripcion) }));