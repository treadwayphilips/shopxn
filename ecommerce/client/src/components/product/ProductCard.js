import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login first'); return; }
    try {
      await addToCart(product.id);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login first'); return; }
    try {
      const { data } = await api.post('/cart/wishlist', { productId: product.id });
      toast.success(data.wishlisted ? 'Added to wishlist' : 'Removed from wishlist');
    } catch { toast.error('Failed'); }
  };

  const discount = product.compare_price ? Math.round((1 - product.price / product.compare_price) * 100) : 0;

  return (
    <Link to={`/products/${product.id}`} style={styles.card}>
      <div style={styles.imageWrap}>
        <img src={product.image || 'https://via.placeholder.com/300x220?text=No+Image'} alt={product.name} style={styles.image} />
        {discount > 0 && <span style={styles.discountBadge}>-{discount}%</span>}
        <button onClick={handleWishlist} style={styles.wishBtn}>❤️</button>
      </div>
      <div style={styles.body}>
        <p style={styles.category}>{product.category_name}</p>
        <h3 style={styles.name}>{product.name}</h3>
        <div style={styles.rating}>
          {'★'.repeat(Math.round(product.rating || 0))}{'☆'.repeat(5 - Math.round(product.rating || 0))}
          <span style={styles.ratingCount}>({product.review_count || 0})</span>
        </div>
        <div style={styles.priceRow}>
          <span style={styles.price}>${product.price}</span>
          {product.compare_price && <span style={styles.comparePrice}>${product.compare_price}</span>}
        </div>
        {product.stock === 0
          ? <span style={styles.outOfStock}>Out of Stock</span>
          : <button onClick={handleAdd} className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>Add to Cart</button>
        }
      </div>
    </Link>
  );
}

const styles = {
  card: { background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'block', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' },
  imageWrap: { position: 'relative', overflow: 'hidden', height: 200 },
  image: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' },
  discountBadge: { position: 'absolute', top: 10, left: 10, background: '#ef4444', color: '#fff', padding: '3px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700 },
  wishBtn: { position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 14 },
  body: { padding: 16 },
  category: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  name: { fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 6, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' },
  rating: { color: '#f59e0b', fontSize: 13, marginBottom: 6 },
  ratingCount: { color: '#94a3b8', marginLeft: 4 },
  priceRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 },
  price: { fontSize: 18, fontWeight: 700, color: '#0f172a' },
  comparePrice: { fontSize: 14, color: '#94a3b8', textDecoration: 'line-through' },
  outOfStock: { display: 'block', textAlign: 'center', color: '#ef4444', fontWeight: 600, fontSize: 14, marginTop: 8 },
};
