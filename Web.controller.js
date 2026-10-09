const pool = require('../config/db');
const profesorModel = require('../models/profesor.model');
const alumnoModel = require('../models/alumno.model');
const cursoModel = require('../models/curso.model');
const inscripcionModel = require('../models/inscripcion.model');
const profesorView = require('../views/json/profesor.view');
const alumnoView = require('../views/json/alumno.view');
const cursoView = require('../views/json/curso.view');
const inscripcionView = require('../views/json/inscripcion.view');

const personas = (r) => ({ value: r.id, label: `${r.apellido}, ${r.nombre}` });

const sources = {
  profesores: { model: profesorModel, option: personas },
  alumnos: { model: alumnoModel, option: personas },
  cursos: { model: cursoModel, option: (r) => ({ value: r.id, label: r.nombre }) },
};

// Configuración de cada página: título, columnas de la tabla y campos del formulario.
const resources = {
  profesores: {
    title: 'Profesores',
    model: profesorModel,
    view: profesorView,
    columns: [
      { key: 'id', label: 'ID' }, { key: 'nombre', label: 'Nombre' }, { key: 'apellido', label: 'Apellido' },
      { key: 'email', label: 'Email' }, { key: 'especialidad', label: 'Especialidad' },
    ],
    fields: [
      { name: 'nombre', label: 'Nombre', type: 'text', required: true },
      { name: 'apellido', label: 'Apellido', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'especialidad', label: 'Especialidad', type: 'text' },
    ],
  },
  alumnos: {
    title: 'Alumnos',
    model: alumnoModel,
    view: alumnoView,
    columns: [
      { key: 'id', label: 'ID' }, { key: 'nombre', label: 'Nombre' }, { key: 'apellido', label: 'Apellido' },
      { key: 'dni', label: 'DNI' }, { key: 'email', label: 'Email' }, { key: 'fecha_nacimiento', label: 'Nacimiento' },
    ],
    fields: [
      { name: 'nombre', label: 'Nombre', type: 'text', required: true },
      { name: 'apellido', label: 'Apellido', type: 'text', required: true },
      { name: 'dni', label: 'DNI', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'fecha_nacimiento', label: 'Fecha de nacimiento', type: 'date' },
    ],
  },
  cursos: {
    title: 'Cursos',
    model: cursoModel,
    view: cursoView,
    columns: [
      { key: 'id', label: 'ID' }, { key: 'nombre', label: 'Nombre' }, { key: 'profesor', label: 'Profesor' },
      { key: 'cupo', label: 'Cupo' }, { key: 'inscriptos', label: 'Inscriptos' }, { key: 'cupo_disponible', label: 'Disponible' },
    ],
    fields: [
      { name: 'nombre', label: 'Nombre del curso', type: 'text', required: true },
      { name: 'descripcion', label: 'Descripción', type: 'textarea' },
      { name: 'cupo', label: 'Cupo', type: 'number', required: true, min: 1 },
      { name: 'profesor_id', label: 'Profesor', type: 'select', source: 'profesores' },
    ],
  },
  inscripciones: {
    title: 'Inscripciones',
    model: inscripcionModel,
    view: inscripcionView,
    columns: [
      { key: 'id', label: 'ID' }, { key: 'alumno', label: 'Alumno' }, { key: 'curso', label: 'Curso' },
      { key: 'fecha_inscripcion', label: 'Fecha' }, { key: 'estado', label: 'Estado' }, { key: 'nota', label: 'Nota' },
    ],
    fields: [
      { name: 'alumno_id', label: 'Alumno', type: 'select', source: 'alumnos', required: true },
      { name: 'curso_id', label: 'Curso', type: 'select', source: 'cursos', required: true },
      {
        name: 'estado', label: 'Estado', type: 'select', noBlank: true,
        options: ['activa', 'baja', 'finalizada'].map((e) => ({ value: e, label: e })),
      },
      { name: 'nota', label: 'Nota (0 a 10)', type: 'number', step: '0.01', min: 0, max: 10 },
    ],
  },
};

const home = async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT (SELECT COUNT(*)::int FROM profesores)    AS profesores,
             (SELECT COUNT(*)::int FROM alumnos)       AS alumnos,
             (SELECT COUNT(*)::int FROM cursos)        AS cursos,
             (SELECT COUNT(*)::int FROM inscripciones) AS inscripciones`);
    const t = rows[0];
    const stats = [
      { resource: 'profesores', label: 'Profesores', total: t.profesores },
      { resource: 'alumnos', label: 'Alumnos', total: t.alumnos },
      { resource: 'cursos', label: 'Cursos', total: t.cursos },
      { resource: 'inscripciones', label: 'Inscripciones', total: t.inscripciones },
    ];
    res.render('pages/index', { title: 'Inicio', stats });
  } catch (e) {
    next(e);
  }
};

const listPage = (name) => async (req, res, next) => {
  try {
    const cfg = resources[name];
    const rows = cfg.view.many(await cfg.model.findAll()).data;
    const fields = await Promise.all(
      cfg.fields.map(async (f) => {
        if (!f.source) return f;
        const src = sources[f.source];
        const options = (await src.model.findAll()).map(src.option);
        return { ...f, options };
      })
    );
    res.render('pages/list', {
      title: cfg.title,
      active: name,
      resource: name,
      columns: cfg.columns,
      fields,
      rows,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  home,
  profesores: listPage('profesores'),
  alumnos: listPage('alumnos'),
  cursos: listPage('cursos'),
  inscripciones: listPage('inscripciones'),
};