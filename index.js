require('dotenv').config();
const express = require('express');
const { productsRouter, salesRouter } = require('./routes');
const errorMiddleware = require('./middlewares/error');

const app = express();
app.use(express.json());

app.use('/products', productsRouter);
app.use('/sales', salesRouter);

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`Escutando na porta ${process.env.PORT}`);
});
