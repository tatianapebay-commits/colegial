const pool = require('../config/db');
const baseModel = require('./baseModel');
const HttpError = require('../utils/HttpError');

const baseSelect = `
  SELECT t.*,
         a.nombre || ' ' || a.apellido AS alumno,
         c.nombre AS curso
  FROM inscripciones t
  JOIN alumnos a ON a.id = t.alumno_id
  JOIN cursos  c ON c.id = t.curso_id`;

const base = baseModel(
  'inscripciones',
  ['alumno_id', 'curso_id', 'fecha_inscripcion', 'estado', 'nota'],
  baseSelect
);

module.exports = {
  ...base,

  // Regla de negocio: no se puede superar el cupo del curso.
  async create(data) {
    const { rows } = await pool.query(
      `SELECT cupo,
              (SELECT COUNT(*)::int FROM inscripciones
                WHERE curso_id = $1 AND estado = 'activa') AS ocupados
       FROM cursos WHERE id = $1`,
      [data.curso_id]
    );
    if (!rows[0]) throw new HttpError(404, 'El curso indicado no existe');
    if (rows[0].ocupados >= rows[0].cupo) {
      throw new HttpError(409, 'El curso no tiene cupo disponible');
    }
    return base.create.call(this, data);
  },
};