'use client';
import { useState, useRef } from 'react';
import Icon from '../components/Icon';
import { MOCK_BANK } from '@/lib/mock';
import type { BankAccount } from '@/lib/types';

const INFO_FIELDS = [
  { label: 'Email',           val: 'rahul.sharma@example.com' },
  { label: 'Contact number',  val: '+91 98765 43210' },
  { label: 'Date of birth',   val: '10 Jun 1996' },
  { label: 'College',         val: 'Delhi University' },
  { label: 'Year of study',   val: '3rd Year' },
  { label: 'PAN number',      val: 'ABCDE1234F', mono: true },
];

const BANK_FIELDS: { label: string; key: keyof BankAccount; mono?: boolean }[] = [
  { label: 'Beneficiary name', key: 'name' },
  { label: 'Bank name',        key: 'bankName' },
  { label: 'Account number',   key: 'account', mono: true },
  { label: 'IFSC code',        key: 'ifsc',    mono: true },
];

export default function ProfileScreen() {
  const [tab, setTab]             = useState<'info' | 'bank'>('info');
  const [photo, setPhoto]         = useState<string | null>(null);
  const [bank, setBank]           = useState<BankAccount>({ ...MOCK_BANK });
  const [bankDraft, setBankDraft] = useState<BankAccount>({ ...MOCK_BANK });
  const [editing, setEditing]     = useState(false);
  const [saved, setSaved]         = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setPhoto(URL.createObjectURL(f));
  };

  const startEdit  = () => { setBankDraft({ ...bank }); setEditing(true); setSaved(false); };
  const cancelEdit = () => { setBankDraft({ ...bank }); setEditing(false); };
  const saveEdit   = () => {
    setBank({ ...bankDraft });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="screen screen-enter">
      {/* Gradient header */}
      <div style={{ background: 'linear-gradient(150deg,#A29AFF,#E66BFF,#FFA29B)', padding: '60px 20px 28px' }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'white' }}>Profile</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Photo upload */}
          <div
            onClick={() => fileRef.current?.click()}
            style={{ position: 'relative', flexShrink: 0, cursor: 'pointer' }}
          >
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: photo ? 'transparent' : 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: 'white', border: '2px solid rgba(255,255,255,0.5)', overflow: 'hidden' }}>
              {photo
                ? <img src={photo} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : 'R'}
            </div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 18, height: 18, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#A29AFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
          </div>

          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>Rahul Sharma</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>rahul.sharma@example.com</div>
            <div style={{ marginTop: 5 }}>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.25)', color: 'white' }}>
                Delhi University · 3rd Year
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="page">
        {/* Tabs */}
        <div style={{ background: 'white', borderRadius: 14, padding: 4, display: 'flex', gap: 4, border: '1px solid #E8E6F8' }}>
          {([['info', 'Personal info'], ['bank', 'Bank details']] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{ flex: 1, padding: '9px', borderRadius: 10, border: 'none', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', ...(tab === id ? { background: 'linear-gradient(135deg,#A29AFF,#E66BFF)', color: 'white' } : { background: 'transparent', color: '#6B6880' }) }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Personal info */}
        {tab === 'info' && (
          <div className="card" style={{ overflow: 'hidden' }}>
            {INFO_FIELDS.map((f, i) => (
              <div key={f.label} style={{ padding: '13px 18px', borderTop: i > 0 ? '1px solid #F5F4FF' : 'none' }}>
                <div style={{ fontSize: 11, color: '#A8A5C8', fontWeight: 500, marginBottom: 3 }}>{f.label}</div>
                <div style={{ fontSize: 15, fontWeight: 500, color: '#1A1740', fontFamily: f.mono ? 'JetBrains Mono, monospace' : 'inherit', letterSpacing: f.mono ? '0.04em' : 0 }}>
                  {f.val}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bank details */}
        {tab === 'bank' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {saved && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#F0FBF3', borderRadius: 12 }}>
                <Icon name="check" size={15} color="#34C759" />
                <span style={{ fontSize: 13, color: '#1A8C3C', fontWeight: 600 }}>Bank details updated</span>
              </div>
            )}

            <div className="card" style={{ overflow: 'hidden' }}>
              {BANK_FIELDS.map((f, i) => (
                <div key={f.label} style={{ padding: '13px 18px', borderTop: i > 0 ? '1px solid #F5F4FF' : 'none' }}>
                  <div style={{ fontSize: 11, color: '#A8A5C8', fontWeight: 500, marginBottom: 4 }}>{f.label}</div>
                  {editing ? (
                    <input
                      value={bankDraft[f.key]}
                      onChange={e => setBankDraft(d => ({ ...d, [f.key]: e.target.value }))}
                      style={{ width: '100%', border: '1.5px solid #A29AFF', borderRadius: 8, padding: '8px 12px', fontSize: 15, fontFamily: f.mono ? 'JetBrains Mono, monospace' : 'Albert Sans, sans-serif', color: '#1A1740', outline: 'none', background: 'white' }}
                    />
                  ) : (
                    <div style={{ fontSize: 15, fontWeight: 500, color: '#1A1740', fontFamily: f.mono ? 'JetBrains Mono, monospace' : 'inherit', letterSpacing: f.mono ? '0.04em' : 0 }}>
                      {bank[f.key]}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', background: '#F0FBF3', borderRadius: 12 }}>
                  <Icon name="check" size={16} color="#34C759" />
                  <div style={{ fontSize: 12, color: '#1A8C3C', lineHeight: 1.5 }}>Bank account verified and linked for transfers</div>
                </div>
                <button
                  onClick={startEdit}
                  style={{ width: '100%', height: 48, borderRadius: 999, border: 'none', background: 'linear-gradient(135deg,#A29AFF,#E66BFF)', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  <Icon name="edit" size={16} color="white" /> Edit bank details
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={saveEdit}   style={{ flex: 2, height: 48, borderRadius: 999, border: 'none', background: 'linear-gradient(135deg,#A29AFF,#E66BFF)', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Complete</button>
                <button onClick={cancelEdit} style={{ flex: 1, height: 48, borderRadius: 999, border: '1.5px solid #E8E6F8', background: 'white', color: '#6B6880', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
