'use client';
import { useState, useCallback } from 'react';
import DashboardScreen from './screens/DashboardScreen';
import RedeemScreen from './screens/RedeemScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import Icon from './components/Icon';
import type { IconName } from './components/Icon';

export type Screen = 'dashboard' | 'redeem' | 'history' | 'profile';

const NAV: { id: Screen; label: string; icon: IconName }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'redeem',    label: 'Redeem',    icon: 'gift' },
  { id: 'profile',   label: 'Profile',   icon: 'user' },
];

export default function Home() {
  const [screen, setScreen] = useState<Screen>('dashboard');

  const navigate = useCallback((s: Screen) => setScreen(s), []);

  const activeNav = screen === 'history' ? 'dashboard' : screen;

  const Screens = { dashboard: DashboardScreen, redeem: RedeemScreen, history: HistoryScreen, profile: ProfileScreen };
  const Active = Screens[screen];

  return (
    <div className="phone-shell">
      {/* Status bar */}
      <div className="status-bar">
        <span className="status-time">9:41</span>
        <div className="status-icons">
          {/* Signal */}
          <svg width="16" height="12" viewBox="0 0 16 12" fill="white" opacity="0.9">
            <rect x="0" y="3" width="3" height="9" rx="1"/>
            <rect x="4.5" y="2" width="3" height="10" rx="1"/>
            <rect x="9" y="0.5" width="3" height="11.5" rx="1"/>
            <rect x="13.5" y="0" width="2.5" height="12" rx="1" opacity="0.4"/>
          </svg>
          {/* WiFi */}
          <svg width="15" height="12" viewBox="0 0 15 12" fill="none" stroke="white" strokeWidth="1.5" opacity="0.9">
            <path d="M1 4C3.7 1.3 11.3 1.3 14 4"/>
            <path d="M2.9 5.9C4.8 4 10.2 4 12.1 5.9"/>
            <path d="M4.8 7.8C5.9 6.7 9.1 6.7 10.2 7.8"/>
            <circle cx="7.5" cy="10" r="1" fill="white" stroke="none"/>
          </svg>
          {/* Battery */}
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.5"/>
            <rect x="2" y="2" width="16" height="8" rx="2" fill="white"/>
            <path d="M23 4v4a2 2 0 0 0 0-4z" fill="white" fillOpacity="0.5"/>
          </svg>
        </div>
      </div>

      {/* SVG gradient def for nav icons */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="navGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A29AFF"/>
            <stop offset="100%" stopColor="#E66BFF"/>
          </linearGradient>
        </defs>
      </svg>

      {/* Screen content */}
      <div className="screen-wrap">
        <Active key={screen} onNavigate={navigate} />
      </div>

      {/* Bottom navigation */}
      <div className="bottom-nav">
        {NAV.map(n => {
          const isActive = activeNav === n.id;
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
  );
}
