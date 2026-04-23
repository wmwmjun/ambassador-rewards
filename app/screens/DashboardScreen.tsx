'use client';
import Icon from '../components/Icon';
import Avatar from '../components/Avatar';
import TxRow from '../components/TxRow';
import { MOCK_BALANCE, MOCK_EXPIRY, MOCK_HISTORY } from '@/lib/mock';
import type { Screen } from '../page';

export default function DashboardScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const fmt = (n: number) => n.toLocaleString('en-IN');

  return (
    <div className="screen screen-enter">
      {/* Gradient hero */}
      <div className="screen-hero" style={{ background: 'linear-gradient(150deg,#91C6FF 0%,#A29AFF 50%,#C466E8 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Good morning,</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'white' }}>Rahul</div>
          </div>
          <Avatar initial="R" size={42} />
        </div>

        {/* Balance card */}
        <div style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)', borderRadius: 20, padding: '18px 20px', border: '1px solid rgba(255,255,255,0.3)' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 3, fontWeight: 500 }}>Your balance</div>
          <div style={{ fontSize: 44, fontWeight: 800, color: 'white', letterSpacing: '-0.025em', lineHeight: 1 }}>
            {fmt(MOCK_BALANCE.current)}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 3 }}>
            points · ≈ ₹{fmt(MOCK_BALANCE.current)}
          </div>
          {MOCK_BALANCE.expiring > 0 && (
            <div style={{ marginTop: 12, background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="alert" size={14} color="rgba(255,255,255,0.9)" />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                {fmt(MOCK_BALANCE.expiring)} pts expiring within 30 days
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content — two columns on desktop, single column on mobile */}
      <div className="page">
        <div className="dashboard-panels">

          {/* Left panel: stats + CTA */}
          <div className="dashboard-panel dashboard-panel-left">
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {[
                { label: 'Total earned', val: fmt(MOCK_BALANCE.earned), grad: false },
                { label: 'Used',         val: fmt(MOCK_BALANCE.used),   grad: false },
                { label: 'Expiring',     val: fmt(MOCK_BALANCE.expiring), grad: true },
              ].map(s => (
                <div key={s.label} className="card" style={{ padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, color: '#6B6880', marginBottom: 4 }}>{s.label}</div>
                  {s.grad
                    ? <div className="grad-text" style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em' }}>{s.val}</div>
                    : <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em', color: '#1A1740' }}>{s.val}</div>
                  }
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => onNavigate('redeem')}
              style={{ width: '100%', height: 52, borderRadius: 999, border: 'none', background: 'linear-gradient(135deg,#A29AFF,#E66BFF)', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <Icon name="gift" size={20} color="white" />
              Redeem points
            </button>
          </div>

          {/* Right panel: expiry + recent activity */}
          <div className="dashboard-panel dashboard-panel-right">
            {/* Expiry */}
            <div>
              <div className="section-label">Expiring soon</div>
              <div className="card" style={{ overflow: 'hidden' }}>
                {MOCK_EXPIRY.map((e, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderTop: i > 0 ? '1px solid #F5F4FF' : 'none' }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#1A1740' }}>{fmt(e.pts)} pts</span>
                    <span style={{ fontSize: 12, color: '#A8A5C8' }}>Expires {e.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div className="section-label" style={{ marginBottom: 0 }}>Recent activity</div>
                <button
                  onClick={() => onNavigate('history')}
                  className="grad-text"
                  style={{ fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit', background: 'none' }}
                >
                  See all
                </button>
              </div>
              <div className="card" style={{ overflow: 'hidden' }}>
                {MOCK_HISTORY.slice(0, 5).map((h, i) => (
                  <TxRow key={h.id} item={h} first={i === 0} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
