import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { navigate(`/products?search=${encodeURIComponent(search)}`); setSearch(''); }
  };

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.inner}>
        <Link to="/" style={styles.logo}>🛍️ ShopXN</Link>

        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={styles.searchInput} />
          <button type="submit" style={styles.searchBtn}>🔍</button>
        </form>

        <div style={styles.actions}>
          <Link to="/products" style={styles.link}>Shop</Link>
          {user ? (
            <>
              <Link to="/wishlist" style={styles.link}>❤️</Link>
              <Link to="/cart" style={styles.cartBtn}>
                🛒 <span style={styles.badge}>{cartCount}</span>
              </Link>
              {user.role === 'admin' && <Link to="/admin" style={styles.link}>Admin</Link>}
              <div style={styles.userMenu}>
                <span style={styles.link}>{user.name.split(' ')[0]} ▾</span>
                <div style={styles.dropdown}>
                  <Link to="/profile" style={styles.dropItem}>Profile</Link>
                  <Link to="/orders" style={styles.dropItem}>Orders</Link>
                  <button onClick={() => { logout(); navigate('/'); }} style={styles.dropItem}>Logout</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: { background: '#0f172a', color: '#fff', padding: '0 0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.2)' },
  inner: { display: 'flex', alignItems: 'center', gap: 20, height: 64 },
  logo: { fontSize: 22, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' },
  searchForm: { flex: 1, display: 'flex', maxWidth: 400 },
  searchInput: { flex: 1, padding: '8px 14px', borderRadius: '8px 0 0 8px', border: 'none', fontSize: 14, outline: 'none' },
  searchBtn: { padding: '8px 14px', background: '#3b82f6', border: 'none', borderRadius: '0 8px 8px 0', cursor: 'pointer', fontSize: 16 },
  actions: { display: 'flex', alignItems: 'center', gap: 16 },
  link: { color: '#cbd5e1', fontSize: 14, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit' },
  cartBtn: { color: '#fff', fontSize: 16, position: 'relative' },
  badge: { background: '#3b82f6', color: '#fff', borderRadius: '50%', padding: '1px 6px', fontSize: 11, fontWeight: 700 },
  userMenu: { position: 'relative', cursor: 'pointer', '&:hover > div': { display: 'block' } },
  dropdown: { position: 'absolute', right: 0, top: '100%', background: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', borderRadius: 8, minWidth: 140, zIndex: 200, display: 'none' },
  dropItem: { display: 'block', padding: '10px 16px', color: '#1e293b', fontSize: 14, background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' },
};
