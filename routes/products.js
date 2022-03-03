const express = require('express');
const rescue = require('express-rescue');
const products = require('../controllers/products');
const validateProduct = require('../middlewares/validateProduct');

const router = express.Router();

router.get('/', rescue(products.getAll));

router.get('/:id', rescue(products.getById));

router.post('/', validateProduct, rescue(products.create));

router.put('/:id', validateProduct, rescue(products.update));

router.delete('/:id', rescue(products.exclude));

module.exports = router;
