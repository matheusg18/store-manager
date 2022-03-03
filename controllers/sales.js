const salesService = require('../services/sales');

const getAll = async (_req, res) => {
  const allSales = await salesService.getAll();

  res.status(200).json(allSales);
};

const getById = async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const selectedSale = await salesService.getById(id);

  if (selectedSale.error) return next(selectedSale.error);

  res.status(200).json(selectedSale);
};

const create = async (req, res) => {
  const sales = req.body;
  const response = await salesService.create(sales);

  res.status(201).json(response);
};

const update = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const salesToUpdate = req.body;
  const response = await salesService.update(id, salesToUpdate);

  res.status(200).json(response);
};

const exclude = async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const result = await salesService.exclude(id);

  if (typeof result !== 'undefined' && result.error) return next(result.error);

  res.status(204).end();
};

module.exports = { create, exclude, getAll, getById, update };
