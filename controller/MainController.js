const products = require('../models/furnitureModels');
const db = require('../config/db');

const main = {
    index: async (req, res) => {
        try {
            const allUsers = await products.findAllUsers();
            return allUsers; // Return the user data for use in the router
        } catch (err) {
            return res.status(500).send('Error retrieving data');
        }
    },
    
    getSummaryData: async () => {
        try {
            const [pendingRows] = await db.query("SELECT * FROM `orders` WHERE payment_status = ?", ['pending']);
            const totalPendings = pendingRows.reduce((total, order) => total + order.total_price, 0);
            
            const [completedRows] = await db.query("SELECT * FROM `orders` WHERE payment_status = ?", ['completed']);
            const totalCompleted = completedRows.length;

            const [allOrders] = await db.query("SELECT * FROM `orders`");
            const totalOrdersPlaced = allOrders.length;

            const [messageRows] = await db.query("SELECT * FROM `contact_us`");
            const totalMessages = messageRows.length;

            const [productRows] = await db.query("SELECT * FROM `products`");
            const totalProductsAdded = productRows.length;

            const [accountRows] = await db.query("SELECT * FROM `users`");
            const totalAccounts = accountRows.length;

            return {
                totalPendings,
                totalCompleted,
                totalOrdersPlaced,
                totalMessages,
                totalProductsAdded,
                totalAccounts
            };
        } catch (err) {
            throw new Error('Error retrieving summary data');
        }
    },
    
    accounts: async (req, res) => {
        try {
            const allUsers = await products.findAllUsers();
            res.render('accounts', { users: allUsers });
        } catch (err) {
            return res.status(500).send('Error retrieving accounts data');
        }
    },
    message: async (req, res) => {
        try {
            const allMessage = await products.findeAllMessage();
            res.render('message', { messages: allMessage });
        } catch (err) {
            return res.status(500).send('Error retrieving messages data');
        }
    },
    orders: async (req, res) => {
        try {
            const allOrder = await products.findeAllOrders();
            res.render('orders', { orders: allOrder });
        } catch (err) {
            return res.status(500).send('Error retrieving orders data');
        }
    },
    products: async (req, res) => {
        try {
            const allProducts = await products.findeAllProducts();
            res.render('products', { products: allProducts });
        } catch (err) {
            return res.status(500).send('Error retrieving orders data');
        }
    },
    save: (req, res) => {
        const newProduct = req.body;
        products.create(newProduct, (err) => { // Call products.create instead of product.create
            if (err) throw err;
            res.redirect('/');
        });
    }
};

module.exports = main;
