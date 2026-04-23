'use client';
import { useState } from 'react';
import Icon from '@/app/components/Icon';
import { TRANSFER_REQUESTS, type TransferRequest } from '@/lib/admin-mock';

const fmt = (n: number) => n.toLocaleString('en-IN');
type Filter = 'all' | 'pending' | 'approved' | 'transferred' | 'rejected';

function statusClass(s: string) {
  if (s === 'pending')     return 's-pending';
  if (s === 'approved')    return 's-active';
  if (s === 'transferred') return 's-active';
  if (s === 'rejected')    return 's-suspended';
  return '';
}

export default function TransfersPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [query,  setQuery]  = useState('');
  const [items,  setItems]  = useState(TRANSFER_REQUESTS);
  const [detail, setDetail] = useState<TransferRequest | null>(null);

  const visible = items.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false;
    const q = query.toLowerCase();
    return !q || `${r.userName} ${r.bankName} ${r.id} ${r.ifsc}`.toLowerCase().includes(q);
  });

  const update = (id: string, status: TransferRequest['status']) => {
    setItems(prev => prev.map(r => r.id === id ? { ...r, status, approvedBy: status !== 'rejected' ? 'Ayesha Khan' : undefined } : r));
    setDetail(d => d?.id === id ? { ...d, status, approvedBy: status !== 'rejected' ? 'Ayesha Khan' : undefined } : d);
  };

  const pending     = items.filter(r => r.status === 'pending').length;
  const approved    = items.filter(r => r.status === 'approved').length;
  const transferred = items.filter(r => r.status === 'transferred').length;
  const rejected    = items.filter(r => r.status === 'rejected').length;

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div className="admin-page-title">Bank Transfers</div>
        <div className="admin-page-sub">Approve and track ambassador bank transfer requests</div>
      </div>

      <div className="admin-stats" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 20 }}>
        <div className="admin-stat-card"><div className="admin-stat-label">Pending</div><div className="admin-stat-value" style={{ color: '#1A6FC5' }}>{pending}</div></div>
        <div className="admin-stat-card"><div className="admin-stat-label">Approved</div><div className="admin-stat-value admin-stat-accent">{approved}</div></div>
        <div className="admin-stat-card"><div className="admin-stat-label">Transferred</div><div className="admin-stat-value" style={{ color: '#1A8C3C' }}>{transferred}</div></div>
        <div className="admin-stat-card"><div className="admin-stat-label">Rejected</div><div className="admin-stat-value" style={{ color: '#C0281E' }}>{rejected}</div></div>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <span className="admin-table-title">All transfer requests</span>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="admin-search">
              <Icon name="search" size={14} color="#A8A5C8" />
              <input placeholder="Search name, bank, IFSC…" value={query} onChange={e => setQuery(e.target.value)} />
            </div>
            <div className="filter-tabs">
              {(['all','pending','approved','transferred','rejected'] as Filter[]).map(f => (
                <button key={f} className={`filter-tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr><th>#</th><th>Ambassador</th><th>Bank</th><th>Account</th><th>IFSC</th><th>Amount</th><th>Status</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {visible.map(r => (
              <tr key={r.id}>
                <td style={{ color: '#A8A5C8', fontSize: 12 }}>{r.id}</td>
                <td style={{ fontWeight: 600 }}>{r.userName}</td>
                <td style={{ color: '#6B6880' }}>{r.bankName}</td>
                <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{r.account}</td>
                <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#6B6880' }}>{r.ifsc}</td>
                <td style={{ fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>₹{fmt(r.amount)}</td>
                <td><span className={`badge ${statusClass(r.status)}`}>{r.status}</span></td>
                <td style={{ color: '#A8A5C8', fontSize: 12 }}>{r.date}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setDetail(r)}>
                      <Icon name="eye" size={13} color="#6B6880" /> View
                    </button>
                    {r.status === 'pending' && (
                      <button className="btn btn-approve btn-sm" onClick={() => update(r.id, 'approved')}>Approve</button>
                    )}
                    {r.status === 'approved' && (
                      <button className="btn btn-sm" style={{ background: '#EAF4FF', color: '#1A6FC5', border: '1px solid #B3D4F5', fontWeight: 700 }} onClick={() => update(r.id, 'transferred')}>
                        Mark Sent
                      </button>
                    )}
                    {r.status === 'pending' && (
                      <button className="btn btn-reject btn-sm" onClick={() => update(r.id, 'rejected')}>Reject</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={9} style={{ textAlign: 'center', color: '#A8A5C8', padding: '32px 0' }}>No results found</td></tr>
            )}
          </tbody>
        </table>
        <div className="admin-pagination"><span>Showing {visible.length} of {items.length} requests</span></div>
      </div>

      {detail && (
        <div className="admin-modal-overlay" onClick={() => setDetail(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div className="admin-modal-title">Transfer — {detail.id}</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setDetail(null)}><Icon name="x" size={14} color="#6B6880" /></button>
            </div>

            <div style={{ background: '#FAFAFE', border: '1px solid #E8E6F8', borderRadius: 12, overflow: 'hidden', marginBottom: 18 }}>
              {[
                { l: 'Ambassador',   v: detail.userName },
                { l: 'Bank',         v: detail.bankName },
                { l: 'Account No.',  v: detail.account, mono: true },
                { l: 'IFSC',         v: detail.ifsc, mono: true },
                { l: 'Amount',       v: `₹${fmt(detail.amount)}`, bold: true },
                { l: 'Status',       v: detail.status },
                { l: 'Date',         v: detail.date },
                { l: 'Approved By',  v: detail.approvedBy || '—' },
              ].map((r, i) => (
                <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderTop: i > 0 ? '1px solid #F5F4FF' : 'none' }}>
                  <span style={{ fontSize: 12, color: '#A8A5C8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{r.l}</span>
                  <span style={{ fontSize: 13.5, fontWeight: (r as any).bold ? 700 : 600, color: '#1A1740', fontFamily: (r as any).mono ? 'JetBrains Mono, monospace' : 'inherit' }}>{r.v}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              {detail.status === 'pending' && (
                <>
                  <button className="btn btn-approve" style={{ flex: 1 }} onClick={() => update(detail.id, 'approved')}>
                    <Icon name="check" size={15} color="#1A8C3C" /> Approve
                  </button>
                  <button className="btn btn-reject" style={{ flex: 1 }} onClick={() => update(detail.id, 'rejected')}>
                    <Icon name="x" size={15} color="#C0281E" /> Reject
                  </button>
                </>
              )}
              {detail.status === 'approved' && (
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => update(detail.id, 'transferred')}>
                  <Icon name="bank" size={15} color="white" /> Mark as Transferred
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
