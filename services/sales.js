const salesModel = require('../models/sales');
const productsService = require('./products');

const removeSaleId = (sale) => ({
  date: sale.date,
  quantity: sale.quantity,
  productId: sale.productId,
});

const notFoundError = {
  error: { name: 'notFound', message: 'Sale not found' },
};

const getAll = async () => salesModel.getAll();

const getById = async (id) => {
  const selectedSale = await salesModel.getById(id);

  if (selectedSale === null) {
    return { error: { name: 'notFound', message: 'Sale not found' } };
  }

  return selectedSale.map(removeSaleId);
};

const create = async (sales) => {
  await Promise.all(
    sales.map(({ productId, quantity }) =>
      productsService.decreaseQuantity(productId, quantity)),
  );

  const { saleId: id } = await salesModel.create(sales);

  return { id, itemsSold: sales };
};

const update = async (saleId, salesToUpdate) => {
  await Promise.all(
    salesToUpdate.map(({ productId, quantity }) =>
      salesModel.update({ productId, quantity, saleId })),
  );

  return { saleId, itemUpdated: salesToUpdate };
};

const exclude = async (saleId) => {
  const salesById = await salesModel.getById(saleId);

  if (!salesById) return notFoundError;

  await Promise.all(
    salesById.map(({ productId, quantity }) => 
      productsService.increaseQuantity(productId, quantity)),
  );

  await salesModel.exclude(saleId);
};

module.exports = { create, exclude, getAll, getById, update };
