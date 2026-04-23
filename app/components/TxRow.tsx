'use client';
import Icon from './Icon';
import StatusBadge from './StatusBadge';
import type { Transaction } from '@/lib/types';

const txStyle: Record<string, { bg: string; icon: 'card' | 'wallet' | 'bank'; color: string }> = {
  egift: { bg: '#FDF2FF', icon: 'card',   color: '#A830C4' },
  award: { bg: '#F3F2FF', icon: 'wallet', color: '#7B72E8' },
  bank:  { bg: '#EFF7FF', icon: 'bank',   color: '#1A6FC5' },
};

interface TxRowProps {
  item: Transaction;
  first?: boolean;
  onClick?: () => void;
  expanded?: boolean;
}

export default function TxRow({ item, first, onClick, expanded }: TxRowProps) {
  const s = txStyle[item.type];
  return (
    <div>
      <div
        onClick={onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '13px 16px',
          gap: 12,
          borderTop: first ? 'none' : '1px solid #F5F4FF',
          cursor: onClick ? 'pointer' : 'default',
        }}
      >
        <div style={{ width: 38, height: 38, borderRadius: 11, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name={s.icon} size={18} color={s.color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1740', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.title}
          </div>
          <div style={{ fontSize: 11, color: '#A8A5C8', marginTop: 2 }}>{item.date}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: item.pts > 0 ? '#1A8C3C' : '#C0281E' }}>
            {item.pts > 0 ? '+' : ''}{item.pts.toLocaleString()}
          </div>
          <StatusBadge status={item.status} />
        </div>
      </div>

      {expanded && item.code && (
        <div style={{ background: '#F5F4FF', padding: '10px 16px 14px', borderTop: '1px solid #F5F4FF' }}>
          <div style={{ fontSize: 11, color: '#6B6880', marginBottom: 5 }}>Gift code</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 500, color: '#1A1740', letterSpacing: '0.04em' }}>
              {item.code}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(item.code!); }}
              style={{ padding: '5px 10px', borderRadius: 7, background: 'linear-gradient(135deg,#A29AFF,#E66BFF)', border: 'none', color: 'white', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <Icon name="copy" size={12} color="white" /> Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
