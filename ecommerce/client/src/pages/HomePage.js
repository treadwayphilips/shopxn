import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get('/products/featured'), api.get('/products/categories')])
      .then(([f, c]) => { setFeatured(f.data); setCategories(c.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search)}`);
  };

  return (
    <div>
      {/* Hero */}
      <section style={styles.hero}>
        <div className="container" style={styles.heroInner}>
          <h1 style={styles.heroTitle}>Shop Everything,<br /><span style={styles.heroAccent}>Delivered Fast</span></h1>
          <p style={styles.heroSub}>Thousands of products at unbeatable prices</p>
          <form onSubmit={handleSearch} style={styles.heroSearch}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="What are you looking for?" style={styles.heroInput} />
            <button type="submit" className="btn btn-primary btn-lg">Search</button>
          </form>
          <Link to="/products" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: '#fff', marginTop: 16 }}>Browse All Products →</Link>
        </div>
      </section>

      {/* Categories */}
      <section style={styles.section}>
        <div className="container">
          <h2 style={styles.sectionTitle}>Shop by Category</h2>
          <div style={styles.catGrid}>
            {categories.map(cat => (
              <Link to={`/products?category=${cat.slug}`} key={cat.id} style={styles.catCard}>
                <span style={styles.catEmoji}>{getCatEmoji(cat.slug)}</span>
                <span style={styles.catName}>{cat.name}</span>
                <span style={styles.catCount}>{cat.product_count} items</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={styles.section}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Featured Products</h2>
            <Link to="/products" style={{ color: '#3b82f6', fontWeight: 600 }}>View all →</Link>
          </div>
          {loading ? <div className="spinner" /> : (
            featured.length ? (
              <div className="grid-4">
                {featured.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : <p style={{ color: '#64748b' }}>No featured products yet.</p>
          )}
        </div>
      </section>

      {/* Banner */}
      <section style={styles.banner}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Free Shipping on Orders Over $50</h2>
          <p style={{ color: '#bfdbfe', marginBottom: 20 }}>Limited time offer — shop now and save!</p>
          <Link to="/products" className="btn btn-primary btn-lg">Shop Now</Link>
        </div>
      </section>
    </div>
  );
}

function getCatEmoji(slug) {
  const map = { electronics: '💻', clothing: '👗', books: '📚', 'home-kitchen': '🏠', sports: '⚽' };
  return map[slug] || '📦';
}

const styles = {
  hero: { background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', padding: '80px 0', color: '#fff' },
  heroInner: { textAlign: 'center' },
  heroTitle: { fontSize: 48, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 },
  heroAccent: { color: '#3b82f6' },
  heroSub: { fontSize: 18, color: '#94a3b8', marginBottom: 32 },
  heroSearch: { display: 'flex', maxWidth: 520, margin: '0 auto', gap: 0 },
  heroInput: { flex: 1, padding: '14px 20px', borderRadius: '10px 0 0 10px', border: 'none', fontSize: 16, outline: 'none' },
  section: { padding: '60px 0' },
  sectionTitle: { fontSize: 26, fontWeight: 700, marginBottom: 24 },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  catGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 },
  catCard: { background: '#fff', borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 6, transition: 'transform 0.2s' },
  catEmoji: { fontSize: 32 },
  catName: { fontWeight: 600, fontSize: 14 },
  catCount: { fontSize: 12, color: '#64748b' },
  banner: { background: 'linear-gradient(90deg, #1e40af, #3b82f6)', padding: '60px 0' },
};
