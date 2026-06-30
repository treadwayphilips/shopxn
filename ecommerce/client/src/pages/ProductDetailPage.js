import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner" />;
  if (!product) return <div className="empty-state"><h3>Product not found</h3></div>;

  const handleAdd = async () => {
    if (!user) { toast.error('Please login first'); navigate('/login'); return; }
    try { await addToCart(product.id, qty); toast.success('Added to cart!'); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login first'); return; }
    try {
      await api.post(`/products/${id}/review`, review);
      toast.success('Review submitted!');
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={styles.grid}>
        {/* Image */}
        <div>
          <img src={product.image || 'https://via.placeholder.com/500x400?text=No+Image'} alt={product.name} style={styles.mainImage} />
        </div>

        {/* Info */}
        <div>
          <p style={styles.category}>{product.category_name}</p>
          <h1 style={styles.title}>{product.name}</h1>

          <div style={styles.ratingRow}>
            <span style={{ color: '#f59e0b', fontSize: 18 }}>{'★'.repeat(Math.round(product.rating || 0))}{'☆'.repeat(5 - Math.round(product.rating || 0))}</span>
            <span style={{ color: '#64748b' }}>({product.review_count} reviews)</span>
          </div>

          <div style={styles.priceRow}>
            <span style={styles.price}>${product.price}</span>
            {product.compare_price && <span style={styles.comparePrice}>${product.compare_price}</span>}
          </div>

          <p style={styles.description}>{product.description}</p>

          <div style={styles.stockRow}>
            <span style={{ color: product.stock > 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
              {product.stock > 0 ? `✓ In Stock (${product.stock})` : '✗ Out of Stock'}
            </span>
          </div>

          {product.stock > 0 && (
            <div style={styles.qtyRow}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={styles.qtyBtn}>−</button>
              <span style={styles.qtyVal}>{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={styles.qtyBtn}>+</button>
            </div>
          )}

          <button onClick={handleAdd} className="btn btn-primary btn-lg" disabled={product.stock === 0} style={{ marginTop: 20, width: '100%' }}>
            🛒 Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div style={{ marginTop: 60 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Customer Reviews</h2>
        {user && (
          <form onSubmit={handleReview} style={styles.reviewForm}>
            <h3 style={{ marginBottom: 12 }}>Write a Review</h3>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Rating</label>
              <select value={review.rating} onChange={e => setReview({ ...review, rating: e.target.value })} style={styles.select}>
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} ★</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <textarea value={review.comment} onChange={e => setReview({ ...review, comment: e.target.value })} placeholder="Share your experience..." rows={4} style={styles.textarea} />
            </div>
            <button type="submit" className="btn btn-primary">Submit Review</button>
          </form>
        )}

        <div style={{ marginTop: 32 }}>
          {product.reviews?.length ? product.reviews.map(r => (
            <div key={r.id} style={styles.reviewCard}>
              <div style={styles.reviewHeader}>
                <span style={styles.reviewUser}>{r.user_name}</span>
                <span style={{ color: '#f59e0b' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              </div>
              <p style={{ color: '#475569' }}>{r.comment}</p>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>{new Date(r.created_at).toLocaleDateString()}</p>
            </div>
          )) : <p style={{ color: '#64748b' }}>No reviews yet. Be the first!</p>}
        </div>
      </div>
    </div>
  );
}

const styles = {
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' },
  mainImage: { width: '100%', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  category: { fontSize: 13, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  title: { fontSize: 30, fontWeight: 800, marginBottom: 12, lineHeight: 1.3 },
  ratingRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 },
  priceRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
  price: { fontSize: 32, fontWeight: 800, color: '#0f172a' },
  comparePrice: { fontSize: 20, color: '#94a3b8', textDecoration: 'line-through' },
  description: { color: '#475569', lineHeight: 1.8, marginBottom: 20 },
  stockRow: { marginBottom: 16 },
  qtyRow: { display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 },
  qtyBtn: { width: 36, height: 36, borderRadius: 8, border: '1.5px solid #e2e8f0', background: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qtyVal: { fontSize: 18, fontWeight: 700, minWidth: 32, textAlign: 'center' },
  reviewForm: { background: '#f8fafc', borderRadius: 10, padding: 24, marginBottom: 32, border: '1px solid #e2e8f0' },
  select: { padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, width: 160 },
  textarea: { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 15, resize: 'vertical' },
  reviewCard: { background: '#fff', borderRadius: 10, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  reviewHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 },
  reviewUser: { fontWeight: 600, fontSize: 15 },
};
