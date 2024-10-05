const products = require('../models/furnitureModels');
const bcrypt = require('bcrypt'); // Import bcrypt for hashing passwords
const db = require('../config/db');

const main = {

    // start admin
    // In the index function
    index: async (req, res) => {
        try {
            const summaryData = await main.getSummaryData();
            const allUsers = await products.findAllUsers();
            res.render('index', { data: allUsers, ...summaryData }); // Send response back
        } catch (err) {
            console.error('Error retrieving users:', err); // Log the error
            return res.status(500).send('Error retrieving data');
        }
    },


    getSummaryData: async () => {
        try {
            const [pendingRows] = await db.query("SELECT * FROM `orders` WHERE payment_status = ?", ['pending']);
            const totalPendings = pendingRows.reduce((total, order) => total + order.total_price, 0);
    
            const [completedRows] = await db.query("SELECT * FROM `orders` WHERE payment_status = ?", ['completed']);
            const totalCompleted = completedRows.length;
    
            const [allOrders] = await db.query("SELECT * FROM `orders`");
            const totalOrdersPlaced = allOrders.length;
    
            const [messageRows] = await db.query("SELECT * FROM `contact_us`");
            const totalMessages = messageRows.length;
    
            const [productRows] = await db.query("SELECT * FROM `products`");
            const totalProductsAdded = productRows.length;
    
            const [accountRows] = await db.query("SELECT * FROM `users`");
            const totalAccounts = accountRows.length;
    
            return {
                totalPendings,
                totalCompleted,
                totalOrdersPlaced,
                totalMessages,
                totalProductsAdded,
                totalAccounts
            };
        } catch (err) {
            throw new Error('Error retrieving summary data');
        }
    },    

    accounts: async (req, res) => {
        try {
            const allUsers = await products.findAllUsers();
            res.render('accounts', { users: allUsers });
        } catch (err) {
            return res.status(500).send('Error retrieving accounts data');
        }
    },
    message: async (req, res) => {
        try {
            const allMessage = await products.findeAllMessage();
            res.render('message', { messages: allMessage });
        } catch (err) {
            return res.status(500).send('Error retrieving messages data');
        }
    },
    orders: async (req, res) => {
        try {
            const allOrder = await products.findeAllOrders();
            res.render('orders', { orders: allOrder });
        } catch (err) {
            return res.status(500).send('Error retrieving orders data');
        }
    },
    products: async (req, res) => {
        try {
            const allProducts = await products.findeAllProducts();
            res.render('products', { products: allProducts });
        } catch (err) {
            return res.status(500).send('Error retrieving orders data');
        }
    },
    save: (req, res) => {
        const newProduct = req.body;
        newProduct.p_image = req.file ? `/uploads/${req.file.filename}` : ''; // Handle image upload path

        products.create(newProduct, (err) => {
            if (err) {
                console.error('Error inserting new product:', err);
                return res.status(500).send('Error saving product');
            }
            res.redirect('/products'); // Redirect to the homepage on success
        });
    },

    // end ng admin

    

    // Updated function to pass products to the userIndex view
    userIndex: async (req, res) => {
        try {
            const allProducts = await products.findeAllProducts(); // Fetch all products
            res.render('userIndex', { products: allProducts }); // Pass products to the userIndex view
        } catch (err) {
            console.error('Error retrieving products data:', err);
            res.status(500).send('Error retrieving products data'); 
        }
    },

    userShop: async (req, res) => {
        const userId = req.params.userId;
        try{
            const allProducts = await products.findeAllProducts();
            res.render('userShop', {products: allProducts});
        } catch (err){
            console.error('Error retrieving products data:', err);
            res.status(500).send('Error retrieving products data');
        }
    },
    userAboutUs: (req, res) => {
        res.render('userAboutUs');
    },
    userService: async (req, res) => {
        try{
            const allProducts = await products.findeAllProducts();
            res.render('userService', {products: allProducts});
        } catch (err){
            console.error('Error retrieving products data:', err);
            res.status(500).send('Error retrieving products data');
        }
    },
    userBlog: (req, res) => {
        res.render('userBlog');
    },
    userContact: (req, res) => {
        res.render('userContact');
    },

    userCart: async (req, res) => {
        try {
            // Fetch all items in the cart
            const [cartItems] = await db.query("SELECT * FROM `cart`");
            res.render('userCart', { cartItems });
        } catch (err) {
            console.error('Error retrieving cart data:', err);
            res.status(500).send('Error retrieving cart data');
        }
    },
    
    
    addToCart: async (req, res) => {
        try {
            const { productId, productName, productPrice, productImage } = req.body;

            // SQL query to insert the selected product into the cart table
            await db.query("INSERT INTO cart (product_id, product_name, product_price, product_image) VALUES (?, ?, ?, ?)", 
                [productId, productName, productPrice, productImage]);

            res.redirect('/userCart'); // Redirect to the cart page to show the updated cart
        } catch (err) {
            console.error('Error adding product to cart:', err);
            res.status(500).send('Error adding product to cart');
        }
    },
   
    register: (req, res) => {
        res.render('register');
    },
    login: (req, res) => {
        res.render('login');
    },
    registerUser: async (req, res) => {
        const { firstName, lastName, gender, email, username, password } = req.body;

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Prepare the user data
        const newUser = {
            f_name: firstName,
            l_name: lastName,
            gender: gender,
            email: email,
            username: username,
            password: hashedPassword,
            role: 'user' // Set default role to 'user'
        };

        try {
            // Save the new user using the model method
            await products.createUser(newUser);
            res.redirect('/login'); // Redirect to the login page after successful registration
        } catch (err) {
            console.error('Error saving user:', err);
            res.status(500).send('Error saving user');
        }
    },
    // In your login route
    loginUser: async (req, res) => {
        const { username, password } = req.body;
        console.log('Username from form:', username);
        try {
            const user = await products.getUserByUsername(username);
            console.log('User from database:', user);

            if (user) {
                // Check the password
                const match = await bcrypt.compare(password, user.password);
                console.log('Password match status:', match);

                if (match) {
                    req.session.userId = user.Id; // Store user ID in session
                    
                    // Check user role and redirect accordingly
                    if (user.role === 'admin') {
                        console.log('Admin logged in:', user);
                        return res.redirect(`/`); // Redirect admin to adminIndex
                    } else {
                        console.log('User logged in:', user);
                        return res.redirect(`/userIndex/${user.Id}`); // Redirect regular user to their userIndex with their ID
                    }
                } else {
                    // Incorrect password
                    console.log('Incorrect password');
                    req.flash('error', 'Invalid username or password'); // Set flash message
                    return res.redirect('/login'); // Redirect back to login with error message
                }
            } else {
                // User not found
                console.log('User not found');
                req.flash('error', 'Invalid username or password'); // Set flash message
                return res.redirect('/login'); // Redirect back to login with error message
            }
        } catch (err) {
            console.error('Error during login:', err);
            return res.status(500).send('Internal Server Error');
        }
    }

    
};

module.exports = main;
