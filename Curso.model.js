const baseModel = require('./baseModel');

const baseSelect = `
  SELECT t.*,
         p.nombre || ' ' || p.apellido AS profesor,
         (SELECT COUNT(*)::int FROM inscripciones i
           WHERE i.curso_id = t.id AND i.estado = 'activa') AS inscriptos
  FROM cursos t
  LEFT JOIN profesores p ON p.id = t.profesor_id`;

module.exports = baseModel('cursos', ['nombre', 'descripcion', 'cupo', 'profesor_id'], baseSelect);