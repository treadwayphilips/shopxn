import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const page = searchParams.get('page') || 1;
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, ...(category && { category }), ...(search && { search }), ...(sort && { sort }), ...(minPrice && { minPrice }), ...(maxPrice && { maxPrice }) });
    api.get(`/products?${params}`).then(({ data }) => {
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    }).finally(() => setLoading(false));
  }, [page, category, search, sort, minPrice, maxPrice]);

  useEffect(() => {
    api.get('/products/categories').then(({ data }) => setCategories(data));
  }, []);

  const updateFilter = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  return (
    <div className="container" style={{ padding: '40px 20px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32, alignItems: 'start' }}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h3 style={styles.filterTitle}>Filters</h3>

        <div style={styles.filterSection}>
          <label style={styles.filterLabel}>Category</label>
          <select value={category} onChange={e => updateFilter('category', e.target.value)} style={styles.select}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
        </div>

        <div style={styles.filterSection}>
          <label style={styles.filterLabel}>Price Range</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="number" placeholder="Min" value={minPrice} onChange={e => updateFilter('minPrice', e.target.value)} style={styles.priceInput} />
            <input type="number" placeholder="Max" value={maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)} style={styles.priceInput} />
          </div>
        </div>

        <div style={styles.filterSection}>
          <label style={styles.filterLabel}>Sort By</label>
          <select value={sort} onChange={e => updateFilter('sort', e.target.value)} style={styles.select}>
            <option value="">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Best Rated</option>
          </select>
        </div>

        <button onClick={() => setSearchParams({})} className="btn btn-outline" style={{ width: '100%' }}>Clear Filters</button>
      </aside>

      {/* Products */}
      <div>
        <div style={styles.topBar}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>
            {search ? `Results for "${search}"` : category ? categories.find(c => c.slug === category)?.name || 'Products' : 'All Products'}
            <span style={{ color: '#64748b', fontWeight: 400, fontSize: 15, marginLeft: 8 }}>({total})</span>
          </h2>
        </div>

        {loading ? <div className="spinner" /> : products.length ? (
          <div className="grid-4">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="empty-state"><h3>No products found</h3><p>Try different filters</p></div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div style={styles.pagination}>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => updateFilter('page', p)} style={{ ...styles.pageBtn, ...(parseInt(page) === p ? styles.pageBtnActive : {}) }}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  sidebar: { background: '#fff', borderRadius: 10, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', position: 'sticky', top: 80 },
  filterTitle: { fontSize: 18, fontWeight: 700, marginBottom: 20 },
  filterSection: { marginBottom: 20 },
  filterLabel: { display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 8, color: '#475569' },
  select: { width: '100%', padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14 },
  priceInput: { width: '50%', padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14 },
  topBar: { marginBottom: 20 },
  pagination: { display: 'flex', gap: 8, justifyContent: 'center', marginTop: 40 },
  pageBtn: { padding: '8px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', background: '#fff', fontSize: 14 },
  pageBtnActive: { background: '#3b82f6', color: '#fff', borderColor: '#3b82f6' },
};
