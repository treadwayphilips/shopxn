// LoginPage.js
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={authStyles.page}>
      <div style={authStyles.card}>
        <h1 style={authStyles.title}>Welcome back</h1>
        <p style={authStyles.sub}>Sign in to your account</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
          <div className="form-group"><label>Password</label><input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /></div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, color: '#64748b' }}>Don't have an account? <Link to="/register" style={{ color: '#3b82f6' }}>Register</Link></p>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={authStyles.page}>
      <div style={authStyles.card}>
        <h1 style={authStyles.title}>Create Account</h1>
        <p style={authStyles.sub}>Join us today</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Full Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
          <div className="form-group"><label>Password (min 6 chars)</label><input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} minLength={6} required /></div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, color: '#64748b' }}>Already have an account? <Link to="/login" style={{ color: '#3b82f6' }}>Sign In</Link></p>
      </div>
    </div>
  );
}

const authStyles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { background: '#fff', borderRadius: 12, padding: 40, width: '100%', maxWidth: 420, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' },
  title: { fontSize: 26, fontWeight: 800, marginBottom: 6 },
  sub: { color: '#64748b', marginBottom: 28 },
};
