const mysql = require('mysql2/promise'); 
const db = mysql.createPool({ 
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'E_commerce_ACT',
});

//Test the connection
db.getConnection()
    .then(() => console.log('Connected to database.'))
    .catch(err => console.error('Database connection failed:', err));

module.exports = db;
