const products = require('../services/products');

const getAll = async (_req, res) => {
  const allProducts = await products.getAll();

  return res.status(200).json(allProducts);
};

const getById = async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const selectedProduct = await products.getById(id);

  if (selectedProduct.error) return next(selectedProduct.error);

  return res.status(200).json(selectedProduct);
};

const create = async (req, res, next) => {
  const { name } = req.body;
  const quantity = parseInt(req.body.quantity, 10);
  const product = await products.create({ name, quantity });

  if (product.error) return next(product.error);

  return res.status(201).json(product);
};

const update = async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const quantity = parseInt(req.body.quantity, 10);
  const { name } = req.body;
  const product = await products.update({ id, name, quantity });

  if (product.error) return next(product.error);

  res.status(200).json(product);
};

const exclude = async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const result = await products.exclude(id);

  if (typeof result !== 'undefined' && result.error) return next(result.error);

  res.status(204).end();
};

module.exports = { create, exclude, getAll, getById, update };
