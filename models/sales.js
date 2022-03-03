const connection = require('./connection');

const getAll = async () => {
  const query = `SELECT sp.sale_id AS saleId, s.\`date\`, sp.product_id AS productId, sp.quantity
  FROM StoreManager.sales AS s
  INNER JOIN StoreManager.sales_products AS sp
  ON s.id = sp.sale_id
  ORDER BY sp.sale_id, sp.product_id;`;
  const [allSales] = await connection.execute(query);
  return allSales;
};

const getById = async (id) => {
  const query = `SELECT sp.sale_id AS saleId, s.\`date\`, sp.product_id AS productId, sp.quantity
  FROM StoreManager.sales AS s
  INNER JOIN StoreManager.sales_products AS sp
  ON s.id = sp.sale_id
  WHERE s.id = ?;`;
  const [selectedSale] = await connection.execute(query, [id]);
  return selectedSale.length === 0 ? null : selectedSale;
};

const createSale = async () => {
  const query = 'INSERT INTO StoreManager.sales () VALUES ();';
  const [result] = await connection.execute(query);

  return result;
};

const create = async (sales) => {
  const { insertId: saleId } = await createSale();

  const query = `INSERT INTO StoreManager.sales_products (sale_id, product_id, quantity)
  VALUES (?, ?, ?)${', (?, ?, ?)'.repeat(sales.length - 1)};`;
  const [result] = await connection.execute(
    query,
    sales.reduce((acc, { productId, quantity }) => acc.concat(saleId, productId, quantity), []),
  );

  return { ...result, saleId };
};

const update = async ({ productId, saleId, quantity }) => {
  const query = `UPDATE StoreManager.sales_products SET quantity = ?
  WHERE sale_id = ? AND product_id = ?;`;
  const [result] = await connection.execute(query, [quantity, saleId, productId]);

  return result;
};

const exclude = async (saleId) => {
  const query = 'DELETE FROM StoreManager.sales WHERE id = ?;';
  const [result] = await connection.execute(query, [saleId]);

  return result;
};

module.exports = { create, exclude, getAll, getById, update };
