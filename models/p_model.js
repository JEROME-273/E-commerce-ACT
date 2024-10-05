const db = require('../config/db');

const Product = {
    getAll: async () => {
        try {
            const [rows] = await db.query('SELECT * FROM products');
            return rows; 
        } catch (error) {
            console.error('Error fetching all products:', error);
            throw error;
        }
    },
    add: async (product) => {
        try {
            await db.query('INSERT INTO products SET ?', product);
        } catch (error) {
            console.error('Error adding product:', error);
            throw error; 
        }
    },
    getById: async (p_id) => {
        try {
            const [rows] = await db.query('SELECT * FROM products WHERE p_id = ?', [p_id]);
            return rows[0]; 
        } catch (error) {
            console.error('Error fetching product by ID:', error);
            throw error; 
        }
    },
    update: async (p_id, product) => {
        try {
            await db.query('UPDATE products SET ? WHERE p_id = ?', [product, p_id]);
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },
    delete: async (p_id) => {
        try {
            await db.query('DELETE FROM products WHERE p_id = ?', [p_id]);
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error; 
        }
    },
};

module.exports = Product;
