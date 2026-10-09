const crudRouter = require('./crudRouter');
const controller = require('../controllers/alumno.controller');

module.exports = crudRouter(controller);