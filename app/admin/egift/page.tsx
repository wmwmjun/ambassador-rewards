'use client';
import { useState } from 'react';
import Icon from '@/app/components/Icon';
import { EGIFT_REQUESTS, type EGiftRequest } from '@/lib/admin-mock';

const fmt = (n: number) => n.toLocaleString('en-IN');
type Filter = 'all' | 'pending' | 'approved' | 'rejected' | 'completed';

function statusClass(s: string) {
  if (s === 'pending')   return 's-pending';
  if (s === 'approved')  return 's-active';
  if (s === 'rejected')  return 's-suspended';
  if (s === 'completed') return 's-active';
  return '';
}

function genCode(brand: string) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const seg = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${brand.slice(0, 3).toUpperCase()}-${seg(4)}-${seg(4)}`;
}

export default function EGiftPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [query,  setQuery]  = useState('');
  const [items,  setItems]  = useState(EGIFT_REQUESTS);
  const [detail, setDetail] = useState<EGiftRequest | null>(null);
  const [codeInput, setCodeInput] = useState('');

  const visible = items.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false;
    const q = query.toLowerCase();
    return !q || `${r.userName} ${r.brand} ${r.id}`.toLowerCase().includes(q);
  });

  const approve = (id: string, code: string) => {
    setItems(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' as const, giftCode: code } : r));
    setDetail(d => d?.id === id ? { ...d, status: 'approved' as const, giftCode: code } : d);
  };

  const reject = (id: string) => {
    setItems(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r));
    setDetail(d => d?.id === id ? { ...d, status: 'rejected' as const } : d);
  };

  const pending   = items.filter(r => r.status === 'pending').length;
  const approved  = items.filter(r => r.status === 'approved' || r.status === ('completed' as any)).length;
  const rejected  = items.filter(r => r.status === 'rejected').length;

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div className="admin-page-title">eGift Requests</div>
        <div className="admin-page-sub">Review and process ambassador gift card redemptions</div>
      </div>

      <div className="admin-stats" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 20 }}>
        <div className="admin-stat-card"><div className="admin-stat-label">Pending</div><div className="admin-stat-value" style={{ color: '#A830C4' }}>{pending}</div></div>
        <div className="admin-stat-card"><div className="admin-stat-label">Approved / Completed</div><div className="admin-stat-value admin-stat-accent">{approved}</div></div>
        <div className="admin-stat-card"><div className="admin-stat-label">Rejected</div><div className="admin-stat-value" style={{ color: '#C0281E' }}>{rejected}</div></div>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <span className="admin-table-title">All requests</span>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="admin-search">
              <Icon name="search" size={14} color="#A8A5C8" />
              <input placeholder="Search user, brand…" value={query} onChange={e => setQuery(e.target.value)} />
            </div>
            <div className="filter-tabs">
              {(['all','pending','approved','rejected','completed'] as Filter[]).map(f => (
                <button key={f} className={`filter-tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr><th>#</th><th>Ambassador</th><th>Brand</th><th>Amount</th><th>Points</th><th>Status</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {visible.map(r => (
              <tr key={r.id}>
                <td style={{ color: '#A8A5C8', fontSize: 12 }}>{r.id}</td>
                <td style={{ fontWeight: 600 }}>{r.userName}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: '#F5F4FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="gift" size={14} color="#7B72E8" />
                    </div>
                    {r.brand}
                  </div>
                </td>
                <td style={{ fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>₹{fmt(r.amount)}</td>
                <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>{fmt(r.points)} pts</td>
                <td><span className={`badge ${statusClass(r.status)}`}>{r.status}</span></td>
                <td style={{ color: '#A8A5C8', fontSize: 12 }}>{r.date}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => { setDetail(r); setCodeInput(r.giftCode || genCode(r.brand)); }}>
                      <Icon name="eye" size={13} color="#6B6880" /> View
                    </button>
                    {r.status === 'pending' && (
                      <>
                        <button className="btn btn-approve btn-sm" onClick={() => approve(r.id, genCode(r.brand))}>Approve</button>
                        <button className="btn btn-reject btn-sm" onClick={() => reject(r.id)}>Reject</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: '#A8A5C8', padding: '32px 0' }}>No results found</td></tr>
            )}
          </tbody>
        </table>
        <div className="admin-pagination"><span>Showing {visible.length} of {items.length} requests</span></div>
      </div>

      {detail && (
        <div className="admin-modal-overlay" onClick={() => setDetail(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div className="admin-modal-title">Request — {detail.id}</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setDetail(null)}><Icon name="x" size={14} color="#6B6880" /></button>
            </div>

            <div style={{ background: '#FAFAFE', border: '1px solid #E8E6F8', borderRadius: 12, overflow: 'hidden', marginBottom: 18 }}>
              {[
                { l: 'Ambassador', v: detail.userName },
                { l: 'Brand',      v: detail.brand },
                { l: 'Amount',     v: `₹${fmt(detail.amount)}` },
                { l: 'Points',     v: `${fmt(detail.points)} pts` },
                { l: 'Status',     v: detail.status },
                { l: 'Date',       v: detail.date },
              ].map((r, i) => (
                <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderTop: i > 0 ? '1px solid #F5F4FF' : 'none' }}>
                  <span style={{ fontSize: 12, color: '#A8A5C8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{r.l}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: '#1A1740' }}>{r.v}</span>
                </div>
              ))}
            </div>

            {(detail.status === 'pending' || detail.status === 'approved') && (
              <div style={{ marginBottom: 16 }}>
                <label className="admin-label">Gift Code</label>
                <input
                  className="admin-input"
                  value={codeInput}
                  onChange={e => setCodeInput(e.target.value.toUpperCase())}
                  style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em' }}
                  readOnly={detail.status === 'approved'}
                />
              </div>
            )}

            {detail.status === 'approved' && detail.giftCode && (
              <div style={{ background: '#EDFFF4', border: '1px solid #A0E4B8', borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="check" size={15} color="#1A8C3C" />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1A8C3C' }}>Code issued: </span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#1A8C3C' }}>{detail.giftCode}</span>
              </div>
            )}

            {detail.status === 'pending' && (
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-approve" style={{ flex: 1 }} onClick={() => approve(detail.id, codeInput)}>
                  <Icon name="check" size={15} color="#1A8C3C" /> Approve & Send Code
                </button>
                <button className="btn btn-reject" style={{ flex: 1 }} onClick={() => reject(detail.id)}>
                  <Icon name="x" size={15} color="#C0281E" /> Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
