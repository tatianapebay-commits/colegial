const path = require('path');
const express = require('express');
const pool = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Motor de vistas (V de MVC): plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas web (renderizan vistas HTML)
app.use('/', require('./routes/web.routes'));

// API REST (JSON)
app.get('/api', (req, res) => {
  res.json({
    ok: true,
    proyecto: 'Instituto - API REST',
    endpoints: ['/api/profesores', '/api/alumnos', '/api/cursos', '/api/inscripciones', '/health'],
  });
});

app.get('/health', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT NOW() AS hora');
    res.json({ ok: true, base_de_datos: 'conectada', hora: rows[0].hora });
  } catch (e) {
    next(e);
  }
});

app.use('/api/profesores', require('./routes/profesor.routes'));
app.use('/api/alumnos', require('./routes/alumno.routes'));
app.use('/api/cursos', require('./routes/curso.routes'));
app.use('/api/inscripciones', require('./routes/inscripcion.routes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;