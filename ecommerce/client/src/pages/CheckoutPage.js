import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [address, setAddress] = useState({ name: '', street: '', city: '', state: '', zip: '', country: 'Nigeria' });

  const shipping = cart.total >= 50 ? 0 : 5;
  const finalTotal = cart.total - discount + shipping;

  const handleCoupon = async () => {
    try {
      const { data } = await api.post('/cart/coupon', { code: coupon, total: cart.total });
      setDiscount(data.discount);
      toast.success(`Coupon applied! -$${data.discount.toFixed(2)}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Invalid coupon'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!address.name || !address.street || !address.city) { toast.error('Fill in all address fields'); return; }
    setLoading(true);
    try {
      const { data: { clientSecret } } = await api.post('/payment/create-intent', { amount: finalTotal });
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement), billing_details: { name: address.name } }
      });
      if (error) { toast.error(error.message); setLoading(false); return; }
      const items = cart.items.map(i => ({ productId: i.product_id, quantity: i.quantity }));
      const { data } = await api.post('/orders', { items, shippingAddress: address, paymentId: paymentIntent.id, couponCode: coupon });
      fetchCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${data.orderId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally { setLoading(false); }
  };

  if (!cart.items.length) { navigate('/cart'); return null; }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 className="page-title">Checkout</h1>
      <div style={styles.grid}>
        <form onSubmit={handleSubmit}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Shipping Address</h3>
            {['name', 'street', 'city', 'state', 'zip', 'country'].map(field => (
              <div className="form-group" key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input value={address[field]} onChange={e => setAddress({ ...address, [field]: e.target.value })} required={['name','street','city'].includes(field)} />
              </div>
            ))}
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Payment</h3>
            <div style={styles.cardElement}>
              <CardElement options={{ style: { base: { fontSize: '16px', color: '#1e293b' } } }} />
            </div>
            <p style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>Test card: 4242 4242 4242 4242 | Any future date | Any 3-digit CVC</p>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: 20 }}>
            {loading ? 'Processing...' : `Pay $${finalTotal.toFixed(2)}`}
          </button>
        </form>

        {/* Summary */}
        <div style={styles.summary}>
          <h3 style={{ marginBottom: 20, fontWeight: 700 }}>Order Summary</h3>
          {cart.items.map(item => (
            <div key={item.id} style={styles.summaryItem}>
              <img src={item.image || 'https://via.placeholder.com/50'} alt="" style={styles.summaryImg} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</p>
                <p style={{ fontSize: 13, color: '#64748b' }}>×{item.quantity}</p>
              </div>
              <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <div style={styles.couponRow}>
            <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon code" style={styles.couponInput} />
            <button type="button" onClick={handleCoupon} className="btn btn-outline btn-sm">Apply</button>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16, marginTop: 16 }}>
            <div style={styles.row}><span>Subtotal</span><span>${cart.total.toFixed(2)}</span></div>
            {discount > 0 && <div style={styles.row}><span>Discount</span><span style={{ color: '#10b981' }}>-${discount.toFixed(2)}</span></div>}
            <div style={styles.row}><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping}`}</span></div>
            <div style={{ ...styles.row, fontWeight: 700, fontSize: 18, marginTop: 8 }}><span>Total</span><span>${finalTotal.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  grid: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, alignItems: 'start' },
  section: { background: '#fff', borderRadius: 10, padding: 24, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  sectionTitle: { fontSize: 17, fontWeight: 700, marginBottom: 16 },
  cardElement: { padding: 14, border: '1.5px solid #e2e8f0', borderRadius: 8, background: '#f8fafc' },
  summary: { background: '#fff', borderRadius: 10, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', position: 'sticky', top: 80 },
  summaryItem: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 },
  summaryImg: { width: 50, height: 50, objectFit: 'cover', borderRadius: 6 },
  couponRow: { display: 'flex', gap: 8, marginTop: 16 },
  couponInput: { flex: 1, padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14 },
  row: { display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 15 },
};
