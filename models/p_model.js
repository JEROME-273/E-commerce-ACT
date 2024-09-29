const db = require('../config/db');

const Product = {
    getAll: (callback) => {
        db.query('SELECT * FROM Products', callback);
    },
    add: (product, callback) => {
        db.query('INSERT INTO Products SET ?', product, callback);
    },
    getById: (p_id, callback) => {
        db.query('SELECT * FROM Products WHERE p_id = ?', [p_id], callback); // Ensure you're using p_id
    },
    update: (p_id, product, callback) => {
        db.query('UPDATE Products SET ? WHERE p_id = ?', [product, p_id], callback); // Ensure you're using p_id
    },
    delete: (p_id, callback) => {
        db.query('DELETE FROM Products WHERE p_id = ?', [p_id], callback); // Ensure you're using p_id
    },
};

module.exports = Product;
