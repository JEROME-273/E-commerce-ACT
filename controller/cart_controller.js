const db = require('../config/db');

exports.addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.session.userId;

        if (!userId) {
            return res.status(403).send('User not authenticated'); 
        }
        const [product] = await db.query('SELECT p_price, p_image FROM products WHERE p_id = ?', [productId]);
        if (product.length === 0) {
            return res.status(404).send('Product not found');
        }
        const price = product[0].p_price;
        const [cartItems] = await db.query('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', [userId, productId]);

        if (cartItems.length > 0) {
            const newQuantity = cartItems[0].quantity + 1;
            const totalAmount = price * newQuantity; 
            await db.query('UPDATE cart SET quantity = ?, total_amount = ? WHERE user_id = ? AND product_id = ?', [newQuantity, totalAmount, userId, productId]);
        } else {
            const totalAmount = price; 
            await db.query('INSERT INTO cart (user_id, product_id, quantity, price, total_amount) VALUES (?, ?, ?, ?, ?)', [userId, productId, 1, price, totalAmount]);
        }

        res.redirect('/cart'); 
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).send("Server Error");
    }
};



exports.getCartItems = async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(403).send('User not authenticated');
    }

    try {
        const [cartItems] = await db.query(
            `SELECT p.p_id, p.p_name AS productName, p.p_price AS productPrice, 
                    c.quantity, p.p_image AS productImage
             FROM products p 
             JOIN cart c ON p.p_id = c.product_id 
             WHERE c.user_id = ?`,
            [userId]
        );

        console.log('Retrieved Cart Items:', cartItems);
        if (cartItems.length === 0) {
            return res.render('cart', { cartItems, message: "Your cart is empty." });
        }

        res.render('cart', { cartItems });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).send('Server Error');
    }
};


exports.removeFromCart = async (req, res) => {
    const productId = req.params.productId;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(403).send('User not authenticated');
    }

    try {
        await db.query('DELETE FROM cart WHERE user_id = ? AND product_id = ?', [userId, productId]);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ success: false, message: 'Failed to remove item' });
    }
};

  



