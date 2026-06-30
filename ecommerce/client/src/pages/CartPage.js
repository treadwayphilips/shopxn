import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

export default function CartPage() {
  const { cart, updateCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (!cart.items.length) return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <div className="empty-state">
        <div style={{ fontSize: 64 }}>🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add some products to get started</p>
        <Link to="/products" className="btn btn-primary btn-lg" style={{ marginTop: 20 }}>Shop Now</Link>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 className="page-title">Shopping Cart</h1>
      <div style={styles.grid}>
        {/* Items */}
        <div>
          {cart.items.map(item => (
            <div key={item.id} style={styles.item}>
              <img src={item.image || 'https://via.placeholder.com/80?text=?'} alt={item.name} style={styles.itemImg} />
              <div style={{ flex: 1 }}>
                <Link to={`/products/${item.product_id}`} style={{ fontWeight: 600, fontSize: 15 }}>{item.name}</Link>
                <p style={{ color: '#64748b', fontSize: 14 }}>Unit: ${item.price}</p>
              </div>
              <div style={styles.qtyRow}>
                <button onClick={() => updateCart(item.id, item.quantity - 1)} style={styles.qtyBtn} disabled={item.quantity <= 1}>−</button>
                <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                <button onClick={() => updateCart(item.id, item.quantity + 1)} style={styles.qtyBtn} disabled={item.quantity >= item.stock}>+</button>
              </div>
              <span style={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</span>
              <button onClick={() => { removeFromCart(item.id); toast.success('Removed'); }} style={styles.removeBtn}>✕</button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={styles.summary}>
          <h3 style={{ marginBottom: 20, fontWeight: 700, fontSize: 18 }}>Order Summary</h3>
          <div style={styles.summaryRow}><span>Subtotal</span><span>${cart.total.toFixed(2)}</span></div>
          <div style={styles.summaryRow}><span>Shipping</span><span style={{ color: '#10b981' }}>{cart.total >= 50 ? 'Free' : '$5.00'}</span></div>
          <div style={{ ...styles.summaryRow, borderTop: '1.5px solid #e2e8f0', paddingTop: 12, marginTop: 8 }}>
            <strong>Total</strong>
            <strong style={{ fontSize: 20 }}>${(cart.total + (cart.total >= 50 ? 0 : 5)).toFixed(2)}</strong>
          </div>
          <button onClick={() => navigate('/checkout')} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 20 }}>
            Proceed to Checkout
          </button>
          <Link to="/products" className="btn btn-outline" style={{ width: '100%', marginTop: 10 }}>Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  grid: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' },
  item: { display: 'flex', alignItems: 'center', gap: 16, background: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  itemImg: { width: 80, height: 80, objectFit: 'cover', borderRadius: 8 },
  qtyRow: { display: 'flex', alignItems: 'center', gap: 10 },
  qtyBtn: { width: 30, height: 30, borderRadius: 6, border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  itemTotal: { fontWeight: 700, fontSize: 16, minWidth: 70, textAlign: 'right' },
  removeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 16, padding: 4 },
  summary: { background: '#fff', borderRadius: 10, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', position: 'sticky', top: 80 },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 15 },
};
