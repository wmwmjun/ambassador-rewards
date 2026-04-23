'use client';
import Link from 'next/link';
import Icon from '@/app/components/Icon';
import { ADMIN_STATS, AUDIT_LOG } from '@/lib/admin-mock';

const fmt = (n: number) => n.toLocaleString('en-IN');

const Stat = ({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) => (
  <div className="admin-stat-card">
    <div className="admin-stat-label">{label}</div>
    <div className={`admin-stat-value${accent ? ' admin-stat-accent' : ''}`}>{value}</div>
    {sub && <div className="admin-stat-sub">{sub}</div>}
  </div>
);

const actionTypeColor: Record<string, string> = {
  points: '#7B72E8', approval: '#1A6FC5', user: '#C0281E', product: '#A830C4', csv: '#1A8C3C',
};

export default function AdminDashboard() {
  const s = ADMIN_STATS;

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div className="admin-page-title">Dashboard</div>
        <div className="admin-page-sub">Overview of the Ambassador program — as of today</div>
      </div>

      {/* Users + Points summary */}
      <div className="admin-stats">
        <Stat label="Total ambassadors" value={fmt(s.totalUsers)} sub="Active registrations" />
        <Stat label="Current valid points" value={fmt(s.currentValidPoints)} sub="1 pt = ₹1" accent />
        <Stat label="Expiring in 30 days" value={fmt(s.expiringIn30d)} sub="Needs attention" />
        <Stat label="Pending requests" value={String(s.pendingBankTransfers + s.pendingEGift)} sub={`${s.pendingEGift} eGift · ${s.pendingBankTransfers} transfers`} />
      </div>

      {/* Lifetime summary */}
      <div style={{ marginBottom: 8, fontSize: 11, fontWeight: 700, color: '#A8A5C8', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Lifetime points summary</div>
      <div className="admin-stats" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 24 }}>
        <Stat label="Lifetime earned" value={fmt(s.lifetimeEarned)} />
        <Stat label="Consumed (redeemed)" value={fmt(s.consumedPoints)} />
        <Stat label="Expired" value={fmt(s.expiredPoints)} />
      </div>

      {/* Allowance + monthly */}
      <div className="admin-stats" style={{ marginBottom: 24 }}>
        <Stat label="Bank transfer allowance" value={`₹${fmt(s.allowanceBankTransfer)}`} sub="Remaining deposit" />
        <Stat label="Gift card allowance"      value={`₹${fmt(s.allowanceGiftCard)}`}      sub="Remaining deposit" />
        <Stat label="This month — awarded"     value={fmt(s.monthlyAwarded)}                sub="Points issued" />
        <Stat label="This month — redeemed"    value={fmt(s.monthlyRedeemed)}               sub="Points used" />
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { href: '/admin/egift',     icon: 'gift' as const,      label: 'eGift requests',       count: s.pendingEGift,            color: '#A830C4' },
          { href: '/admin/transfers', icon: 'bank' as const,      label: 'Transfer requests',    count: s.pendingBankTransfers,    color: '#1A6FC5' },
          { href: '/admin/points',    icon: 'wallet' as const,    label: 'Award points',         count: null,                      color: '#7B72E8' },
          { href: '/admin/users',     icon: 'users' as const,     label: 'Manage users',         count: null,                      color: '#1A8C3C' },
        ].map(q => (
          <Link key={q.href} href={q.href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14, background: 'white', borderRadius: 14, border: '1px solid #E8E6F8', padding: '16px 20px', transition: 'border-color 0.13s', cursor: 'pointer' }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: `${q.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={q.icon} size={20} color={q.color} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1740' }}>{q.label}</div>
              {q.count !== null && <div style={{ fontSize: 12, color: '#A8A5C8', marginTop: 2 }}>{q.count} pending</div>}
            </div>
            <Icon name="chevron-right" size={16} color="#D0CEEA" />
          </Link>
        ))}
      </div>

      {/* Recent audit activity */}
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <span className="admin-table-title">Recent activity</span>
          <Link href="/admin/audit" style={{ fontSize: 13, fontWeight: 600, color: '#7B72E8', textDecoration: 'none' }}>View all →</Link>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Action</th><th>Admin</th><th>Target</th><th>Details</th><th>Date</th>
            </tr>
          </thead>
          <tbody>
            {AUDIT_LOG.slice(0, 8).map(a => (
              <tr key={a.id}>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '2px 8px', borderRadius: 6, background: `${actionTypeColor[a.type]}18`, fontSize: 12, fontWeight: 700, color: actionTypeColor[a.type] }}>
                    {a.action}
                  </span>
                </td>
                <td style={{ color: '#6B6880' }}>{a.admin}</td>
                <td style={{ fontWeight: 500 }}>{a.target}</td>
                <td style={{ color: '#6B6880', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.details}</td>
                <td style={{ color: '#A8A5C8', fontSize: 12, whiteSpace: 'nowrap' }}>{a.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
