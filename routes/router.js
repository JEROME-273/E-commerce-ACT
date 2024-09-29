const express = require('express');
const router = express.Router();
const main = require('../controller/MainController');
const multer = require('multer'); // Import multer

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/uploads/'); // Directory to save the images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname); // Append current date to the image name
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Define routes
router.get('/', async (req, res) => {
    try {
        const summaryData = await main.getSummaryData(); // Fetch summary data
        const allUsers = await main.index(); // Fetch all users
        res.render('index', { data: allUsers, ...summaryData }); // Pass both users and summary data
    } catch (err) {
        res.status(500).send('Error retrieving data');
    }
});

router.post('/save', upload.single('pictures'), main.save); // Use multer's single file upload handler here
router.get('/accounts', main.accounts);
router.get('/message', main.message);
router.get('/orders', main.orders);
router.get('/products', main.products);

module.exports = router;
