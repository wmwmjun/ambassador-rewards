'use client';
import { useState } from 'react';
import TxRow from '../components/TxRow';
import { MOCK_HISTORY } from '@/lib/mock';

export default function HistoryScreen() {
  const [tab, setTab] = useState<'redemptions' | 'points'>('redemptions');
  const [expanded, setExpanded] = useState<number | null>(null);

  const redemptions = MOCK_HISTORY.filter(h => h.type !== 'award');

  // Compute running balance (newest-first display, oldest-first calculation)
  let bal = 124500;
  const withBal = [...MOCK_HISTORY].reverse().map(h => {
    const balance = bal;
    bal -= h.pts;
    return { ...h, balance };
  }).reverse();

  return (
    <div className="screen screen-enter">
      <div style={{ background: 'linear-gradient(150deg,#91C6FF,#A29AFF)', padding: '60px 20px 24px' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'white' }}>History</div>
      </div>

      <div className="page">
        {/* Tabs */}
        <div style={{ background: 'white', borderRadius: 14, padding: 4, display: 'flex', gap: 4, border: '1px solid #E8E6F8' }}>
          {([['redemptions', 'Redemptions'], ['points', 'Point history']] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{ flex: 1, padding: '9px', borderRadius: 10, border: 'none', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', ...(tab === id ? { background: 'linear-gradient(135deg,#A29AFF,#E66BFF)', color: 'white' } : { background: 'transparent', color: '#6B6880' }) }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Redemptions */}
        {tab === 'redemptions' && (
          <div className="card" style={{ overflow: 'hidden' }}>
            {redemptions.map((h, i) => (
              <TxRow
                key={h.id}
                item={h}
                first={i === 0}
                onClick={() => setExpanded(expanded === h.id ? null : h.id)}
                expanded={expanded === h.id}
              />
            ))}
          </div>
        )}

        {/* Point history table */}
        {tab === 'points' && (
          <div style={{ background: 'white', borderRadius: 18, overflow: 'hidden', border: '1px solid #E8E6F8' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto auto', padding: '10px 14px', borderBottom: '1px solid #F5F4FF', gap: 8 }}>
              {['Date', 'Description', 'Pts', 'Bal'].map(h => (
                <div key={h} style={{ fontSize: 10, fontWeight: 600, color: '#A8A5C8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</div>
              ))}
            </div>
            {withBal.map((h, i) => (
              <div key={h.id} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto auto', padding: '11px 14px', gap: 8, borderTop: i > 0 ? '1px solid #F5F4FF' : 'none', alignItems: 'center' }}>
                <div style={{ fontSize: 11, color: '#A8A5C8' }}>{h.date.split(' ').slice(0, 2).join(' ')}</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#1A1740', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.title}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: h.pts > 0 ? '#1A8C3C' : '#C0281E', textAlign: 'right' }}>
                  {h.pts > 0 ? '+' : ''}{h.pts.toLocaleString()}
                </div>
                <div style={{ fontSize: 12, color: '#1A1740', textAlign: 'right', fontWeight: 500 }}>
                  {h.balance.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
