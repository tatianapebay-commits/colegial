const crudRouter = require('./crudRouter');
const controller = require('../controllers/inscripcion.controller');

module.exports = crudRouter(controller);