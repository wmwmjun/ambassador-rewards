'use client';
import { useState } from 'react';
import Icon from '@/app/components/Icon';
import { TRANSFER_REQUESTS, ADMIN_STATS } from '@/lib/admin-mock';

const fmt = (n: number) => n.toLocaleString('en-IN');
type Filter = 'all' | 'transferred' | 'failed';

export default function TransfersPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [query,  setQuery]  = useState('');

  const visible = TRANSFER_REQUESTS.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false;
    const q = query.toLowerCase();
    return !q || `${r.userName} ${r.bankName} ${r.id} ${r.ifsc}`.toLowerCase().includes(q);
  });

  const totalTransferred = TRANSFER_REQUESTS
    .filter(r => r.status === 'transferred')
    .reduce((s, r) => s + r.amount, 0);

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div className="admin-page-title">Bank Transfers</div>
        <div className="admin-page-sub">
          Transfer requests are processed automatically — points are deducted and funds disbursed via the pre-funded wallet
        </div>
      </div>

      {/* Wallet + stats */}
      <div className="admin-stats" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 20 }}>
        <div className="admin-stat-card" style={{ borderColor: '#A29AFF' }}>
          <div className="admin-stat-label">Wallet balance</div>
          <div className="admin-stat-value admin-stat-accent">₹{fmt(ADMIN_STATS.walletBankTransfer)}</div>
          <div style={{ fontSize: 11, color: '#A8A5C8', marginTop: 4 }}>Pre-funded · auto-disbursed</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total disbursed</div>
          <div className="admin-stat-value">₹{fmt(totalTransferred)}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Transferred</div>
          <div className="admin-stat-value" style={{ color: '#1A8C3C' }}>
            {TRANSFER_REQUESTS.filter(r => r.status === 'transferred').length}
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Failed</div>
          <div className="admin-stat-value" style={{ color: '#C0281E' }}>
            {TRANSFER_REQUESTS.filter(r => r.status === 'failed').length}
          </div>
        </div>
      </div>

      <div style={{ background: '#FFF8E6', border: '1px solid #FFE0A0', borderRadius: 10, padding: '10px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="alert" size={15} color="#B07800" />
        <span style={{ fontSize: 13, color: '#7A5200', fontWeight: 500 }}>
          Transfers are initiated automatically upon request. Points are deducted instantly — no manual approval required.
          Failed transfers trigger automatic point refunds.
        </span>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <span className="admin-table-title">Transaction log</span>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="admin-search">
              <Icon name="search" size={14} color="#A8A5C8" />
              <input placeholder="Search name, bank, IFSC…" value={query} onChange={e => setQuery(e.target.value)} />
            </div>
            <div className="filter-tabs">
              {(['all', 'transferred', 'failed'] as Filter[]).map(f => (
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
              <th>#</th><th>Ambassador</th><th>Bank</th><th>Account</th><th>IFSC</th><th>Amount</th><th>Points deducted</th><th>Status</th><th>Date</th>
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
                <td style={{ color: '#6B6880' }}>{r.bankName}</td>
                <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{r.account}</td>
                <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#6B6880' }}>{r.ifsc}</td>
                <td style={{ fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>
                  ₹{fmt(r.amount)}
                </td>
                <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#C0281E' }}>
                  −{fmt(r.amount)} pts
                </td>
                <td>
                  <span className={`badge ${r.status === 'transferred' ? 's-active' : 's-suspended'}`}>
                    {r.status}
                  </span>
                </td>
                <td style={{ color: '#A8A5C8', fontSize: 12 }}>{r.date}</td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={9} style={{ textAlign: 'center', color: '#A8A5C8', padding: '32px 0' }}>No results found</td></tr>
            )}
          </tbody>
        </table>
        <div className="admin-pagination">
          <span>Showing {visible.length} of {TRANSFER_REQUESTS.length} transactions</span>
        </div>
      </div>
    </div>
  );
}
