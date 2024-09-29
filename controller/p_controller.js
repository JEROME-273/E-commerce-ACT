const Product = require('../models/p_model');
const multer = require('multer');
const path = require('path');
const db = require('../config/db'); // Make sure this path is correct

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage: storage }).single('p_image');

// Product-related controllers
exports.getHome = (req, res) => {
    Product.getAll((err, products) => {
        if (err) throw err;
        res.render('home', { products, successMsg: req.session.successMsg, errorMsg: req.session.errorMsg });
        req.session.successMsg = null;
        req.session.errorMsg = null;
    });
};

exports.getAddProduct = (req, res) => {
    res.render('add_product');
};

exports.postAddProduct = (req, res) => {
    // Use multer middleware to handle file upload before reaching this function
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).send('File upload failed');
        }

        const { p_name, p_quantity, p_price, p_description } = req.body;
        const p_image = req.file ? req.file.filename : null; // Safely access filename

        // Check if all fields are present
        if (!p_name || !p_quantity || !p_price || !p_image || !p_description) {
            return res.status(400).send('All fields are required');
        }

        // Continue with your database logic to add the product
        const query = 'INSERT INTO Products (p_name, p_quantity, p_price, p_image, p_description) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [p_name, p_quantity, p_price, p_image, p_description], (error, results) => {
            if (error) {
                return res.status(500).send('Database error: ' + error.message);
            }
            req.session.successMsg = 'Product added successfully';
            res.redirect('/'); // Redirect to the homepage or wherever appropriate
        });
    });
};

exports.getEditProduct = (req, res) => {
    const id = req.params.id;
    Product.getById(id, (err, product) => {
        if (err) throw err;
        res.render('edit_product', { product: product[0] });
    });
};

exports.postEditProduct = (req, res) => {
    const id = req.params.id;
    const updatedProduct = req.body;

    Product.update(id, updatedProduct, (err) => {
        if (err) {
            req.session.errorMsg = 'Failed to update product';
            return res.redirect(`/edit-product/${id}`);
        }
        req.session.successMsg = 'Product updated successfully';
        res.redirect('/');
    });
};

exports.deleteProduct = (req, res) => {
    const id = req.params.id;
    Product.delete(id, (err) => {
        if (err) {
            req.session.errorMsg = 'Failed to delete product';
            return res.redirect('/');
        }
        req.session.successMsg = 'Product deleted successfully';
        res.redirect('/');
    });
};

exports.addToCart = (req, res) => {
    const productId = req.body.productId; // This should correctly refer to the input from the form

    Product.getById(productId, (err, product) => {
        if (err) throw err;

        const cart = req.session.cart || [];
        const item = {
            p_id: product[0].p_id,
            p_name: product[0].p_name,
            p_price: product[0].p_price,
            p_image: product[0].p_image,
            quantity: 1 // Default quantity when added
        };

        // Check if product already exists in cart
        const existingItemIndex = cart.findIndex(item => item.p_id == productId);
        if (existingItemIndex >= 0) {
            cart[existingItemIndex].quantity += 1; // Increase quantity if already in cart
        } else {
            cart.push(item); // Add new item to cart
        }

        req.session.cart = cart;
        req.session.successMsg = 'Product added to cart successfully';
        res.redirect('/shop');
    });
};

exports.removeFromCart = (req, res) => {
    const productId = req.params.p_id;
    const cart = req.session.cart || [];

    req.session.cart = cart.filter(item => item.p_id != productId);
    req.session.successMsg = 'Product removed from cart successfully';
    res.redirect('/cart');
};

// Static pages controllers
exports.getHomepage = (req, res) => {
    res.render('homepage');
};

exports.getAbout = (req, res) => {
    res.render('about_us');
};

exports.getServices = (req, res) => {
    res.render('services');
};

exports.getContactUs = (req, res) => {
    res.render('contact_us');
};

exports.getBlog = (req, res) => {
    res.render('blog');
};

exports.getCart = (req, res) => {
    res.render('cart', { cart: req.session.cart || [], successMsg: req.session.successMsg, errorMsg: req.session.errorMsg });
    req.session.successMsg = null;
    req.session.errorMsg = null;
};

exports.getShop = (req, res) => {
    Product.getAll((err, products) => {
        if (err) throw err;
        res.render('shop', { products });
    });
};
