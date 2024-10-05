const db = require('../config/db');

exports.findUserByUsername = async (username) => {
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0]; 
    } catch (error) {
        console.error('Error finding user by username:', error.message || error);
        throw error; 
    }
};

exports.createUser = async (username, password) => {
    try {
        await db.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    } catch (error) {
        console.error('Error creating user:', error.message || error);
        throw error; 
    }
};
