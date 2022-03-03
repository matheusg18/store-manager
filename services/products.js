const products = require('../models/products');

const conflictError = {
  error: { name: 'conflict', message: 'Product already exists' },
};

const notFoundError = {
  error: { name: 'notFound', message: 'Product not found' },
};

const getAll = async () => products.getAll();

const getById = async (id) => {
  const selectedProduct = await products.getById(id);

  if (selectedProduct === null) return notFoundError;

  return selectedProduct;
};

const create = async ({ name, quantity }) => {
  const isProductAlreadyInDb = await products.getByName(name);

  if (isProductAlreadyInDb) return conflictError;

  const { insertId } = await products.create({ name, quantity });

  return { name, quantity, id: insertId };
};

const decreaseQuantity = async (id, quantity) => {
  const { quantity: actualQuantity } = await products.getById(id);
  const newQuantity = actualQuantity - quantity;

  if (newQuantity < 0) {
    const error = new Error('Such amount is not permitted to sell');
    error.name = 'unprocessableEntity';
    throw error;
  }

  await products.updateQuantity({ id, quantity: newQuantity });
};

const increaseQuantity = async (id, quantity) => {
  const { quantity: actualQuantity } = await products.getById(id);
  const newQuantity = actualQuantity + quantity;

  await products.updateQuantity({ id, quantity: newQuantity });
};

const update = async ({ id, name, quantity }) => {
  const isProductAlreadyInDb = await products.getById(id);

  if (!isProductAlreadyInDb) return notFoundError;

  await products.update({ id, name, quantity });

  return { id, name, quantity };
};

const exclude = async (id) => {
  const isProductAlreadyInDb = await products.getById(id);

  if (!isProductAlreadyInDb) return notFoundError;

  await products.exclude(id);
};

module.exports = { create, decreaseQuantity, exclude, getAll, getById, increaseQuantity, update };
