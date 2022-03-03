const connection = require('./connection');

const getAll = async () => {
  const query = 'SELECT id, name, quantity FROM StoreManager.products;';
  const [allProducts] = await connection.execute(query);
  return allProducts;
};

const getById = async (id) => {
  const query = 'SELECT id, name, quantity FROM StoreManager.products WHERE id = ?;';
  const [selectedProductArr] = await connection.execute(query, [id]);
  return selectedProductArr.length === 1 ? selectedProductArr[0] : null;
};

const getByName = async (name) => {
  const query = 'SELECT id, name, quantity FROM StoreManager.products WHERE name = ?;';
  const [selectedProductArr] = await connection.execute(query, [name]);
  return selectedProductArr.length === 1 ? selectedProductArr[0] : null;
};

const create = async ({ name, quantity }) => {
  const query = 'INSERT INTO StoreManager.products (name, quantity) VALUES (?, ?);';
  const [result] = await connection.execute(query, [name, quantity]);
  return result;
};

const updateQuantity = async ({ id, quantity }) => {
  const query = 'UPDATE StoreManager.products SET quantity = ? WHERE id = ?;';
  const [result] = await connection.execute(query, [quantity, id]);
  return result;
};

const update = async ({ id, name, quantity }) => {
  const query = 'UPDATE StoreManager.products SET name = ?, quantity = ? WHERE id = ?;';
  const [result] = await connection.execute(query, [name, quantity, id]);
  return result;
};

const exclude = async (id) => {
  const query = 'DELETE FROM StoreManager.products WHERE id = ?;';
  const [result] = await connection.execute(query, [id]);
  return result;
};

module.exports = { create, exclude, getAll, getById, getByName, update, updateQuantity };
