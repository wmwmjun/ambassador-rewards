'use client';
import { useState } from 'react';
import Icon from '@/app/components/Icon';
import { EGIFT_REQUESTS, ADMIN_STATS } from '@/lib/admin-mock';

const fmt = (n: number) => n.toLocaleString('en-IN');
type Filter = 'all' | 'completed' | 'failed';

export default function EGiftPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [query,  setQuery]  = useState('');

  const visible = EGIFT_REQUESTS.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false;
    const q = query.toLowerCase();
    return !q || `${r.userName} ${r.brand} ${r.id}`.toLowerCase().includes(q);
  });

  const totalDeducted = EGIFT_REQUESTS
    .filter(r => r.status === 'completed')
    .reduce((s, r) => s + r.amount, 0);

  const [copied, setCopied] = useState<string | null>(null);
  const copy = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div className="admin-page-title">eGift Transactions</div>
        <div className="admin-page-sub">
          Gift card redemptions are processed automatically — points are deducted from the pre-funded wallet
        </div>
      </div>

      {/* Wallet + stats */}
      <div className="admin-stats" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 20 }}>
        <div className="admin-stat-card" style={{ borderColor: '#A29AFF' }}>
          <div className="admin-stat-label">Wallet balance</div>
          <div className="admin-stat-value admin-stat-accent">₹{fmt(ADMIN_STATS.walletGiftCard)}</div>
          <div style={{ fontSize: 11, color: '#A8A5C8', marginTop: 4 }}>Pre-funded · auto-deducted</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total deducted</div>
          <div className="admin-stat-value">₹{fmt(totalDeducted)}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Completed</div>
          <div className="admin-stat-value" style={{ color: '#1A8C3C' }}>
            {EGIFT_REQUESTS.filter(r => r.status === 'completed').length}
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Failed</div>
          <div className="admin-stat-value" style={{ color: '#C0281E' }}>
            {EGIFT_REQUESTS.filter(r => r.status === 'failed').length}
          </div>
        </div>
      </div>

      <div style={{ background: '#FFF8E6', border: '1px solid #FFE0A0', borderRadius: 10, padding: '10px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="alert" size={15} color="#B07800" />
        <span style={{ fontSize: 13, color: '#7A5200', fontWeight: 500 }}>
          Gift card codes are issued automatically via partner API. Points are deducted instantly on request — no manual approval required.
        </span>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <span className="admin-table-title">Transaction log</span>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="admin-search">
              <Icon name="search" size={14} color="#A8A5C8" />
              <input placeholder="Search user, brand…" value={query} onChange={e => setQuery(e.target.value)} />
            </div>
            <div className="filter-tabs">
              {(['all', 'completed', 'failed'] as Filter[]).map(f => (
                <button key={f} className={`filter-tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th><th>Ambassador</th><th>Brand</th><th>Amount</th><th>Points deducted</th><th>Status</th><th>Gift Code</th><th>Date</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(r => (
              <tr key={r.id}>
                <td style={{ color: '#A8A5C8', fontSize: 12 }}>{r.id}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{r.userName}</div>
                  <div style={{ fontSize: 11.5, color: '#A8A5C8' }}>{r.userId}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: '#F5F4FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="gift" size={14} color="#7B72E8" />
                    </div>
                    {r.brand}
                  </div>
                </td>
                <td style={{ fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>
                  ₹{fmt(r.amount)}
                </td>
                <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#C0281E' }}>
                  −{fmt(r.points)} pts
                </td>
                <td>
                  <span className={`badge ${r.status === 'completed' ? 's-active' : 's-suspended'}`}>
                    {r.status}
                  </span>
                </td>
                <td>
                  {r.giftCode ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <code style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#1A1740' }}>{r.giftCode}</code>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '2px 6px', minWidth: 0 }}
                        onClick={() => copy(r.giftCode!)}
                      >
                        <Icon name={copied === r.giftCode ? 'check' : 'copy'} size={12} color={copied === r.giftCode ? '#1A8C3C' : '#A8A5C8'} />
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: '#A8A5C8', fontSize: 12 }}>—</span>
                  )}
                </td>
                <td style={{ color: '#A8A5C8', fontSize: 12 }}>{r.date}</td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: '#A8A5C8', padding: '32px 0' }}>No results found</td></tr>
            )}
          </tbody>
        </table>
        <div className="admin-pagination">
          <span>Showing {visible.length} of {EGIFT_REQUESTS.length} transactions</span>
        </div>
      </div>
    </div>
  );
}
