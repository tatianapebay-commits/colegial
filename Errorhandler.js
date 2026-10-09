const HttpError = require('../utils/HttpError');

// Traduce errores de PostgreSQL a respuestas HTTP comprensibles.
const pgErrors = {
  '23505': [409, 'Ya existe un registro con ese valor único (dni, email, nombre, etc.)'],
  '23503': [409, 'Violación de clave foránea: el registro referenciado no existe o tiene datos asociados'],
  '23502': [400, 'Falta un campo obligatorio'],
  '23514': [400, 'Un valor no cumple las restricciones definidas (CHECK)'],
  '22P02': [400, 'Formato de dato inválido'],
  '22007': [400, 'Formato de fecha inválido (use AAAA-MM-DD)'],
};

const notFound = (req, res) => {
  res.status(404).json({ ok: false, message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ ok: false, message: err.message });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ ok: false, message: 'JSON inválido en el cuerpo de la petición' });
  }
  if (err.code && pgErrors[err.code]) {
    const [status, message] = pgErrors[err.code];
    return res.status(status).json({ ok: false, message, detalle: err.detail });
  }
  console.error(err);
  res.status(500).json({ ok: false, message: 'Error interno del servidor' });
};

module.exports = { notFound, errorHandler };