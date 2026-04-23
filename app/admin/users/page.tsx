'use client';
import { useState } from 'react';
import Icon from '@/app/components/Icon';
import { ADMIN_USERS, type AdminUser } from '@/lib/admin-mock';

const fmt = (n: number) => n.toLocaleString('en-IN');
type Filter = 'all' | 'active' | 'suspended';

export default function UsersPage() {
  const [filter, setFilter]   = useState<Filter>('all');
  const [query,  setQuery]    = useState('');
  const [detail, setDetail]   = useState<AdminUser | null>(null);
  const [users,  setUsers]    = useState(ADMIN_USERS);

  const visible = users.filter(u => {
    if (filter === 'active'    && u.status !== 'active')    return false;
    if (filter === 'suspended' && u.status !== 'suspended') return false;
    const q = query.toLowerCase();
    return !q || `${u.firstName} ${u.lastName} ${u.email} ${u.college}`.toLowerCase().includes(q);
  });

  const toggleStatus = (id: string) => {
    setUsers(us => us.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
    setDetail(d => d?.id === id ? { ...d, status: d.status === 'active' ? 'suspended' : 'active' } : d);
  };

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div className="admin-page-title">Users</div>
        <div className="admin-page-sub">Manage ambassador accounts and their status</div>
      </div>

      {/* Stats row */}
      <div className="admin-stats" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 20 }}>
        <div className="admin-stat-card"><div className="admin-stat-label">Total</div><div className="admin-stat-value">{users.length}</div></div>
        <div className="admin-stat-card"><div className="admin-stat-label">Active</div><div className="admin-stat-value admin-stat-accent">{users.filter(u => u.status === 'active').length}</div></div>
        <div className="admin-stat-card"><div className="admin-stat-label">Suspended</div><div className="admin-stat-value" style={{ color: '#C0281E' }}>{users.filter(u => u.status === 'suspended').length}</div></div>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <span className="admin-table-title">All ambassadors</span>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="admin-search">
              <Icon name="search" size={14} color="#A8A5C8" />
              <input placeholder="Search name, email…" value={query} onChange={e => setQuery(e.target.value)} />
            </div>
            <div className="filter-tabs">
              {(['all','active','suspended'] as Filter[]).map(f => (
                <button key={f} className={`filter-tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr><th>#</th><th>Name</th><th>Email</th><th>College</th><th>Balance</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {visible.map((u, i) => (
              <tr key={u.id}>
                <td style={{ color: '#A8A5C8', fontSize: 12 }}>{u.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#A29AFF,#E66BFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                      {u.firstName[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{u.firstName} {u.lastName}</div>
                      <div style={{ fontSize: 11.5, color: '#A8A5C8' }}>{u.year}</div>
                    </div>
                  </div>
                </td>
                <td style={{ color: '#6B6880' }}>{u.email}</td>
                <td style={{ color: '#6B6880' }}>{u.college}</td>
                <td style={{ fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>{fmt(u.balance)}</td>
                <td>
                  <span className={`badge ${u.status === 'active' ? 's-active' : 's-suspended'}`}>
                    {u.status}
                  </span>
                </td>
                <td style={{ color: '#A8A5C8', fontSize: 12 }}>{u.joinDate}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setDetail(u)}>
                      <Icon name="eye" size={13} color="#6B6880" /> View
                    </button>
                    <button
                      className={`btn btn-sm ${u.status === 'active' ? 'btn-reject' : 'btn-approve'}`}
                      onClick={() => toggleStatus(u.id)}
                    >
                      {u.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: '#A8A5C8', padding: '32px 0' }}>No results found</td></tr>
            )}
          </tbody>
        </table>
        <div className="admin-pagination">
          <span>Showing {visible.length} of {users.length} users</span>
        </div>
      </div>

      {/* Detail modal */}
      {detail && (
        <div className="admin-modal-overlay" onClick={() => setDetail(null)}>
          <div className="admin-modal admin-modal-lg" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#A29AFF,#E66BFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 18 }}>
                  {detail.firstName[0]}
                </div>
                <div>
                  <div className="admin-modal-title" style={{ marginBottom: 2 }}>{detail.firstName} {detail.lastName}</div>
                  <span className={`badge ${detail.status === 'active' ? 's-active' : 's-suspended'}`}>{detail.status}</span>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setDetail(null)}><Icon name="x" size={14} color="#6B6880" /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, background: '#FAFAFE', borderRadius: 12, border: '1px solid #E8E6F8', overflow: 'hidden', marginBottom: 18 }}>
              {[
                { l: 'User ID',        v: detail.id },
                { l: 'Email',          v: detail.email },
                { l: 'Contact',        v: detail.contact },
                { l: 'Date of birth',  v: '—' },
                { l: 'College',        v: detail.college },
                { l: 'Year',           v: detail.year },
                { l: 'Joined',         v: detail.joinDate },
                { l: 'Bank linked',    v: detail.hasBank ? '✓ Yes' : '✗ No' },
                { l: 'PAN number',     v: detail.pan, mono: true },
                { l: 'Balance',        v: `${fmt(detail.balance)} pts`, bold: true },
              ].map((r, i) => (
                <div key={r.l} style={{ padding: '10px 16px', borderTop: i > 0 ? '1px solid #F5F4FF' : 'none', borderRight: i % 2 === 0 ? '1px solid #F5F4FF' : 'none' }}>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: '#A8A5C8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{r.l}</div>
                  <div style={{ fontSize: 13.5, fontWeight: (r as any).bold ? 700 : 500, color: '#1A1740', fontFamily: (r as any).mono ? 'JetBrains Mono' : 'inherit' }}>{r.v}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className={`btn ${detail.status === 'active' ? 'btn-reject' : 'btn-approve'}`}
                style={{ flex: 1 }}
                onClick={() => toggleStatus(detail.id)}
              >
                <Icon name={detail.status === 'active' ? 'x' : 'check'} size={15} color={detail.status === 'active' ? '#C0281E' : '#1A8C3C'} />
                {detail.status === 'active' ? 'Suspend account' : 'Activate account'}
              </button>
              <button className="btn btn-ghost" style={{ flex: 1 }}>
                <Icon name="mail" size={15} color="#6B6880" /> Send email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
