import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const statusColors = { pending: 'badge-warning', processing: 'badge-info', shipped: 'badge-info', delivered: 'badge-success', cancelled: 'badge-danger' };
const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/admin/orders').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  useEffect(load, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      toast.success('Status updated');
      load();
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 className="page-title">All Orders</h1>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['ID', 'Customer', 'Email', 'Total', 'Status', 'Date', 'Update Status'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 13, color: '#64748b', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontWeight: 700 }}>#{o.id}</td>
                <td style={{ padding: '12px 16px' }}>{o.user_name}</td>
                <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13 }}>{o.email}</td>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>${parseFloat(o.total).toFixed(2)}</td>
                <td style={{ padding: '12px 16px' }}><span className={`badge ${statusColors[o.status]}`}>{o.status}</span></td>
                <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13 }}>{new Date(o.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '12px 16px' }}>
                  <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} style={{ padding: '6px 10px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 13 }}>
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
