/**
 * Capa "Vista" de la API: define cómo se presenta la información al cliente (JSON).
 */
module.exports = (format = (row) => row) => ({
  one: (row, message) => ({ ok: true, ...(message && { message }), data: format(row) }),
  many: (rows) => ({ ok: true, total: rows.length, data: rows.map(format) }),
});