import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/profile').then(({ data }) => { setProfile(data); setName(data.name); }).finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', { name });
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: 600 }}>
      <h1 className="page-title">My Profile</h1>
      <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#fff', fontWeight: 700 }}>
            {profile?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>{profile?.name}</h2>
            <p style={{ color: '#64748b' }}>{profile?.email}</p>
            <span className="badge badge-info" style={{ marginTop: 4 }}>{profile?.role}</span>
          </div>
        </div>
        <form onSubmit={handleUpdate}>
          <div className="form-group"><label>Full Name</label><input value={name} onChange={e => setName(e.target.value)} required /></div>
          <div className="form-group"><label>Email</label><input value={profile?.email} disabled style={{ background: '#f8fafc', cursor: 'not-allowed' }} /></div>
          <div className="form-group"><label>Member Since</label><input value={new Date(profile?.created_at).toLocaleDateString()} disabled style={{ background: '#f8fafc' }} /></div>
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
