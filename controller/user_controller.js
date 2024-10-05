const User = require('../models/user_model');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    const { username, password, confirmPassword } = req.body;

    try {
        const existingUser = await User.findUserByUsername(username);
        if (existingUser) {
            req.session.errorMsg = 'Username already exists';
            return res.redirect('/signup');
        }

        if (password !== confirmPassword) {
            req.session.errorMsg = 'Passwords do not match';
            return res.redirect('/signup');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.createUser(username, hashedPassword);

        req.session.successMsg = 'Account created successfully. You can now log in.';
        res.redirect('/login');
    } catch (err) {
        console.error('Error during signup:', err.message || err);
        req.session.errorMsg = 'Error signing up. Please try again.';
        res.redirect('/signup');
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findUserByUsername(username);
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user.user_id;
            req.session.successMsg = 'Login successful';
            return res.redirect('/homepage');
        }
        req.session.errorMsg = 'Invalid username or password';
        res.redirect('/login');
    } catch (err) {
        console.error('Error during login:', err);
        req.session.errorMsg = 'Invalid username or password.';
        res.redirect('/login');
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/homepage'); 
        }
        res.redirect('/login'); 
    });
};

exports.adminLogin = (req, res) => {
    const { username, password } = req.body;
  
    const adminUsername = 'admin';
    const adminPassword = 'admin';
  
    if (username === adminUsername && password === adminPassword) {
      req.session.isAdmin = true; 
      res.redirect('/adminpage'); 
    } else {
      req.session.errorMsg = 'Invalid username or password. Please try again.';
      res.redirect('/adminLogin'); 
    }
  };