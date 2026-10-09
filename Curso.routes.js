const crudRouter = require('./crudRouter');
const controller = require('../controllers/curso.controller');

module.exports = crudRouter(controller);