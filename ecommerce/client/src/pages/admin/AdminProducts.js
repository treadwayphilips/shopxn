import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const empty = { name: '', description: '', price: '', compare_price: '', category_id: '', stock: '', image: '', featured: false };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () => {
    Promise.all([api.get('/admin/products'), api.get('/products/categories')])
      .then(([p, c]) => { setProducts(p.data); setCategories(c.data); })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`/admin/products/${editId}`, form);
      else await api.post('/admin/products', form);
      toast.success(editId ? 'Product updated' : 'Product created');
      setForm(empty); setEditId(null); setShowForm(false);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleEdit = (p) => { setForm({ name: p.name, description: p.description, price: p.price, compare_price: p.compare_price || '', category_id: p.category_id, stock: p.stock, image: p.image || '', featured: p.featured }); setEditId(p.id); setShowForm(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/admin/products/${id}`);
    toast.success('Deleted'); load();
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="page-title" style={{ margin: 0 }}>Products</h1>
        <button onClick={() => { setForm(empty); setEditId(null); setShowForm(!showForm); }} className="btn btn-primary">
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.formCard}>
          <h3 style={{ marginBottom: 20, fontWeight: 700 }}>{editId ? 'Edit Product' : 'New Product'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group"><label>Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
            <div className="form-group"><label>Category</label>
              <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} required>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Price ($)</label><input type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required /></div>
            <div className="form-group"><label>Compare Price ($)</label><input type="number" step="0.01" value={form.compare_price} onChange={e => setForm({...form, compare_price: e.target.value})} /></div>
            <div className="form-group"><label>Stock</label><input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required /></div>
            <div className="form-group"><label>Image URL</label><input value={form.image} onChange={e => setForm({...form, image: e.target.value})} /></div>
          </div>
          <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 15 }} /></div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 20 }}>
            <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} /> Featured product
          </label>
          <button type="submit" className="btn btn-primary">{editId ? 'Update Product' : 'Create Product'}</button>
        </form>
      )}

      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Image', 'Name', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 13, color: '#64748b', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px' }}><img src={p.image || 'https://via.placeholder.com/48'} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} /></td>
                <td style={{ padding: '12px 16px', fontWeight: 600, maxWidth: 200 }}>{p.name}</td>
                <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 14 }}>{p.category_name}</td>
                <td style={{ padding: '12px 16px' }}>${p.price}</td>
                <td style={{ padding: '12px 16px' }}><span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-danger'}`}>{p.stock}</span></td>
                <td style={{ padding: '12px 16px' }}>{p.featured ? '⭐' : '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => handleEdit(p)} className="btn btn-outline btn-sm" style={{ marginRight: 8 }}>Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="btn btn-danger btn-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  formCard: { background: '#fff', borderRadius: 12, padding: 28, marginBottom: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
};
