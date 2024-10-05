const express = require('express');
const app = express();
const routes = require('./routes/router');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash'); // Import connect-flash

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Set up session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

app.use(flash()); // Use flash middleware

// Make flash messages available to all views
app.use((req, res, next) => {
    res.locals.messages = req.flash(); // Pass flash messages to views
    next();
});

app.use('/', routes);
app.use(express.static('Public'));

app.listen(1000, 'localhost', () => {
    console.log('Server running on http://localhost:1000');
});
