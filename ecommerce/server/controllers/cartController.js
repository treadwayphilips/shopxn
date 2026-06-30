const { pool } = require('../config/database');

exports.getCart = async (req, res) => {
  try {
    const [items] = await pool.query(
      'SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image, p.stock FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?',
      [req.user.id]
    );
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    res.json({ items, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const [product] = await pool.query('SELECT * FROM products WHERE id = ?', [productId]);
    if (!product.length) return res.status(404).json({ message: 'Product not found' });
    if (product[0].stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });
    await pool.query('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?', [req.user.id, productId, quantity, quantity]);
    res.json({ message: 'Added to cart' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ message: 'Invalid quantity' });
    await pool.query('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, req.params.id, req.user.id]);
    res.json({ message: 'Cart updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    await pool.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const [items] = await pool.query('SELECT p.* FROM wishlist w JOIN products p ON w.product_id = p.id WHERE w.user_id = ?', [req.user.id]);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const [existing] = await pool.query('SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?', [req.user.id, productId]);
    if (existing.length) {
      await pool.query('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [req.user.id, productId]);
      res.json({ wishlisted: false });
    } else {
      await pool.query('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)', [req.user.id, productId]);
      res.json({ wishlisted: true });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.applyCoupon = async (req, res) => {
  try {
    const { code, total } = req.body;
    const [coupons] = await pool.query('SELECT * FROM coupons WHERE code = ? AND active = TRUE AND (expires_at IS NULL OR expires_at >= CURDATE())', [code]);
    if (!coupons.length) return res.status(404).json({ message: 'Invalid or expired coupon' });
    const c = coupons[0];
    if (total < c.min_order) return res.status(400).json({ message: `Minimum order ₦${c.min_order} required` });
    const discount = c.discount_type === 'percent' ? (total * c.discount_value / 100) : c.discount_value;
    res.json({ discount, code: c.code });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
