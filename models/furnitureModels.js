const db = require('../config/db');

const prod = {
    create: (data, callback) => {
        const query = "INSERT INTO products (p_name, p_quantity, p_price, p_image, p_description) VALUES (?, ?, ?, ?, ?)";
        db.query(query, [data.name, data.quantity, data.price, data.p_image, data.description])
            .then((results) => callback(null, results))
            .catch((err) => callback(err));
    },

    findAllUsers: () => {
        const sql = `SELECT username, email, gender, role FROM users`;
        return db.query(sql).then(([results]) => results);
    },
    findeAllMessage: () => {
        const sql = 'SELECT * FROM contact_us';
        return db.query(sql).then(([results]) => results);
    },
    findeAllOrders: () => {
        const sql = 'SELECT * FROM orders';
        return db.query(sql).then(([results]) => results);
    },
    findeAllProducts: () => {
        const sql = 'SELECT * FROM products';
        return db.query(sql).then(([results]) => results);
    },
    createUser: (data) => {
        const query = "INSERT INTO users (f_name, l_name, gender, email, username, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)";
        return db.query(query, [data.f_name, data.l_name, data.gender, data.email, data.username, data.password, data.role]);
    },
     getUserByUsername: async (username) => {
        try {
            const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
            return rows[0]; // Return the first matching user or undefined if not found
        } catch (error) {
            console.error('Error querying user by username:', error);
            throw error; // Re-throw the error for handling in the calling function
        }
    },

    
};

module.exports = prod;
