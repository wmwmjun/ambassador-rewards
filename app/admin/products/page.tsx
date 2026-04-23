'use client';
import { useState } from 'react';
import Icon from '@/app/components/Icon';
import { ADMIN_PRODUCTS, type AdminProduct } from '@/lib/admin-mock';

const fmt = (n: number) => n.toLocaleString('en-IN');

const CATEGORIES = ['Shopping', 'Entertainment', 'Food', 'Travel'];

const BLANK: Omit<AdminProduct, 'id'> = { name: '', brand: '', category: 'Shopping', minPts: 0, maxPts: 0, active: true, sortOrder: 99 };

export default function ProductsPage() {
  const [products, setProducts] = useState(ADMIN_PRODUCTS);
  const [modal, setModal]       = useState<AdminProduct | 'new' | null>(null);
  const [form, setForm]         = useState<Omit<AdminProduct, 'id'>>(BLANK);
  const [filterCat, setFilterCat] = useState('all');

  const visible = products.filter(p => filterCat === 'all' || p.category === filterCat)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const openNew = () => { setForm(BLANK); setModal('new'); };
  const openEdit = (p: AdminProduct) => { setForm({ name: p.name, brand: p.brand, category: p.category, minPts: p.minPts, maxPts: p.maxPts, active: p.active, sortOrder: p.sortOrder }); setModal(p); };

  const save = () => {
    if (modal === 'new') {
      const id = `P${String(products.length + 1).padStart(3, '0')}`;
      setProducts(prev => [...prev, { ...form, id }]);
    } else if (modal) {
      setProducts(prev => prev.map(p => p.id === (modal as AdminProduct).id ? { ...p, ...form } : p));
    }
    setModal(null);
  };

  const toggleActive = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const f = (k: keyof typeof form, v: unknown) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div className="admin-page-title">Products</div>
        <div className="admin-page-sub">Manage the gift card catalog available for redemption</div>
      </div>

      <div className="admin-stats" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 20 }}>
        <div className="admin-stat-card"><div className="admin-stat-label">Total products</div><div className="admin-stat-value">{products.length}</div></div>
        <div className="admin-stat-card"><div className="admin-stat-label">Active</div><div className="admin-stat-value admin-stat-accent">{products.filter(p => p.active).length}</div></div>
        <div className="admin-stat-card"><div className="admin-stat-label">Inactive</div><div className="admin-stat-value" style={{ color: '#C0281E' }}>{products.filter(p => !p.active).length}</div></div>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <span className="admin-table-title">Catalog</span>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="filter-tabs">
              <button className={`filter-tab${filterCat === 'all' ? ' active' : ''}`} onClick={() => setFilterCat('all')}>All</button>
              {CATEGORIES.map(c => (
                <button key={c} className={`filter-tab${filterCat === c ? ' active' : ''}`} onClick={() => setFilterCat(c)}>{c}</button>
              ))}
            </div>
            <button className="btn btn-primary btn-sm" onClick={openNew}>
              <Icon name="plus" size={13} color="white" /> Add Product
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14, padding: '16px 20px' }}>
          {visible.map(p => (
            <div key={p.id} style={{ background: p.active ? 'white' : '#FAFAFE', border: `1px solid ${p.active ? '#E8E6F8' : '#E0DEFF'}`, borderRadius: 14, padding: '16px 18px', opacity: p.active ? 1 : 0.7 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#A29AFF22,#E66BFF22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="gift" size={18} color="#7B72E8" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1A1740' }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: '#A8A5C8' }}>{p.brand} · {p.category}</div>
                  </div>
                </div>
                <span className={`badge ${p.active ? 's-active' : 's-suspended'}`}>{p.active ? 'Active' : 'Off'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 10.5, color: '#A8A5C8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Min pts</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700, color: '#1A1740', marginTop: 2 }}>{fmt(p.minPts)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10.5, color: '#A8A5C8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Max pts</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700, color: '#1A1740', marginTop: 2 }}>{fmt(p.maxPts)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10.5, color: '#A8A5C8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sort</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1740', marginTop: 2 }}>#{p.sortOrder}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => openEdit(p)}>
                  <Icon name="edit" size={13} color="#6B6880" /> Edit
                </button>
                <button
                  className={`btn btn-sm ${p.active ? 'btn-reject' : 'btn-approve'}`}
                  style={{ flex: 1 }}
                  onClick={() => toggleActive(p.id)}
                >
                  {p.active ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal !== null && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div className="admin-modal-title">{modal === 'new' ? 'Add Product' : 'Edit Product'}</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}><Icon name="x" size={14} color="#6B6880" /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="admin-label">Product Name</label>
                <input className="admin-input" value={form.name} onChange={e => f('name', e.target.value)} placeholder="e.g. Amazon Gift Card" />
              </div>
              <div>
                <label className="admin-label">Brand</label>
                <input className="admin-input" value={form.brand} onChange={e => f('brand', e.target.value)} placeholder="e.g. Amazon" />
              </div>
              <div>
                <label className="admin-label">Category</label>
                <select className="admin-input" value={form.category} onChange={e => f('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-label">Min Points</label>
                <input className="admin-input" type="number" min="0" value={form.minPts || ''} onChange={e => f('minPts', Number(e.target.value))} style={{ fontFamily: 'JetBrains Mono, monospace' }} />
              </div>
              <div>
                <label className="admin-label">Max Points</label>
                <input className="admin-input" type="number" min="0" value={form.maxPts || ''} onChange={e => f('maxPts', Number(e.target.value))} style={{ fontFamily: 'JetBrains Mono, monospace' }} />
              </div>
              <div>
                <label className="admin-label">Sort Order</label>
                <input className="admin-input" type="number" min="1" value={form.sortOrder || ''} onChange={e => f('sortOrder', Number(e.target.value))} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                <input type="checkbox" id="active-toggle" checked={form.active} onChange={e => f('active', e.target.checked)} style={{ width: 16, height: 16, accentColor: '#7B72E8', cursor: 'pointer' }} />
                <label htmlFor="active-toggle" style={{ fontSize: 13, fontWeight: 600, color: '#1A1740', cursor: 'pointer' }}>Active (visible to ambassadors)</label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={save} disabled={!form.name || !form.brand}>
                <Icon name="check" size={15} color="white" /> {modal === 'new' ? 'Add Product' : 'Save Changes'}
              </button>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
