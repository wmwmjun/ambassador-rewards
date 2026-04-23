'use client';
import { useState, useCallback } from 'react';
import DashboardScreen from './screens/DashboardScreen';
import RedeemScreen    from './screens/RedeemScreen';
import HistoryScreen   from './screens/HistoryScreen';
import ProfileScreen   from './screens/ProfileScreen';
import Icon from './components/Icon';
import Avatar from './components/Avatar';
import type { IconName } from './components/Icon';
import { MOCK_BALANCE } from '@/lib/mock';

export type Screen = 'dashboard' | 'redeem' | 'history' | 'profile';

const SIDEBAR_NAV: { id: Screen; label: string; icon: IconName }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'redeem',    label: 'Redeem',    icon: 'gift'      },
  { id: 'history',   label: 'History',   icon: 'clock'     },
  { id: 'profile',   label: 'Profile',   icon: 'user'      },
];

const BOTTOM_NAV: { id: Screen; label: string; icon: IconName }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'redeem',    label: 'Redeem',    icon: 'gift'      },
  { id: 'profile',   label: 'Profile',   icon: 'user'      },
];

const fmt = (n: number) => n.toLocaleString('en-IN');

export default function Home() {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const navigate = useCallback((s: Screen) => setScreen(s), []);

  const mobileActiveNav = screen === 'history' ? 'dashboard' : screen;

  const Screens = {
    dashboard: DashboardScreen,
    redeem:    RedeemScreen,
    history:   HistoryScreen,
    profile:   ProfileScreen,
  };
  const Active = Screens[screen];

  return (
    <div className="app-root">

      {/* ── Sidebar (desktop only) ──────────────────────────── */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="grad-text" style={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>GliaCircle</div>
          <div style={{ fontSize: 11, color: '#A8A5C8', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 4 }}>Ambassador</div>
        </div>

        {/* Nav items */}
        <nav className="sidebar-nav">
          {SIDEBAR_NAV.map(n => (
            <div
              key={n.id}
              className={`sidebar-nav-item${screen === n.id ? ' active' : ''}`}
              onClick={() => navigate(n.id)}
            >
              <Icon name={n.icon} size={19} color={screen === n.id ? '#7B72E8' : '#A8A5C8'} sw={screen === n.id ? 2.2 : 1.8} />
              {n.label}
            </div>
          ))}
        </nav>

        {/* Balance preview */}
        <div className="sidebar-balance">
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Your balance</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'white', letterSpacing: '-0.025em', lineHeight: 1 }}>
            {fmt(MOCK_BALANCE.current)}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
            points · ≈ ₹{fmt(MOCK_BALANCE.current)}
          </div>
        </div>

        {/* Demo links */}
        <div style={{ padding: '0 12px', marginTop: 'auto' }}>
          <a href="/register" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, textDecoration: 'none', color: '#A8A5C8', fontSize: 13.5, fontWeight: 600, marginBottom: 4 }}>
            <Icon name="user" size={17} color="#A8A5C8" sw={1.8} /> Register
          </a>
          <a href="/admin" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, textDecoration: 'none', color: '#A8A5C8', fontSize: 13.5, fontWeight: 600, marginBottom: 8 }}>
            <Icon name="shield" size={17} color="#A8A5C8" sw={1.8} /> Admin Panel
          </a>
        </div>

        {/* User */}
        <div className="sidebar-user">
          <Avatar initial="R" size={36} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1740', lineHeight: 1.2 }}>Rahul Sharma</div>
            <div style={{ fontSize: 11, color: '#A8A5C8', marginTop: 2 }}>Brand Ambassador</div>
          </div>
        </div>
      </aside>

      {/* ── Main content area ───────────────────────────────── */}
      <div className="main-area">

        {/* Status bar (mobile only) */}
        <div className="status-bar">
          <span className="status-time">9:41</span>
          <div className="status-icons">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="white" opacity="0.9">
              <rect x="0" y="3" width="3" height="9" rx="1"/>
              <rect x="4.5" y="2" width="3" height="10" rx="1"/>
              <rect x="9" y="0.5" width="3" height="11.5" rx="1"/>
              <rect x="13.5" y="0" width="2.5" height="12" rx="1" opacity="0.4"/>
            </svg>
            <svg width="15" height="12" viewBox="0 0 15 12" fill="none" stroke="white" strokeWidth="1.5" opacity="0.9">
              <path d="M1 4C3.7 1.3 11.3 1.3 14 4"/>
              <path d="M2.9 5.9C4.8 4 10.2 4 12.1 5.9"/>
              <path d="M4.8 7.8C5.9 6.7 9.1 6.7 10.2 7.8"/>
              <circle cx="7.5" cy="10" r="1" fill="white" stroke="none"/>
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
              <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.5"/>
              <rect x="2" y="2" width="16" height="8" rx="2" fill="white"/>
              <path d="M23 4v4a2 2 0 0 0 0-4z" fill="white" fillOpacity="0.5"/>
            </svg>
          </div>
        </div>

        {/* Screen */}
        <div className="screen-wrap">
          <Active key={screen} onNavigate={navigate} />
        </div>

        {/* Bottom nav (mobile only) */}
        <div className="bottom-nav">
          {BOTTOM_NAV.map(n => {
            const isActive = mobileActiveNav === n.id;
            return (
              <div
                key={n.id}
                className={`nav-item${isActive ? ' nav-active' : ''}`}
                onClick={() => navigate(n.id)}
              >
                <Icon name={n.icon} size={24} color={isActive ? '#7B72E8' : '#A8A5C8'} sw={isActive ? 2 : 1.8} />
                <span className="nav-label">{n.label}</span>
                <div className="nav-dot" style={{ background: isActive ? '#A29AFF' : 'transparent' }} />
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
