import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
const statusColors = { pending: 'badge-warning', processing: 'badge-info', shipped: 'badge-info', delivered: 'badge-success', cancelled: 'badge-danger' };

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner" />;
  if (!order) return <div className="empty-state"><h3>Order not found</h3></div>;

  const addr = typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address;
  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="page-title" style={{ margin: 0 }}>Order #{order.id}</h1>
        <span className={`badge ${statusColors[order.status]}`} style={{ fontSize: 14 }}>{order.status}</span>
      </div>

      {/* Progress tracker */}
      {order.status !== 'cancelled' && (
        <div style={styles.tracker}>
          {statusSteps.map((step, i) => (
            <div key={step} style={styles.step}>
              <div style={{ ...styles.dot, background: i <= currentStep ? '#3b82f6' : '#e2e8f0', color: i <= currentStep ? '#fff' : '#94a3b8' }}>{i + 1}</div>
              <span style={{ fontSize: 13, fontWeight: i <= currentStep ? 600 : 400, color: i <= currentStep ? '#0f172a' : '#94a3b8', textTransform: 'capitalize' }}>{step}</span>
              {i < statusSteps.length - 1 && <div style={{ ...styles.line, background: i < currentStep ? '#3b82f6' : '#e2e8f0' }} />}
            </div>
          ))}
        </div>
      )}

      <div style={styles.grid}>
        <div>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Items</h3>
            {order.items?.map(item => (
              <div key={item.id} style={styles.item}>
                <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} style={styles.img} />
                <div style={{ flex: 1 }}>
                  <Link to={`/products/${item.product_id}`} style={{ fontWeight: 600 }}>{item.name}</Link>
                  <p style={{ color: '#64748b', fontSize: 14 }}>Qty: {item.quantity}</p>
                </div>
                <span style={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Shipping Address</h3>
            <p>{addr?.name}</p>
            <p style={{ color: '#64748b' }}>{addr?.street}, {addr?.city}, {addr?.state} {addr?.zip}</p>
            <p style={{ color: '#64748b' }}>{addr?.country}</p>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Payment Summary</h3>
            <div style={styles.row}><span>Subtotal</span><span>${(parseFloat(order.total) + parseFloat(order.discount || 0)).toFixed(2)}</span></div>
            {order.discount > 0 && <div style={styles.row}><span>Discount</span><span style={{ color: '#10b981' }}>-${parseFloat(order.discount).toFixed(2)}</span></div>}
            <div style={{ ...styles.row, fontWeight: 700, borderTop: '1px solid #e2e8f0', paddingTop: 10, marginTop: 6 }}><span>Total</span><span>${parseFloat(order.total).toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  tracker: { display: 'flex', alignItems: 'center', marginBottom: 40, background: '#fff', borderRadius: 10, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  step: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative', flex: 1 },
  dot: { width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 },
  line: { position: 'absolute', top: 16, left: '50%', width: '100%', height: 2, zIndex: -1 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' },
  section: { background: '#fff', borderRadius: 10, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  sectionTitle: { fontWeight: 700, marginBottom: 14, fontSize: 16 },
  item: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 },
  img: { width: 60, height: 60, objectFit: 'cover', borderRadius: 8 },
  row: { display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 15 },
};
