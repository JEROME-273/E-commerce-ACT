const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const router = require('./routes/router'); 
const db = require('./config/db'); 

const app = express();
const PORT = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.json()); 

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 9999999 } 
}));


app.use((req, res, next) => {
    console.log('Session:', req.session); 
    next();
});

app.use('/', router);
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).send('Internal Server Error');
});

db.getConnection()
    .then(() => {
        console.log('Connected to database.');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}/login`);
        });
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    });
