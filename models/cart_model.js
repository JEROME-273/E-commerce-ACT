const db = require('../config/db'); 

class CartModel {
    static async addToCart(userId, productId) {
        return await db.query('INSERT INTO cart (user_id, product_id) VALUES (?, ?)', [userId, productId]);
    }

    static async getCartItems(userId) {
    const [cartItems] = await db.query(
        'SELECT p.p_id, p.p_name, p.p_price, p.p_image, c.quantity ' + 
        'FROM products p JOIN cart c ON p.p_id = c.product_id ' +
        'WHERE c.user_id = ?',
        [userId]
    );
    return cartItems;
}
}

module.exports = CartModel;
