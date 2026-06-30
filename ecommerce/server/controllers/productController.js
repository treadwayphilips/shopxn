const { pool } = require('../config/database');

exports.getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;
    let query = `SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1`;
    const params = [];

    if (category) { query += ` AND c.slug = ?`; params.push(category); }
    if (search) { query += ` AND (p.name LIKE ? OR p.description LIKE ?)`; params.push(`%${search}%`, `%${search}%`); }
    if (minPrice) { query += ` AND p.price >= ?`; params.push(minPrice); }
    if (maxPrice) { query += ` AND p.price <= ?`; params.push(maxPrice); }

    if (sort === 'price_asc') query += ` ORDER BY p.price ASC`;
    else if (sort === 'price_desc') query += ` ORDER BY p.price DESC`;
    else if (sort === 'rating') query += ` ORDER BY p.rating DESC`;
    else query += ` ORDER BY p.created_at DESC`;

    const [countRows] = await pool.query(query.replace('SELECT p.*, c.name as category_name', 'SELECT COUNT(*) as total'), params);
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);
    const [products] = await pool.query(query, params);

    res.json({ products, total: countRows[0].total, page: parseInt(page), pages: Math.ceil(countRows[0].total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFeatured = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.featured = TRUE LIMIT 8');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Product not found' });
    const [reviews] = await pool.query('SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY r.created_at DESC', [req.params.id]);
    res.json({ ...rows[0], reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT c.*, COUNT(p.id) as product_count FROM categories c LEFT JOIN products p ON c.id = p.category_id GROUP BY c.id');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    await pool.query('INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE rating=VALUES(rating), comment=VALUES(comment)', [req.params.id, req.user.id, rating, comment]);
    const [avg] = await pool.query('SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE product_id = ?', [req.params.id]);
    await pool.query('UPDATE products SET rating = ?, review_count = ? WHERE id = ?', [avg[0].avg, avg[0].count, req.params.id]);
    res.json({ message: 'Review submitted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
