const Product = require('../models/p_model');
const multer = require('multer');
const path = require('path');
const db = require('../config/db'); 


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage: storage });
const handleFileUpload = (req) => {
    return new Promise((resolve, reject) => {
        upload.single('p_image')(req, null, (err) => {
            if (err) {
                return reject(err);
            }
            resolve(req.file ? req.file.filename : null);
        });
    });
};

exports.getHome = async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products');
        res.render('home', { products, successMsg: req.session.successMsg, errorMsg: req.session.errorMsg });
        req.session.successMsg = null;
        req.session.errorMsg = null;
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.getAddProduct = (req, res) => {
    res.render('add_product');
};

exports.postAddProduct = async (req, res) => {
    try {
        const p_image = await handleFileUpload(req);
        const { p_name, p_quantity, p_price } = req.body;

        if (!p_name || !p_quantity || !p_price || !p_image) {
            return res.status(400).send('All fields are required');
        }

        const query = 'INSERT INTO products (p_name, p_quantity, p_price, p_image) VALUES (?, ?, ?, ?)';
        await db.query(query, [p_name, p_quantity, p_price, p_image]);
        req.session.successMsg = 'Product added successfully';
        res.redirect('/');
    } catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).send('Error: ' + error);
    }
};

exports.getEditProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const [product] = await db.query('SELECT * FROM products WHERE p_id = ?', [id]);
        res.render('edit_product', { product: product[0] });
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.getShop = async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products');
        res.render('shop', { products }); 
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.postEditProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const p_image = await handleFileUpload(req);
        const updatedProduct = {
            p_name: req.body.p_name,
            p_quantity: req.body.p_quantity,
            p_price: req.body.p_price,
            p_image 
        };

        if (!updatedProduct.p_name || !updatedProduct.p_quantity || !updatedProduct.p_price) {
            return res.status(400).send('All fields are required');
        }

        const query = `
            UPDATE products
            SET p_name = ?, p_quantity = ?, p_price = ?, p_image = COALESCE(?, p_image)
            WHERE p_id = ?`;
        await db.query(query, [updatedProduct.p_name, updatedProduct.p_quantity, updatedProduct.p_price, p_image, id]);
        req.session.successMsg = 'Product updated successfully';
        res.redirect('/');
    } catch (err) {
        req.session.errorMsg = 'Failed to update product';
        return res.redirect(`/edit-product/${id}`);
    }
};

exports.deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
        await db.query('DELETE FROM products WHERE p_id = ?', [id]);
        req.session.successMsg = 'Product deleted successfully';
        res.redirect('/');
    } catch (err) {
        req.session.errorMsg = 'Failed to delete product';
        res.redirect('/');
    }
};

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
    res.render('cart');
}