import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const statusColors = { pending: 'badge-warning', processing: 'badge-info', shipped: 'badge-info', delivered: 'badge-success', cancelled: 'badge-danger' };

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setData(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  const stats = [
    { label: 'Total Orders', value: data?.totalOrders, icon: '📦', color: '#3b82f6' },
    { label: 'Revenue', value: `$${parseFloat(data?.totalRevenue || 0).toFixed(2)}`, icon: '💰', color: '#10b981' },
    { label: 'Customers', value: data?.totalUsers, icon: '👥', color: '#f59e0b' },
    { label: 'Products', value: data?.totalProducts, icon: '🏷️', color: '#8b5cf6' },
  ];

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 className="page-title" style={{ margin: 0 }}>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/admin/products" className="btn btn-primary">Manage Products</Link>
          <Link to="/admin/orders" className="btn btn-outline">View Orders</Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 40 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#64748b', fontSize: 13, marginBottom: 6 }}>{s.label}</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</p>
              </div>
              <span style={{ fontSize: 36 }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, fontSize: 17 }}>Recent Orders</h3>
          <Link to="/admin/orders" style={{ color: '#3b82f6', fontSize: 14, fontWeight: 600 }}>View all</Link>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
              {['Order ID', 'Customer', 'Total', 'Status', 'Date'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: 13, color: '#64748b', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.recentOrders?.map(o => (
              <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px' }}>#{o.id}</td>
                <td style={{ padding: '12px' }}>{o.user_name}</td>
                <td style={{ padding: '12px', fontWeight: 600 }}>${parseFloat(o.total).toFixed(2)}</td>
                <td style={{ padding: '12px' }}><span className={`badge ${statusColors[o.status]}`}>{o.status}</span></td>
                <td style={{ padding: '12px', color: '#64748b', fontSize: 14 }}>{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
