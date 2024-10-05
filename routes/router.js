const express = require('express');
const router = express.Router();
const pController = require('../controller/p_controller');
const userController = require('../controller/user_controller'); 
const cartController = require('../controller/cart_controller'); 
const checkoutController = require('../controller/checkout_controller'); 

router.get('/', pController.getHome); 
router.get('/add-product', pController.getAddProduct); 
router.post('/add-product', pController.postAddProduct); 
router.get('/edit-product/:id', pController.getEditProduct); 
router.post('/edit-product/:id', pController.postEditProduct); 
router.get('/delete-product/:id', pController.deleteProduct); 
router.get('/shop', pController.getShop); 


router.post('/add-to-cart', cartController.addToCart);
router.get('/cart', cartController.getCartItems);
router.delete('/cart/remove/:productId', cartController.removeFromCart);


router.get('/checkout', checkoutController.getCheckout);
router.post('/checkout', checkoutController.initiateCheckout);


router.get('/thankyou', (req, res) => {
    res.render('thankyou'); 
});


router.get('/homepage', pController.getHomepage); 
router.get('/about', pController.getAbout); 
router.get('/services', pController.getServices); 
router.get('/contact', pController.getContactUs); 
router.get('/blog', pController.getBlog); 

router.post('/adminLogin', userController.adminLogin);
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

router.get('/signup', (req, res) => {
    res.render('user/signup', {
        session: req.session, 
        username: req.session.username || '' 
    });
});


router.get('/login', (req, res) => {
    res.render('user/login', {
        session: req.session 
    });
});

router.get('/adminLogin', (req, res) => {
    res.render('user/adminLogin', { session: req.session });
});

module.exports = router; 
