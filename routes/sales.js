const express = require('express');
const rescue = require('express-rescue');
const sales = require('../controllers/sales');
const validateSale = require('../middlewares/validateSale');

const router = express.Router();

router.get('/', rescue(sales.getAll));

router.get('/:id', rescue(sales.getById));

router.post('/', validateSale, rescue(sales.create));

router.put('/:id', validateSale, rescue(sales.update));

router.delete('/:id', rescue(sales.exclude));

module.exports = router;
