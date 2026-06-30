import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container">
        <div style={styles.grid}>
          <div>
            <h3 style={styles.brand}>🛍️ ShopXN</h3>
            <p style={styles.muted}>Your one-stop shop for everything.</p>
          </div>
          <div>
            <h4 style={styles.heading}>Shop</h4>
            <Link to="/products" style={styles.link}>All Products</Link>
            <Link to="/products?category=electronics" style={styles.link}>Electronics</Link>
            <Link to="/products?category=clothing" style={styles.link}>Clothing</Link>
          </div>
          <div>
            <h4 style={styles.heading}>Account</h4>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
            <Link to="/orders" style={styles.link}>My Orders</Link>
          </div>
          <div>
            <h4 style={styles.heading}>Built by</h4>
            <p style={styles.muted}>XN Digital Studio</p>
            <p style={styles.muted}>Abuja, Nigeria</p>
          </div>
        </div>
        <div style={styles.bottom}>
          <p style={styles.muted}>© {new Date().getFullYear()} ShopXN. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: { background: '#0f172a', color: '#fff', padding: '48px 0 24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, marginBottom: 40 },
  brand: { fontSize: 22, fontWeight: 800, marginBottom: 8 },
  heading: { fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 },
  link: { display: 'block', color: '#cbd5e1', fontSize: 14, marginBottom: 8 },
  muted: { color: '#64748b', fontSize: 14, lineHeight: 1.7 },
  bottom: { borderTop: '1px solid #1e293b', paddingTop: 24, textAlign: 'center' },
};
