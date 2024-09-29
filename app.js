const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const router = require('./routes/router');
const db = require('./config/db'); // Import your MySQL connection

const app = express();
const PORT = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

// Initialize the cart in session if not present
app.use((req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    next();
});

// Route to add item to cart
app.post('/add-to-cart', (req, res) => {
    console.log(req.body); // Log the incoming request
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).send('Product ID is required');
    }

    // Query to get the product from the MySQL database
    db.query('SELECT * FROM Products WHERE p_id = ?', [productId], (err, results) => {
        if (err) return res.status(500).send(err);

        if (results.length > 0) {
            const product = results[0];

            // Create an item object
            const item = {
                p_id: product.p_id,
                p_name: product.p_name,
                p_price: parseFloat(product.p_price), // Convert price to float
                p_image: product.p_image,
                quantity: 1
            };

            // Check if the product is already in the cart
            const existingProductIndex = req.session.cart.findIndex(cartItem => cartItem.p_id === product.p_id);

            if (existingProductIndex > -1) {
                // If it exists, increment the quantity
                req.session.cart[existingProductIndex].quantity += 1;
            } else {
                // If it doesn't exist, add the new item to the cart
                req.session.cart.push(item);
            }

            res.redirect('/cart');
        } else {
            return res.status(404).send('Product not found');
        }
    });
});

// Route to update the quantity in the cart
app.post('/update-cart', (req, res) => {
    const { productId, quantity } = req.body;

    // Find the product in the cart
    const productIndex = req.session.cart.findIndex(item => item.p_id === productId);

    if (productIndex > -1) {
        // Update the quantity
        if (quantity > 0) {
            req.session.cart[productIndex].quantity = parseInt(quantity);
        } else {
            // If quantity is 0 or less, remove the item from the cart
            req.session.cart.splice(productIndex, 1);
        }
    }

    res.redirect('/cart');
});

// Example route to view the cart
app.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    let totalSubtotal = 0;

    // Calculate totalSubtotal
    cart.forEach(item => {
        totalSubtotal += item.p_price * item.quantity;
    });

    res.render('cart', {
        cart: cart,
        totalSubtotal: totalSubtotal,
        totalAmount: totalSubtotal // Adjust this if you have additional calculations
    });
});

// Use the router for other routes
app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
