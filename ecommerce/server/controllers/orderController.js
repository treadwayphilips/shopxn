const { pool } = require('../config/database');

exports.createOrder = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { items, shippingAddress, paymentId, couponCode } = req.body;
    if (!items || !items.length) return res.status(400).json({ message: 'No items in order' });

    let total = 0;
    let discount = 0;

    // Validate stock and calculate total
    for (const item of items) {
      const [rows] = await conn.query('SELECT * FROM products WHERE id = ?', [item.productId]);
      if (!rows.length) throw new Error(`Product ${item.productId} not found`);
      if (rows[0].stock < item.quantity) throw new Error(`Insufficient stock for ${rows[0].name}`);
      total += rows[0].price * item.quantity;
    }

    // Apply coupon
    if (couponCode) {
      const [coupons] = await conn.query('SELECT * FROM coupons WHERE code = ? AND active = TRUE AND (expires_at IS NULL OR expires_at >= CURDATE())', [couponCode]);
      if (coupons.length && total >= coupons[0].min_order) {
        discount = coupons[0].discount_type === 'percent' ? (total * coupons[0].discount_value / 100) : coupons[0].discount_value;
      }
    }

    const finalTotal = total - discount;
    const [orderResult] = await conn.query(
      'INSERT INTO orders (user_id, total, shipping_address, stripe_payment_id, coupon_code, discount) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, finalTotal, JSON.stringify(shippingAddress), paymentId, couponCode, discount]
    );

    for (const item of items) {
      const [rows] = await conn.query('SELECT price FROM products WHERE id = ?', [item.productId]);
      await conn.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', [orderResult.insertId, item.productId, item.quantity, rows[0].price]);
      await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.productId]);
    }

    // Clear cart
    await conn.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    await conn.commit();
    res.status(201).json({ orderId: orderResult.insertId, total: finalTotal });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};

exports.getOrders = async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    for (const order of orders) {
      const [items] = await pool.query('SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?', [order.id]);
      order.items = items;
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!orders.length) return res.status(404).json({ message: 'Order not found' });
    const [items] = await pool.query('SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?', [req.params.id]);
    res.json({ ...orders[0], items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
