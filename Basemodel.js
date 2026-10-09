const pool = require('../config/db');

/**
 * Fábrica de modelos CRUD sobre una tabla de PostgreSQL.
 * @param {string} table       nombre de la tabla
 * @param {string[]} fields    columnas editables (sin id)
 * @param {string} baseSelect  SELECT base (alias "t" para la tabla principal)
 */
module.exports = (table, fields, baseSelect = `SELECT t.* FROM ${table} t`) => ({
  table,
  fields,

  async findAll() {
    const { rows } = await pool.query(`${baseSelect} ORDER BY t.id`);
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(`${baseSelect} WHERE t.id = $1`, [id]);
    return rows[0] || null;
  },

  async create(data) {
    const cols = fields.filter((f) => data[f] !== undefined);
    const values = cols.map((f) => data[f]);
    const params = cols.map((_, i) => `$${i + 1}`);
    const { rows } = await pool.query(
      `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${params.join(', ')}) RETURNING id`,
      values
    );
    return this.findById(rows[0].id);
  },

  async update(id, data) {
    const cols = fields.filter((f) => data[f] !== undefined);
    if (cols.length === 0) return this.findById(id);
    const sets = cols.map((f, i) => `${f} = $${i + 1}`);
    const values = cols.map((f) => data[f]);
    const { rowCount } = await pool.query(
      `UPDATE ${table} SET ${sets.join(', ')} WHERE id = $${cols.length + 1}`,
      [...values, id]
    );
    return rowCount ? this.findById(id) : null;
  },

  async remove(id) {
    const { rowCount } = await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
    return rowCount > 0;
  },
});