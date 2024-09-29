const db = require('../config/db');

const prod = {
    create: (data, callback) => {
        const query = "INSERT INTO products (p_name, p_quantity, p_price, p_image, p_description) VALUES (?, ?, ?, ?, ?)";
        db.query(query, [data.name, data.p_quantity, data.price, data.p_image, data.description], callback);
    },

    findAllUsers: () => {
        const sql = `SELECT username, email, gender, role FROM users`;
        return db.query(sql).then(([results]) => results); // Use promise-based query
    },
    findeAllMessage: () => {
        const sql = 'SELECT * FROM contact_us';
        return db.query(sql).then(([results]) => results); // Use promise-based query
    },
    findeAllOrders: () => {
        const sql = 'SELECT * FROM orders';
        return db.query(sql).then(([results]) => results); // Use promise-based query
    },
    findeAllProducts: () => {
        const sql = 'SELECT * FROM products';
        return db.query(sql).then(([results]) => results); // Use promise-based query
    }
};

module.exports = prod;
