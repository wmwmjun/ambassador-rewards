'use client';
import { useState } from 'react';
import Icon from '../components/Icon';
import { EGIFTS, MOCK_BANK, MOCK_BALANCE } from '@/lib/mock';
import type { EGift } from '@/lib/types';
import type { Screen } from '../page';

type Modal = null | 'egift-confirm' | 'egift-success';

export default function RedeemScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [tab, setTab] = useState<'egift' | 'bank'>('egift');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [detail, setDetail] = useState<EGift | null>(null);
  const [selVal, setSelVal] = useState<number | null>(null);
  const [modal, setModal] = useState<Modal>(null);
  const [bankAmt, setBankAmt] = useState('');

  const fmt = (n: number) => n.toLocaleString('en-IN');
  const cats = ['All', 'Shopping', 'Entertainment'];
  const filtered = EGIFTS.filter(g =>
    (category === 'All' || g.cat === category) &&
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const openDetail = (g: EGift) => { setDetail(g); setSelVal(g.values[0]); };

  // ── Detail view ──────────────────────────────────────────────
  if (detail) return (
    <div className="screen screen-enter" style={{ position: 'relative' }}>
      <div style={{ background: detail.bg, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 48, left: 16 }}>
          <button onClick={() => setDetail(null)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 999, padding: '5px 14px', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            ‹ Back
          </button>
        </div>
        <div style={{ fontSize: 36, fontWeight: 900, color: detail.fg }}>{detail.name}</div>
      </div>

      <div className="page">
        <div className="card" style={{ padding: '16px 18px' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1A1740' }}>{detail.label}</div>
          <div style={{ fontSize: 13, color: '#A8A5C8', marginTop: 2 }}>{detail.cat} · India</div>
        </div>

        <div className="card" style={{ padding: '16px 18px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#A8A5C8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Select value</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {detail.values.map(v => (
              <button
                key={v}
                onClick={() => setSelVal(v)}
                style={{ padding: '8px 16px', borderRadius: 999, border: selVal === v ? '2px solid #A29AFF' : '1.5px solid #E8E6F8', background: selVal === v ? '#F3F2FF' : 'white', color: selVal === v ? '#7B72E8' : '#1A1740', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                ₹{fmt(v)}
              </button>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '14px 18px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#A8A5C8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Terms</div>
          <div style={{ fontSize: 13, color: '#6B6880', lineHeight: 1.5 }}>{detail.terms}</div>
        </div>

        <button
          onClick={() => setModal('egift-confirm')}
          style={{ width: '100%', height: 52, borderRadius: 999, border: 'none', background: 'linear-gradient(135deg,#A29AFF,#E66BFF)', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Redeem for ₹{selVal ? fmt(selVal) : ''}
        </button>
      </div>

      {/* Confirm modal */}
      {modal === 'egift-confirm' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1A1740', marginBottom: 4 }}>Confirm redemption</div>
            <div style={{ fontSize: 14, color: '#6B6880', marginBottom: 18 }}>Redeeming {detail.label} for ₹{fmt(selVal!)}</div>
            <div style={{ background: '#F5F4FF', borderRadius: 14, padding: '14px 16px', marginBottom: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: '#6B6880' }}>Gift card</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1740' }}>{detail.label}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: '#6B6880' }}>Value</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1740' }}>₹{fmt(selVal!)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: '#6B6880' }}>Points deducted</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#E66BFF' }}>−{selVal} pts</span>
              </div>
            </div>
            <button onClick={() => setModal('egift-success')} style={{ width: '100%', height: 52, borderRadius: 999, border: 'none', background: 'linear-gradient(135deg,#A29AFF,#E66BFF)', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 10 }}>
              Confirm
            </button>
            <button onClick={() => setModal(null)} style={{ width: '100%', height: 44, borderRadius: 999, border: '1.5px solid #E8E6F8', background: 'transparent', color: '#6B6880', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Success modal */}
      {modal === 'egift-success' && (
        <div className="modal-overlay">
          <div className="modal-sheet">
            <div className="modal-handle" />
            <div style={{ textAlign: 'center', paddingBottom: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#A29AFF,#E66BFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Icon name="check" size={28} color="white" />
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#1A1740', marginBottom: 6 }}>Gift card issued!</div>
              <div style={{ fontSize: 14, color: '#6B6880', marginBottom: 20 }}>Sent to rahul.sharma@example.com</div>
            </div>
            <div style={{ background: '#F5F4FF', borderRadius: 14, padding: '14px 16px', marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: '#6B6880', marginBottom: 6, fontWeight: 500 }}>Your gift code</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 15, fontWeight: 500, color: '#1A1740', letterSpacing: '0.04em' }}>AMZN-7X4K-9P2M</span>
                <button
                  onClick={() => navigator.clipboard.writeText('AMZN-7X4K-9P2M')}
                  style={{ padding: '6px 12px', borderRadius: 8, background: 'linear-gradient(135deg,#A29AFF,#E66BFF)', border: 'none', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Icon name="copy" size={12} color="white" /> Copy
                </button>
              </div>
            </div>
            <button
              onClick={() => { setModal(null); setDetail(null); onNavigate('history'); }}
              style={{ width: '100%', height: 52, borderRadius: 999, border: 'none', background: '#1A1740', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              View in history
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // ── Main Redeem view ─────────────────────────────────────────
  return (
    <div className="screen screen-enter">
      <div style={{ background: 'linear-gradient(150deg,#A29AFF,#E66BFF)', padding: '60px 20px 20px' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 2 }}>Redeem</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
          Balance: <strong style={{ color: 'white' }}>{fmt(MOCK_BALANCE.current)} pts</strong>
        </div>
      </div>

      <div className="page">
        {/* Tabs */}
        <div style={{ background: 'white', borderRadius: 14, padding: 4, display: 'flex', gap: 4, border: '1px solid #E8E6F8' }}>
          {(['egift', 'bank'] as const).map((id) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{ flex: 1, padding: '9px', borderRadius: 10, border: 'none', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', ...(tab === id ? { background: 'linear-gradient(135deg,#A29AFF,#E66BFF)', color: 'white' } : { background: 'transparent', color: '#6B6880' }) }}
            >
              {id === 'egift' ? 'eGift Card' : 'Bank Transfer'}
            </button>
          ))}
        </div>

        {/* eGift tab */}
        {tab === 'egift' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'white', borderRadius: 12, padding: '0 14px', border: '1px solid #E8E6F8', height: 44 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A8A5C8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search brands..."
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, fontFamily: 'Albert Sans, sans-serif', color: '#1A1740', background: 'transparent' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
              {cats.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  style={{ flexShrink: 0, padding: '6px 16px', borderRadius: 999, border: category === c ? 'none' : '1px solid #E8E6F8', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: category === c ? 'linear-gradient(135deg,#A29AFF,#E66BFF)' : 'white', color: category === c ? 'white' : '#6B6880' }}
                >
                  {c}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {filtered.map(g => (
                <div
                  key={g.id}
                  onClick={() => openDetail(g)}
                  style={{ background: 'white', borderRadius: 14, overflow: 'hidden', border: '1px solid #E8E6F8', cursor: 'pointer' }}
                >
                  <div style={{ background: g.bg, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: g.fg }}>{g.name}</span>
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1740' }}>{g.label}</div>
                    <div style={{ fontSize: 11, color: '#A8A5C8', marginTop: 2 }}>{g.range}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Bank tab */}
        {tab === 'bank' && (
          <>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 11, color: '#A8A5C8', marginBottom: 4, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Linked account</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1A1740' }}>{MOCK_BANK.name}</div>
              <div style={{ fontSize: 13, color: '#6B6880' }}>{MOCK_BANK.bankName} · {MOCK_BANK.account}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#A8A5C8', marginTop: 2 }}>{MOCK_BANK.ifsc}</div>
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#6B6880', marginBottom: 6 }}>
                Amount<span style={{ color: '#E85248' }}>*</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: 14, border: '2px solid #A29AFF', overflow: 'hidden' }}>
                <span style={{ padding: '0 14px', fontSize: 20, fontWeight: 700, color: '#A8A5C8' }}>₹</span>
                <input
                  value={bankAmt}
                  onChange={e => setBankAmt(e.target.value)}
                  placeholder="50,000"
                  type="number"
                  style={{ flex: 1, height: 52, border: 'none', outline: 'none', fontSize: 20, fontWeight: 700, fontFamily: 'Albert Sans, sans-serif', color: '#1A1740', background: 'transparent', paddingRight: 14 }}
                />
              </div>
              <div style={{ fontSize: 11, color: '#A8A5C8', marginTop: 5 }}>Minimum transfer: ₹50,000</div>
            </div>

            <button
              style={{ width: '100%', height: 52, borderRadius: 999, border: 'none', background: 'linear-gradient(135deg,#A29AFF,#E66BFF)', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Apply for transfer
            </button>
          </>
        )}
      </div>
    </div>
  );
}
