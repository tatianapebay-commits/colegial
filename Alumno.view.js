const baseView = require('./baseView');

const fecha = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : d);

module.exports = baseView((a) => ({
  ...a,
  nombre_completo: `${a.nombre} ${a.apellido}`,
  fecha_nacimiento: fecha(a.fecha_nacimiento),
}));