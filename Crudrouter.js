const { Router } = require('express');

module.exports = (controller) => {
  const router = Router();
  router.route('/').get(controller.getAll).post(controller.create);
  router.route('/:id').get(controller.getById).put(controller.update).delete(controller.remove);
  return router;
};