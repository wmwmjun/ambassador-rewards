'use client';
import { useState } from 'react';
import Icon from '@/app/components/Icon';
import { ADMIN_USERS, POINT_AWARDS } from '@/lib/admin-mock';

const fmt = (n: number) => n.toLocaleString('en-IN');

const EXPIRY_DATE = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 2);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
})();

const CSV_SAMPLE = `user_id,points,reason
U001,2500,Q2 target achieved
U003,5000,Best performer March
U007,3000,Campus campaign`;

type Tab = 'individual' | 'csv';

interface CsvRow { userId: string; points: number; reason: string; valid: boolean; error?: string }

function parseCsv(text: string): CsvRow[] {
  const lines = text.trim().split('\n').slice(1);
  const ids = new Set(ADMIN_USERS.map(u => u.id));
  return lines.map(line => {
    const [userId, pts, ...rest] = line.split(',');
    const reason = rest.join(',').trim();
    const points = Number(pts);
    if (!ids.has(userId?.trim())) return { userId: userId?.trim() || '—', points, reason, valid: false, error: 'Unknown user ID' };
    if (!points || points <= 0)   return { userId: userId.trim(), points, reason, valid: false, error: 'Invalid points' };
    if (!reason)                  return { userId: userId.trim(), points, reason, valid: false, error: 'Reason required' };
    return { userId: userId.trim(), points, reason, valid: true };
  });
}

export default function PointsPage() {
  const [tab, setTab]             = useState<Tab>('individual');
  const [selUser, setSelUser]     = useState('');
  const [points, setPoints]       = useState('');
  const [reason, setReason]       = useState('');
  const [awarded, setAwarded]     = useState(false);
  const [awards, setAwards]       = useState(POINT_AWARDS);

  const [csvRows, setCsvRows]     = useState<CsvRow[] | null>(null);
  const [csvConfirmed, setCsvConfirmed] = useState(false);
  const [dragging, setDragging]   = useState(false);

  const user = ADMIN_USERS.find(u => u.id === selUser);
  const pts  = Number(points);

  const handleAward = () => {
    if (!user || pts <= 0 || !reason.trim()) return;
    const newEntry = {
      id: `PA${String(awards.length + 1).padStart(3, '0')}`,
      userId: user.id, userName: `${user.firstName} ${user.lastName}`,
      points: pts, reason: reason.trim(),
      awardedBy: 'Ayesha Khan', date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      expiresOn: EXPIRY_DATE,
    };
    setAwards(prev => [newEntry, ...prev]);
    setAwarded(true);
    setTimeout(() => { setAwarded(false); setSelUser(''); setPoints(''); setReason(''); }, 2500);
  };

  const handleCsvConfirm = () => {
    if (!csvRows) return;
    const valid = csvRows.filter(r => r.valid);
    const newEntries = valid.map((r, i) => {
      const u = ADMIN_USERS.find(u => u.id === r.userId)!;
      return {
        id: `PA${String(awards.length + i + 1).padStart(3, '0')}`,
        userId: r.userId, userName: `${u.firstName} ${u.lastName}`,
        points: r.points, reason: r.reason,
        awardedBy: 'Ayesha Khan',
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        expiresOn: EXPIRY_DATE,
      };
    });
    setAwards(prev => [...newEntries, ...prev]);
    setCsvConfirmed(true);
    setTimeout(() => { setCsvRows(null); setCsvConfirmed(false); }, 3000);
  };

  const handleFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => setCsvRows(parseCsv(e.target?.result as string));
    reader.readAsText(file);
  };

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div className="admin-page-title">Points Management</div>
        <div className="admin-page-sub">Award points individually or via CSV bulk upload</div>
      </div>

      <div className="admin-table-wrap" style={{ marginBottom: 24 }}>
        <div className="admin-table-header">
          <span className="admin-table-title">Award Points</span>
          <div className="filter-tabs">
            <button className={`filter-tab${tab === 'individual' ? ' active' : ''}`} onClick={() => setTab('individual')}>Individual</button>
            <button className={`filter-tab${tab === 'csv' ? ' active' : ''}`} onClick={() => setTab('csv')}>CSV Bulk</button>
          </div>
        </div>

        <div style={{ padding: '20px 24px' }}>
          {tab === 'individual' ? (
            <div style={{ maxWidth: 520 }}>
              {awarded && (
                <div style={{ background: '#EDFFF4', border: '1px solid #A0E4B8', borderRadius: 10, padding: '12px 16px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8, color: '#1A8C3C', fontWeight: 600, fontSize: 13 }}>
                  <Icon name="check" size={15} color="#1A8C3C" /> Points awarded successfully!
                </div>
              )}
              <div style={{ marginBottom: 14 }}>
                <label className="admin-label">Select Ambassador</label>
                <select className="admin-input" value={selUser} onChange={e => setSelUser(e.target.value)}>
                  <option value="">— Choose user —</option>
                  {ADMIN_USERS.filter(u => u.status === 'active').map(u => (
                    <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.id}) — {u.college}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label className="admin-label">Points to Award</label>
                <input className="admin-input" type="number" min="1" placeholder="e.g. 2500" value={points} onChange={e => setPoints(e.target.value)} style={{ fontFamily: 'JetBrains Mono, monospace' }} />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label className="admin-label">Reason</label>
                <textarea className="admin-input" rows={3} placeholder="e.g. Q2 sales target achieved" value={reason} onChange={e => setReason(e.target.value)} style={{ resize: 'vertical' }} />
              </div>

              {user && pts > 0 && (
                <div style={{ background: '#F5F4FF', border: '1px solid #E0DEFF', borderRadius: 10, padding: '14px 18px', marginBottom: 18 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#A8A5C8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Preview</div>
                  {[
                    ['Recipient',   `${user.firstName} ${user.lastName} (${user.id})`],
                    ['Points',      `${fmt(pts)} pts = ₹${fmt(pts)}`],
                    ['Expires on',  EXPIRY_DATE],
                    ['New balance', `${fmt(user.balance + pts)} pts`],
                  ].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                      <span style={{ color: '#6B6880' }}>{l}</span>
                      <span style={{ fontWeight: 600, color: '#1A1740' }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}

              <button className="btn btn-primary" disabled={!user || pts <= 0 || !reason.trim()} onClick={handleAward} style={{ width: '100%' }}>
                <Icon name="wallet" size={15} color="white" /> Award Points
              </button>
            </div>
          ) : (
            <div>
              {csvConfirmed && (
                <div style={{ background: '#EDFFF4', border: '1px solid #A0E4B8', borderRadius: 10, padding: '12px 16px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8, color: '#1A8C3C', fontWeight: 600, fontSize: 13 }}>
                  <Icon name="check" size={15} color="#1A8C3C" /> Bulk award processed for {csvRows?.filter(r => r.valid).length ?? 0} users!
                </div>
              )}
              {!csvRows ? (
                <div>
                  <div
                    className={`upload-zone${dragging ? ' dragging' : ''}`}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                    onClick={() => document.getElementById('csv-input')?.click()}
                    style={{ marginBottom: 20 }}
                  >
                    <input id="csv-input" type="file" accept=".csv" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                    <Icon name="upload" size={28} color="#A8A5C8" />
                    <div style={{ marginTop: 10, fontWeight: 600, color: '#6B6880', fontSize: 14 }}>Drop CSV here or click to upload</div>
                    <div style={{ fontSize: 12, color: '#A8A5C8', marginTop: 4 }}>Max 5 MB · .csv only</div>
                  </div>
                  <div style={{ background: '#FAFAFE', border: '1px solid #E8E6F8', borderRadius: 10, padding: '14px 18px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#A8A5C8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Expected Format</div>
                    <pre style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#1A1740', margin: 0, lineHeight: 1.7 }}>{CSV_SAMPLE}</pre>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1740' }}>
                      Preview — {csvRows.filter(r => r.valid).length} valid / {csvRows.length} total rows
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => setCsvRows(null)}>
                      <Icon name="x" size={13} color="#6B6880" /> Clear
                    </button>
                  </div>
                  <table className="admin-table" style={{ marginBottom: 16 }}>
                    <thead>
                      <tr><th>User ID</th><th>User Name</th><th>Points</th><th>Reason</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {csvRows.map((r, i) => {
                        const u = ADMIN_USERS.find(u => u.id === r.userId);
                        return (
                          <tr key={i}>
                            <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{r.userId}</td>
                            <td>{u ? `${u.firstName} ${u.lastName}` : '—'}</td>
                            <td style={{ fontWeight: 700 }}>{r.valid ? fmt(r.points) : r.points}</td>
                            <td style={{ color: '#6B6880', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.reason || '—'}</td>
                            <td>
                              {r.valid
                                ? <span className="badge s-active">Valid</span>
                                : <span className="badge s-suspended" title={r.error}>{r.error}</span>
                              }
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <button
                    className="btn btn-primary"
                    disabled={csvRows.filter(r => r.valid).length === 0}
                    onClick={handleCsvConfirm}
                  >
                    <Icon name="check" size={15} color="white" />
                    Confirm Bulk Award ({csvRows.filter(r => r.valid).length} users)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Award history */}
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <span className="admin-table-title">Award History</span>
        </div>
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>Ambassador</th><th>Points</th><th>Reason</th><th>Awarded By</th><th>Date</th><th>Expires</th></tr>
          </thead>
          <tbody>
            {awards.map(a => (
              <tr key={a.id}>
                <td style={{ color: '#A8A5C8', fontSize: 12 }}>{a.id}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{a.userName}</div>
                  <div style={{ fontSize: 11.5, color: '#A8A5C8' }}>{a.userId}</div>
                </td>
                <td style={{ fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>+{fmt(a.points)}</td>
                <td style={{ color: '#6B6880', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.reason}</td>
                <td style={{ color: '#6B6880' }}>{a.awardedBy}</td>
                <td style={{ color: '#A8A5C8', fontSize: 12 }}>{a.date}</td>
                <td style={{ color: '#A8A5C8', fontSize: 12 }}>{a.expiresOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
