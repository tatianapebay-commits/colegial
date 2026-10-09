const { Router } = require('express');
const web = require('../controllers/web.controller');

const router = Router();
router.get('/', web.home);
router.get('/profesores', web.profesores);
router.get('/alumnos', web.alumnos);
router.get('/cursos', web.cursos);
router.get('/inscripciones', web.inscripciones);

module.exports = router;