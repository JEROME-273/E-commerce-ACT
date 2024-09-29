const express = require('express');
const router = express.Router();
const pController = require('../controller/p_controller');

// Product-related routes
router.get('/', pController.getHome);
router.get('/add-product', pController.getAddProduct);
router.post('/add-product', pController.postAddProduct);
router.get('/edit-product/:id', pController.getEditProduct);
router.post('/edit-product/:id', pController.postEditProduct);
router.get('/delete-product/:id', pController.deleteProduct);
router.get('/shop', pController.getShop);
// Add this route in router.js
router.post('/add-to-cart', pController.addToCart);
router.get('/remove-from-cart/:p_id', pController.removeFromCart);

// Static page routes handled by pController
router.get('/homepage', pController.getHomepage);
router.get('/about', pController.getAbout);
router.get('/services', pController.getServices);
router.get('/contact', pController.getContactUs);
router.get('/blog', pController.getBlog);

module.exports = router;
