-- =====================================================================
-- DML - Datos iniciales para trabajar con la aplicación
-- =====================================================================

INSERT INTO profesores (nombre, apellido, email, especialidad) VALUES
  ('Laura',  'Gómez',    'laura.gomez@instituto.edu.ar',  'Programación'),
  ('Martín', 'Pérez',    'martin.perez@instituto.edu.ar', 'Bases de Datos'),
  ('Sofía',  'Ramírez',  'sofia.ramirez@instituto.edu.ar','Redes')
ON CONFLICT (email) DO NOTHING;

INSERT INTO alumnos (nombre, apellido, dni, email, fecha_nacimiento) VALUES
  ('Juan',   'Fernández', '40123456', 'juan.fernandez@mail.com', '2001-04-12'),
  ('María',  'López',     '41234567', 'maria.lopez@mail.com',    '2002-08-30'),
  ('Carlos', 'Díaz',      '39876543', 'carlos.diaz@mail.com',    '2000-01-15'),
  ('Lucía',  'Martínez',  '42345678', 'lucia.martinez@mail.com', '2003-11-05')
ON CONFLICT (dni) DO NOTHING;

INSERT INTO cursos (nombre, descripcion, cupo, profesor_id) VALUES
  ('Desarrollo Web con Node.js', 'API REST con Express y arquitectura MVC', 30,
     (SELECT id FROM profesores WHERE email = 'laura.gomez@instituto.edu.ar')),
  ('PostgreSQL Avanzado',        'Modelado, DDL, DML y consultas',          25,
     (SELECT id FROM profesores WHERE email = 'martin.perez@instituto.edu.ar')),
  ('Redes y Comunicaciones',     'Fundamentos de redes TCP/IP',             20,
     (SELECT id FROM profesores WHERE email = 'sofia.ramirez@instituto.edu.ar'))
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO inscripciones (alumno_id, curso_id, estado, nota)
SELECT a.id, c.id, v.estado, v.nota
FROM (VALUES
  ('40123456', 'Desarrollo Web con Node.js', 'activa',     NULL::numeric),
  ('41234567', 'Desarrollo Web con Node.js', 'activa',     NULL),
  ('40123456', 'PostgreSQL Avanzado',        'finalizada', 8.50),
  ('39876543', 'Redes y Comunicaciones',     'activa',     NULL)
) AS v(dni, curso, estado, nota)
JOIN alumnos a ON a.dni = v.dni
JOIN cursos  c ON c.nombre = v.curso
ON CONFLICT (alumno_id, curso_id) DO NOTHING;

-- Ejemplo de modificación de datos
UPDATE cursos SET descripcion = 'API REST con Express, arquitectura MVC y PostgreSQL'
WHERE nombre = 'Desarrollo Web con Node.js';