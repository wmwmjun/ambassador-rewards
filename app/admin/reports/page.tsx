'use client';
import { useState } from 'react';
import Icon from '@/app/components/Icon';
import { ADMIN_STATS, ADMIN_USERS, POINT_AWARDS, EGIFT_REQUESTS, TRANSFER_REQUESTS } from '@/lib/admin-mock';

const fmt = (n: number) => n.toLocaleString('en-IN');

type ReportType = 'users' | 'points' | 'egift' | 'transfers' | 'summary';

const REPORT_OPTIONS: { type: ReportType; label: string; desc: string; icon: 'users' | 'wallet' | 'gift' | 'bank' | 'file-text' }[] = [
  { type: 'summary',   label: 'Program Summary',         desc: 'Overall stats, points balance, redemption totals',   icon: 'file-text' },
  { type: 'users',     label: 'Ambassador List',          desc: 'All users with balance, status, join date',          icon: 'users'     },
  { type: 'points',    label: 'Points Award History',     desc: 'All point awards with reason and expiry',            icon: 'wallet'    },
  { type: 'egift',     label: 'eGift Redemptions',        desc: 'All gift card requests with status and codes',       icon: 'gift'      },
  { type: 'transfers', label: 'Bank Transfer Requests',   desc: 'All transfer requests with bank details and status', icon: 'bank'      },
];

function buildCsv(type: ReportType): string {
  if (type === 'summary') {
    const s = ADMIN_STATS;
    return [
      'Metric,Value',
      `Total Ambassadors,${s.totalUsers}`,
      `Current Valid Points,${s.currentValidPoints}`,
      `Expiring in 30 days,${s.expiringIn30d}`,
      `Lifetime Earned,${s.lifetimeEarned}`,
      `Consumed (Redeemed),${s.consumedPoints}`,
      `Expired,${s.expiredPoints}`,
      `Bank Transfer Allowance,${s.allowanceBankTransfer}`,
      `Gift Card Allowance,${s.allowanceGiftCard}`,
      `This Month Awarded,${s.monthlyAwarded}`,
      `This Month Redeemed,${s.monthlyRedeemed}`,
      `Pending Bank Transfers,${s.pendingBankTransfers}`,
      `Pending eGift,${s.pendingEGift}`,
    ].join('\n');
  }
  if (type === 'users') {
    const header = 'ID,First Name,Last Name,Email,Contact,College,Year,Balance,Status,Joined,PAN,Bank Linked';
    const rows = ADMIN_USERS.map(u =>
      `${u.id},${u.firstName},${u.lastName},${u.email},${u.contact},${u.college},${u.year},${u.balance},${u.status},${u.joinDate},${u.pan},${u.hasBank}`
    );
    return [header, ...rows].join('\n');
  }
  if (type === 'points') {
    const header = 'ID,User ID,User Name,Points,Reason,Awarded By,Date,Expires On';
    const rows = POINT_AWARDS.map(a =>
      `${a.id},${a.userId},${a.userName},${a.points},"${a.reason}",${a.awardedBy},${a.date},${a.expiresOn}`
    );
    return [header, ...rows].join('\n');
  }
  if (type === 'egift') {
    const header = 'ID,User ID,User Name,Brand,Amount,Points,Status,Date,Gift Code';
    const rows = EGIFT_REQUESTS.map(r =>
      `${r.id},${r.userId},${r.userName},${r.brand},${r.amount},${r.points},${r.status},${r.date},${r.giftCode || ''}`
    );
    return [header, ...rows].join('\n');
  }
  if (type === 'transfers') {
    const header = 'ID,User ID,User Name,Bank Name,Account,IFSC,Amount,Status,Date,Approved By';
    const rows = TRANSFER_REQUESTS.map(r =>
      `${r.id},${r.userId},${r.userName},${r.bankName},${r.account},${r.ifsc},${r.amount},${r.status},${r.date},${r.approvedBy || ''}`
    );
    return [header, ...rows].join('\n');
  }
  return '';
}

function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [selected, setSelected] = useState<ReportType | null>(null);
  const [from, setFrom]         = useState('2026-01-01');
  const [to,   setTo]           = useState('2026-03-31');
  const [downloaded, setDownloaded] = useState<ReportType | null>(null);

  const generate = (type: ReportType) => {
    const csv      = buildCsv(type);
    const filename = `gliacircle-${type}-report-${from}-to-${to}.csv`;
    downloadCsv(filename, csv);
    setDownloaded(type);
    setTimeout(() => setDownloaded(null), 3000);
  };

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div className="admin-page-title">Reports</div>
        <div className="admin-page-sub">Generate and download CSV reports for the ambassador program</div>
      </div>

      {/* Date range */}
      <div className="admin-table-wrap" style={{ marginBottom: 24, padding: '20px 24px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1740', marginBottom: 14 }}>Date Range</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label className="admin-label">From</label>
            <input className="admin-input" type="date" value={from} onChange={e => setFrom(e.target.value)} style={{ width: 180 }} />
          </div>
          <div>
            <label className="admin-label">To</label>
            <input className="admin-input" type="date" value={to} onChange={e => setTo(e.target.value)} style={{ width: 180 }} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            {[
              { label: 'Last 30d',   f: () => { const d = new Date(); const p = new Date(); p.setDate(d.getDate() - 30); setFrom(p.toISOString().slice(0,10)); setTo(d.toISOString().slice(0,10)); } },
              { label: 'This month', f: () => { const d = new Date(); setFrom(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-01`); setTo(d.toISOString().slice(0,10)); } },
              { label: 'This year',  f: () => { const d = new Date(); setFrom(`${d.getFullYear()}-01-01`); setTo(d.toISOString().slice(0,10)); } },
            ].map(p => (
              <button key={p.label} className="btn btn-ghost btn-sm" onClick={p.f}>{p.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Report cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
        {REPORT_OPTIONS.map(r => (
          <div
            key={r.type}
            style={{ background: 'white', border: `2px solid ${selected === r.type ? '#7B72E8' : '#E8E6F8'}`, borderRadius: 14, padding: '18px 20px', cursor: 'pointer', transition: 'border-color 0.13s' }}
            onClick={() => setSelected(r.type)}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: selected === r.type ? '#7B72E818' : '#F5F4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={r.icon} size={20} color={selected === r.type ? '#7B72E8' : '#A8A5C8'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1A1740', marginBottom: 3 }}>{r.label}</div>
                <div style={{ fontSize: 12.5, color: '#6B6880', lineHeight: 1.4 }}>{r.desc}</div>
              </div>
              {selected === r.type && <Icon name="check" size={16} color="#7B72E8" />}
            </div>

            {downloaded === r.type && (
              <div style={{ background: '#EDFFF4', border: '1px solid #A0E4B8', borderRadius: 8, padding: '8px 12px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#1A8C3C' }}>
                <Icon name="check" size={13} color="#1A8C3C" /> Download started!
              </div>
            )}

            <button
              className="btn btn-primary btn-sm"
              style={{ width: '100%' }}
              onClick={e => { e.stopPropagation(); generate(r.type); }}
            >
              <Icon name="download" size={13} color="white" /> Download CSV
            </button>
          </div>
        ))}
      </div>

      {/* Quick summary */}
      <div className="admin-table-wrap" style={{ marginTop: 28 }}>
        <div className="admin-table-header">
          <span className="admin-table-title">Quick Summary</span>
        </div>
        <div style={{ padding: '16px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
            {[
              { l: 'Total Ambassadors', v: fmt(ADMIN_STATS.totalUsers) },
              { l: 'Valid Points',       v: fmt(ADMIN_STATS.currentValidPoints) },
              { l: 'Lifetime Earned',    v: fmt(ADMIN_STATS.lifetimeEarned) },
              { l: 'Consumed',           v: fmt(ADMIN_STATS.consumedPoints) },
              { l: 'Expired',            v: fmt(ADMIN_STATS.expiredPoints) },
              { l: 'Monthly Awarded',    v: fmt(ADMIN_STATS.monthlyAwarded) },
              { l: 'Monthly Redeemed',   v: fmt(ADMIN_STATS.monthlyRedeemed) },
              { l: 'Pending Requests',   v: String(ADMIN_STATS.pendingBankTransfers + ADMIN_STATS.pendingEGift) },
            ].map(s => (
              <div key={s.l} style={{ background: '#FAFAFE', border: '1px solid #E8E6F8', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: '#A8A5C8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>{s.l}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#1A1740', fontFamily: 'JetBrains Mono, monospace' }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
