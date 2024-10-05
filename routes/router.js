const express = require('express');
const router = express.Router();
const main = require('../controller/MainController');
const multer = require('multer');

// Set up multer storage for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/uploads/'); // Directory to save images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname); // Unique filename with timestamp
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Define routes
// sa admin lang to
// router.get('/', async (req, res) => {
//     try {
//         const summaryData = await main.getSummaryData(); // Fetch summary data
//         const allUsers = await main.index(); // Fetch all users
//         res.render('index', { data: allUsers, ...summaryData }); // Pass both users and summary data
//     } catch (err) {
//         console.error('Error retrieving data in route:', err); // Log the error
//         res.status(500).send('Error retrieving data');
//     }
// });
router.get('/', main.index);
 //admin lang to

// Add this in router.js
// router.post('/addToCart', async (req, res) => {
//     try {
//         const productId = req.body.product_id;
//         await main.addToCart(productId); // Use a controller method to add the product to the cart
//         res.redirect('/userCart'); // Redirect to the cart page after adding the product
//     } catch (err) {
//         res.status(500).send('Error adding product to cart');
//     }
// });

// router.js
router.post('/addToCart', main.addToCart); // New route to handle adding products to the cart


router.post('/save', upload.single('pictures'), main.save); // Use multer's single file upload handler here
router.get('/accounts', main.accounts);
router.get('/message', main.message);
router.get('/orders', main.orders);
router.get('/products', main.products);
router.get('/userIndex/:id', main.userIndex); // Ensure this is the updated userIndex function
router.get('/userShop/', main.userShop);
router.get('/userAboutUs', main.userAboutUs);
router.get('/userService', main.userService);
router.get('/userBlog', main.userBlog);
router.get('/userContact', main.userContact);

router.get('/register', main.register);
// router.post('/register', main.registerUser);

router.post('/loginUser', main.loginUser);
router.get('/login', main.login);

module.exports = router;
