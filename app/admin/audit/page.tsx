'use client';
import { useState } from 'react';
import Icon from '@/app/components/Icon';
import { AUDIT_LOG } from '@/lib/admin-mock';

type TypeFilter = 'all' | 'points' | 'approval' | 'user' | 'product' | 'csv';

const TYPE_COLOR: Record<string, string> = {
  points: '#7B72E8', approval: '#1A6FC5', user: '#C0281E', product: '#A830C4', csv: '#1A8C3C',
};

export default function AuditPage() {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [query,      setQuery]      = useState('');

  const visible = AUDIT_LOG.filter(a => {
    if (typeFilter !== 'all' && a.type !== typeFilter) return false;
    const q = query.toLowerCase();
    return !q || `${a.action} ${a.admin} ${a.target} ${a.details}`.toLowerCase().includes(q);
  });

  const counts: Record<TypeFilter, number> = {
    all:      AUDIT_LOG.length,
    points:   AUDIT_LOG.filter(a => a.type === 'points').length,
    approval: AUDIT_LOG.filter(a => a.type === 'approval').length,
    user:     AUDIT_LOG.filter(a => a.type === 'user').length,
    product:  AUDIT_LOG.filter(a => a.type === 'product').length,
    csv:      AUDIT_LOG.filter(a => a.type === 'csv').length,
  };

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div className="admin-page-title">Audit Log</div>
        <div className="admin-page-sub">Full history of admin actions across the platform</div>
      </div>

      <div className="admin-stats" style={{ gridTemplateColumns: 'repeat(5,1fr)', marginBottom: 20 }}>
        {(['points','approval','user','product','csv'] as TypeFilter[]).map(t => (
          <div key={t} className="admin-stat-card" style={{ cursor: 'pointer', borderColor: typeFilter === t ? TYPE_COLOR[t] : undefined }} onClick={() => setTypeFilter(typeFilter === t ? 'all' : t)}>
            <div className="admin-stat-label" style={{ textTransform: 'capitalize' }}>{t}</div>
            <div className="admin-stat-value" style={{ color: TYPE_COLOR[t] }}>{counts[t]}</div>
          </div>
        ))}
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="admin-table-title">Activity</span>
            <span style={{ fontSize: 12, color: '#A8A5C8' }}>({visible.length} entries)</span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="admin-search">
              <Icon name="search" size={14} color="#A8A5C8" />
              <input placeholder="Search action, admin, target…" value={query} onChange={e => setQuery(e.target.value)} />
            </div>
            <div className="filter-tabs">
              {(['all','points','approval','user','product','csv'] as TypeFilter[]).map(f => (
                <button key={f} className={`filter-tab${typeFilter === f ? ' active' : ''}`} onClick={() => setTypeFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr><th>#</th><th>Action</th><th>Admin</th><th>Target</th><th>Details</th><th>Date</th></tr>
          </thead>
          <tbody>
            {visible.map(a => (
              <tr key={a.id}>
                <td style={{ color: '#A8A5C8', fontSize: 12 }}>{a.id}</td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 6, background: `${TYPE_COLOR[a.type]}18`, fontSize: 12, fontWeight: 700, color: TYPE_COLOR[a.type] }}>
                    {a.action}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#A29AFF,#E66BFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>
                      {a.admin[0]}
                    </div>
                    <span style={{ color: '#6B6880', fontSize: 13 }}>{a.admin}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{a.target}</td>
                <td style={{ color: '#6B6880', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13 }}>{a.details}</td>
                <td style={{ color: '#A8A5C8', fontSize: 12, whiteSpace: 'nowrap' }}>{a.date}</td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#A8A5C8', padding: '32px 0' }}>No matching entries</td></tr>
            )}
          </tbody>
        </table>
        <div className="admin-pagination"><span>Showing {visible.length} of {AUDIT_LOG.length} entries</span></div>
      </div>
    </div>
  );
}
