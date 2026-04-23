'use client';
import { useState } from 'react';
import Icon from '@/app/components/Icon';
import { REGISTRATION_REQUESTS, type RegistrationRequest } from '@/lib/admin-mock';

type Filter = 'all' | 'pending' | 'approved' | 'rejected';

const REJECTION_REASONS = [
  'PAN document unclear or invalid',
  'Student ID not verifiable',
  'Duplicate account detected',
  'College not in eligible list',
  'Contact details mismatch',
  'Other',
];

export default function RegistrationsPage() {
  const [filter,  setFilter]  = useState<Filter>('pending');
  const [query,   setQuery]   = useState('');
  const [items,   setItems]   = useState(REGISTRATION_REQUESTS);
  const [detail,  setDetail]  = useState<RegistrationRequest | null>(null);
  const [rejectModal, setRejectModal] = useState<RegistrationRequest | null>(null);
  const [rejectReason, setRejectReason] = useState(REJECTION_REASONS[0]);
  const [customReason, setCustomReason] = useState('');

  const visible = items.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false;
    const q = query.toLowerCase();
    return !q || `${r.firstName} ${r.lastName} ${r.email} ${r.college} ${r.id}`.toLowerCase().includes(q);
  });

  const approve = (id: string) => {
    setItems(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' as const } : r));
    setDetail(d => d?.id === id ? { ...d, status: 'approved' as const } : d);
  };

  const reject = (id: string, reason: string) => {
    setItems(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' as const, rejectionReason: reason } : r));
    setDetail(d => d?.id === id ? { ...d, status: 'rejected' as const, rejectionReason: reason } : d);
    setRejectModal(null);
    setRejectReason(REJECTION_REASONS[0]);
    setCustomReason('');
  };

  const pending  = items.filter(r => r.status === 'pending').length;
  const approved = items.filter(r => r.status === 'approved').length;
  const rejected = items.filter(r => r.status === 'rejected').length;

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div className="admin-page-title">Registration Approvals</div>
        <div className="admin-page-sub">Review and approve new ambassador applications</div>
      </div>

      <div className="admin-stats" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 20 }}>
        <div className="admin-stat-card" style={{ borderColor: pending > 0 ? '#A29AFF' : undefined }}>
          <div className="admin-stat-label">Pending review</div>
          <div className="admin-stat-value" style={{ color: '#7B72E8' }}>{pending}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Approved</div>
          <div className="admin-stat-value admin-stat-accent">{approved}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Rejected</div>
          <div className="admin-stat-value" style={{ color: '#C0281E' }}>{rejected}</div>
        </div>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <span className="admin-table-title">Applications</span>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="admin-search">
              <Icon name="search" size={14} color="#A8A5C8" />
              <input placeholder="Search name, email, college…" value={query} onChange={e => setQuery(e.target.value)} />
            </div>
            <div className="filter-tabs">
              {(['all', 'pending', 'approved', 'rejected'] as Filter[]).map(f => (
                <button key={f} className={`filter-tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {f === 'pending' && pending > 0 && (
                    <span style={{ marginLeft: 5, background: '#7B72E8', color: 'white', borderRadius: 10, padding: '0 6px', fontSize: 10, fontWeight: 800 }}>
                      {pending}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th><th>Applicant</th><th>Email</th><th>College</th><th>Year</th><th>PAN</th><th>Submitted</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(r => (
              <tr key={r.id}>
                <td style={{ color: '#A8A5C8', fontSize: 12 }}>{r.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#A29AFF,#E66BFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                      {r.firstName[0]}
                    </div>
                    <div style={{ fontWeight: 600 }}>{r.firstName} {r.lastName}</div>
                  </div>
                </td>
                <td style={{ color: '#6B6880' }}>{r.email}</td>
                <td style={{ color: '#6B6880' }}>{r.college}</td>
                <td style={{ color: '#6B6880' }}>{r.year}</td>
                <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{r.pan}</td>
                <td style={{ color: '#A8A5C8', fontSize: 12 }}>{r.submittedDate}</td>
                <td>
                  {r.status === 'pending' && <span className="badge s-pending">Pending</span>}
                  {r.status === 'approved' && <span className="badge s-active">Approved</span>}
                  {r.status === 'rejected' && <span className="badge s-suspended">Rejected</span>}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setDetail(r)}>
                      <Icon name="eye" size={13} color="#6B6880" /> View
                    </button>
                    {r.status === 'pending' && (
                      <>
                        <button className="btn btn-approve btn-sm" onClick={() => approve(r.id)}>Approve</button>
                        <button className="btn btn-reject btn-sm" onClick={() => { setRejectModal(r); }}>Reject</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', color: '#A8A5C8', padding: '40px 0' }}>
                  {filter === 'pending' ? 'No pending applications — all caught up!' : 'No results found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="admin-pagination">
          <span>Showing {visible.length} of {items.length} applications</span>
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
                  <div className="admin-modal-title" style={{ marginBottom: 4 }}>
                    {detail.firstName} {detail.lastName}
                  </div>
                  {detail.status === 'pending'  && <span className="badge s-pending">Pending review</span>}
                  {detail.status === 'approved' && <span className="badge s-active">Approved</span>}
                  {detail.status === 'rejected' && <span className="badge s-suspended">Rejected</span>}
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setDetail(null)}>
                <Icon name="x" size={14} color="#6B6880" />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#FAFAFE', borderRadius: 12, border: '1px solid #E8E6F8', overflow: 'hidden', marginBottom: 18 }}>
              {[
                { l: 'Application ID', v: detail.id },
                { l: 'Email',          v: detail.email },
                { l: 'Contact',        v: detail.contact },
                { l: 'College',        v: detail.college },
                { l: 'Year',           v: detail.year },
                { l: 'PAN Number',     v: detail.pan, mono: true },
                { l: 'Submitted',      v: detail.submittedDate },
                { l: 'Status',         v: detail.status },
              ].map((row, i) => (
                <div key={row.l} style={{ padding: '10px 16px', borderTop: i > 0 ? '1px solid #F5F4FF' : 'none', borderRight: i % 2 === 0 ? '1px solid #F5F4FF' : 'none' }}>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: '#A8A5C8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{row.l}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: '#1A1740', fontFamily: (row as any).mono ? 'JetBrains Mono, monospace' : 'inherit' }}>{row.v}</div>
                </div>
              ))}
            </div>

            {detail.status === 'rejected' && detail.rejectionReason && (
              <div style={{ background: '#FFF2F1', border: '1px solid #FFD4D2', borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <Icon name="x" size={14} color="#C0281E" />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#C0281E', marginBottom: 2 }}>Rejection reason</div>
                  <div style={{ fontSize: 13, color: '#7A2020' }}>{detail.rejectionReason}</div>
                </div>
              </div>
            )}

            {/* PAN upload placeholder */}
            <div style={{ background: '#F5F4FF', border: '1.5px dashed #C5C0F0', borderRadius: 12, padding: '20px', marginBottom: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <Icon name="file-text" size={24} color="#A8A5C8" />
              <div style={{ fontSize: 13, color: '#6B6880', fontWeight: 500 }}>PAN Document</div>
              <div style={{ fontSize: 12, color: '#A8A5C8' }}>Uploaded by applicant during registration</div>
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 4 }}>
                <Icon name="eye" size={13} color="#6B6880" /> Preview Document
              </button>
            </div>

            {detail.status === 'pending' && (
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-approve" style={{ flex: 1 }} onClick={() => approve(detail.id)}>
                  <Icon name="check" size={15} color="#1A8C3C" /> Approve Application
                </button>
                <button className="btn btn-reject" style={{ flex: 1 }} onClick={() => { setRejectModal(detail); setDetail(null); }}>
                  <Icon name="x" size={15} color="#C0281E" /> Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject reason modal */}
      {rejectModal && (
        <div className="admin-modal-overlay" onClick={() => setRejectModal(null)}>
          <div className="admin-modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div className="admin-modal-title">Reject Application</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setRejectModal(null)}>
                <Icon name="x" size={14} color="#6B6880" />
              </button>
            </div>

            <div style={{ fontSize: 13, color: '#6B6880', marginBottom: 16 }}>
              Rejecting <strong style={{ color: '#1A1740' }}>{rejectModal.firstName} {rejectModal.lastName}</strong>'s application.
              The applicant will be notified with the reason below.
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="admin-label">Rejection Reason</label>
              <select
                className="admin-input"
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
              >
                {REJECTION_REASONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>

            {rejectReason === 'Other' && (
              <div style={{ marginBottom: 14 }}>
                <label className="admin-label">Custom Reason</label>
                <textarea
                  className="admin-input"
                  rows={3}
                  placeholder="Describe the reason…"
                  value={customReason}
                  onChange={e => setCustomReason(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn btn-reject"
                style={{ flex: 1 }}
                disabled={rejectReason === 'Other' && !customReason.trim()}
                onClick={() => reject(rejectModal.id, rejectReason === 'Other' ? customReason.trim() : rejectReason)}
              >
                <Icon name="x" size={15} color="#C0281E" /> Confirm Rejection
              </button>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setRejectModal(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
