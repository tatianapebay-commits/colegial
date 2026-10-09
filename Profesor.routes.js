const crudRouter = require('./crudRouter');
const controller = require('../controllers/profesor.controller');

module.exports = crudRouter(controller);