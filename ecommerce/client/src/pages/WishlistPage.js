import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cart/wishlist').then(({ data }) => setItems(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 className="page-title">My Wishlist</h1>
      {!items.length ? (
        <div className="empty-state">
          <div style={{ fontSize: 64 }}>❤️</div>
          <h3>Your wishlist is empty</h3>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Products</Link>
        </div>
      ) : (
        <div className="grid-4">
          {items.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
