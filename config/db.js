const mysql = require('mysql2/promise'); // Use promise version

const db = mysql.createPool({ // Use createPool for better performance with multiple queries
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'e_commerce_act'
});



module.exports = db;
