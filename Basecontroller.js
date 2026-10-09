const HttpError = require('../utils/HttpError');

const parseId = (value) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'El id debe ser un entero positivo');
  return id;
};

/**
 * Fábrica de controladores CRUD.
 * @param {object} opts { model, view, required: string[], label: string }
 */
module.exports = ({ model, view, required = [], label }) => {
  const validateRequired = (body) => {
    const faltantes = required.filter((f) => body[f] === undefined || body[f] === null || body[f] === '');
    if (faltantes.length) {
      throw new HttpError(400, `Faltan campos obligatorios: ${faltantes.join(', ')}`);
    }
  };

  return {
    getAll: async (req, res, next) => {
      try {
        res.json(view.many(await model.findAll()));
      } catch (e) {
        next(e);
      }
    },

    getById: async (req, res, next) => {
      try {
        const row = await model.findById(parseId(req.params.id));
        if (!row) throw new HttpError(404, `${label} no encontrado/a`);
        res.json(view.one(row));
      } catch (e) {
        next(e);
      }
    },

    create: async (req, res, next) => {
      try {
        validateRequired(req.body);
        const row = await model.create(req.body);
        res.status(201).json(view.one(row, `${label} creado/a correctamente`));
      } catch (e) {
        next(e);
      }
    },

    update: async (req, res, next) => {
      try {
        const row = await model.update(parseId(req.params.id), req.body);
        if (!row) throw new HttpError(404, `${label} no encontrado/a`);
        res.json(view.one(row, `${label} actualizado/a correctamente`));
      } catch (e) {
        next(e);
      }
    },

    remove: async (req, res, next) => {
      try {
        const ok = await model.remove(parseId(req.params.id));
        if (!ok) throw new HttpError(404, `${label} no encontrado/a`);
        res.json({ ok: true, message: `${label} eliminado/a correctamente` });
      } catch (e) {
        next(e);
      }
    },
  };
};