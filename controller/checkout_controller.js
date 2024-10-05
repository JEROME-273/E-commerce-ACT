const db = require('../config/db');

exports.getCheckout = async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(403).send('User not authenticated');
    }

    try {
        const [cartItems] = await db.execute(`
            SELECT p.p_id, p.p_name AS product_name, p.p_price AS price, c.quantity 
            FROM cart c
            JOIN products p ON c.product_id = p.p_id
            WHERE c.user_id = ?
        `, [userId]);

        const totalAmount = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);

        res.render('checkout', {
            pageTitle: 'Checkout',
            cartItems: cartItems,
            totalAmount: totalAmount
        });
    } catch (err) {
        console.error('Error fetching cart items:', err);
        res.redirect('/cart');
    }
};

exports.initiateCheckout = async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(403).send('User not authenticated');
    }

    const { c_fullname, c_address, c_phone } = req.body;

    try {
        const [cartItems] = await db.execute(`
            SELECT c.product_id, c.quantity, p.p_price AS price 
            FROM cart c
            JOIN products p ON c.product_id = p.p_id
            WHERE c.user_id = ?
        `, [userId]);

        if (cartItems.length === 0) {
            return res.status(400).send('No items in the cart to process the checkout.');
        }

        for (const item of cartItems) {
            const total_price = item.quantity * item.price;

            await db.query(`
                INSERT INTO orders (user_id, product_id, quantity, total_price, fullname, address, phone) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [userId, item.product_id, item.quantity, total_price, c_fullname, c_address, c_phone]
            );
        }

        await db.query('DELETE FROM cart WHERE user_id = ?', [userId]);

        res.redirect('/thankyou');
    } catch (error) {
        console.error('Error processing checkout:', error);
        res.status(500).send('Error processing checkout');
    }
};
