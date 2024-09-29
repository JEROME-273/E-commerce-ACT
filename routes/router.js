const express = require('express');
const router = express.Router();
const main = require('../controller/MainController');

router.get('/', main.index);
router.get('/accounts', main.accounts);
router.get('/message', main.message);
router.get('/orders', main.orders);
router.get('/products', main.products);

module.exports = router;
