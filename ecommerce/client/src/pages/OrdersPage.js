import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const statusColors = { pending: 'badge-warning', processing: 'badge-info', shipped: 'badge-info', delivered: 'badge-success', cancelled: 'badge-danger' };

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 className="page-title">My Orders</h1>
      {!orders.length ? (
        <div className="empty-state"><div style={{ fontSize: 64 }}>📦</div><h3>No orders yet</h3><Link to="/products" className="btn btn-primary" style={{ marginTop: 16 }}>Start Shopping</Link></div>
      ) : orders.map(order => (
        <Link to={`/orders/${order.id}`} key={order.id} style={styles.card}>
          <div style={styles.top}>
            <span style={{ fontWeight: 700 }}>Order #{order.id}</span>
            <span className={`badge ${statusColors[order.status]}`}>{order.status}</span>
          </div>
          <div style={styles.meta}>
            <span style={{ color: '#64748b', fontSize: 14 }}>{new Date(order.created_at).toLocaleDateString()}</span>
            <span style={{ fontWeight: 700, fontSize: 18 }}>${parseFloat(order.total).toFixed(2)}</span>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            {order.items?.slice(0, 3).map(item => (
              <img key={item.id} src={item.image || 'https://via.placeholder.com/50'} alt={item.name} style={styles.itemImg} />
            ))}
            {order.items?.length > 3 && <div style={styles.moreItems}>+{order.items.length - 3}</div>}
          </div>
        </Link>
      ))}
    </div>
  );
}

const styles = {
  card: { display: 'block', background: '#fff', borderRadius: 10, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1.5px solid transparent', transition: 'border-color 0.2s' },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  meta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  itemImg: { width: 50, height: 50, objectFit: 'cover', borderRadius: 6 },
  moreItems: { width: 50, height: 50, background: '#f1f5f9', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#64748b', fontWeight: 600 },
};
