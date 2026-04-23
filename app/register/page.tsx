'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import Icon from '@/app/components/Icon';

type Step = 1 | 2 | 3;

interface FormData {
  firstName: string; lastName: string; email: string; password: string;
  confirmPassword: string; contact: string; dob: string;
  college: string; year: string; photo: File | null;
  pan: string; panFile: File | null;
  terms: boolean;
}

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'];

const PAN_RE   = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[6-9]\d{9}$/;

export default function RegisterPage() {
  const [step, setStep]         = useState<Step>(1);
  const [done, setDone]         = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [panFileName, setPanFileName]   = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const panRef   = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    contact: '', dob: '', college: '', year: '', photo: null,
    pan: '', panFile: null, terms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData | 'general', string>>>({});

  const set = (k: keyof FormData, v: string | boolean | File | null) =>
    setForm(f => ({ ...f, [k]: v }));

  const clearErr = (k: keyof FormData) =>
    setErrors(e => { const n = { ...e }; delete n[k]; return n; });

  // ── Validation per step ───────────────────────────────────────
  function validateStep1() {
    const e: typeof errors = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim())  e.lastName  = 'Required';
    if (!form.email.trim())     e.email     = 'Required';
    else if (!EMAIL_RE.test(form.email)) e.email = 'Invalid email format';
    if (!form.password)         e.password  = 'Required';
    else if (form.password.length < 8) e.password = 'Minimum 8 characters';
    else if (!/[A-Z]/.test(form.password)) e.password = 'Must contain an uppercase letter';
    else if (!/[0-9]/.test(form.password)) e.password = 'Must contain a number';
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match';
    const ph = form.contact.replace(/\D/g, '');
    if (!ph) e.contact = 'Required';
    else if (!PHONE_RE.test(ph)) e.contact = 'Enter a valid 10-digit mobile number';
    if (!form.dob)     e.dob     = 'Required';
    if (!form.college.trim()) e.college = 'Required';
    if (!form.year)    e.year    = 'Select year of study';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2() {
    const e: typeof errors = {};
    const pan = form.pan.toUpperCase().trim();
    if (!pan)            e.pan = 'Required';
    else if (!PAN_RE.test(pan)) e.pan = 'Invalid PAN format (e.g. ABCDE1234F)';
    if (!form.panFile)   e.panFile = 'Please upload your PAN card';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep3() {
    const e: typeof errors = {};
    if (!form.terms) e.terms = 'You must agree to continue';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) setStep(3);
    if (step === 3 && validateStep3()) setDone(true);
  }

  function back() { if (step > 1) setStep((step - 1) as Step); }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { setErrors(er => ({ ...er, photo: 'File must be under 5 MB' })); return; }
    set('photo', f);
    setPhotoPreview(URL.createObjectURL(f));
    clearErr('photo');
  }

  function handlePan(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { setErrors(er => ({ ...er, panFile: 'File must be under 5 MB' })); return; }
    if (!['image/jpeg','image/png','application/pdf'].includes(f.type)) {
      setErrors(er => ({ ...er, panFile: 'Only JPG, PNG or PDF allowed' }));
      return;
    }
    set('panFile', f);
    setPanFileName(f.name);
    clearErr('panFile');
  }

  const stepLabels = ['Personal info', 'Verification', 'Review & terms'];
  const Field = ({ label, name, type = 'text', placeholder = '', mono = false }: {
    label: string; name: keyof FormData; type?: string; placeholder?: string; mono?: boolean;
  }) => (
    <div className="reg-field-group">
      <label className="reg-label">{label} <span style={{ color: '#E85248' }}>*</span></label>
      <input
        type={type}
        value={form[name] as string}
        onChange={e => { set(name, e.target.value); clearErr(name); }}
        placeholder={placeholder}
        className={`reg-input${errors[name] ? ' error' : ''}`}
        style={mono ? { fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em' } : {}}
      />
      {errors[name] && <div className="reg-error">{errors[name]}</div>}
    </div>
  );

  // ── Success screen ────────────────────────────────────────────
  if (done) return (
    <div className="reg-root">
      <div className="reg-card" style={{ textAlign: 'center', padding: '48px 40px' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#A29AFF,#E66BFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Icon name="check" size={32} color="white" />
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#1A1740', marginBottom: 8 }}>Welcome, {form.firstName}!</div>
        <div style={{ fontSize: 14, color: '#A8A5C8', marginBottom: 32, lineHeight: 1.6 }}>
          Your account has been created. A confirmation email has been sent to <strong>{form.email}</strong>.
        </div>
        <Link href="/" style={{ display: 'block', width: '100%', height: 50, borderRadius: 12, background: 'linear-gradient(135deg,#A29AFF,#E66BFF)', color: 'white', fontSize: 15, fontWeight: 700, textDecoration: 'none', lineHeight: '50px', textAlign: 'center' }}>
          Go to Dashboard
        </Link>
      </div>
    </div>
  );

  return (
    <div className="reg-root">
      <div className="reg-card">
        {/* Logo */}
        <div style={{ marginBottom: 24 }}>
          <div className="grad-text" style={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>GliaCircle</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1A1740', marginTop: 16 }}>Create your account</div>
          <div style={{ fontSize: 13, color: '#A8A5C8', marginTop: 2 }}>Join the Ambassador program</div>
        </div>

        {/* Step bar */}
        <div style={{ marginBottom: 28 }}>
          <div className="reg-step-bar">
            {stepLabels.map((_, i) => (
              <>
                <div key={`dot-${i}`} className={`reg-step-dot ${i + 1 < step ? 'done' : i + 1 === step ? 'active' : 'idle'}`}>
                  {i + 1 < step ? <Icon name="check" size={13} color="white" sw={2.5} /> : i + 1}
                </div>
                {i < stepLabels.length - 1 && (
                  <div key={`line-${i}`} className={`reg-step-line${i + 1 < step ? ' done' : ''}`} />
                )}
              </>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            {stepLabels.map((l, i) => (
              <div key={l} className="reg-step-label" style={{ color: i + 1 === step ? '#7B72E8' : '#A8A5C8' }}>{l}</div>
            ))}
          </div>
        </div>

        {/* ── Step 1: Personal Info ─────────────────────────────── */}
        {step === 1 && (
          <>
            <div className="reg-grid-2">
              <Field label="First name" name="firstName" placeholder="Rahul" />
              <Field label="Last name"  name="lastName"  placeholder="Sharma" />
            </div>
            <Field label="Email address" name="email" type="email" placeholder="you@example.com" />
            <Field label="Password (min 8 chars, 1 uppercase, 1 number)" name="password" type="password" />
            <Field label="Confirm password" name="confirmPassword" type="password" />
            <Field label="Contact number" name="contact" placeholder="9876543210" />
            <Field label="Date of birth" name="dob" type="date" />
            <Field label="College / University" name="college" placeholder="Delhi University" />

            <div className="reg-field-group">
              <label className="reg-label">Year of study <span style={{ color: '#E85248' }}>*</span></label>
              <select
                value={form.year}
                onChange={e => { set('year', e.target.value); clearErr('year'); }}
                className={`reg-select${errors.year ? ' error' : ''}`}
              >
                <option value="">Select year…</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              {errors.year && <div className="reg-error">{errors.year}</div>}
            </div>

            {/* Photo upload (optional) */}
            <div className="reg-field-group">
              <label className="reg-label">Profile photo <span style={{ color: '#A8A5C8', fontWeight: 400 }}>(optional)</span></label>
              <div className="reg-upload-zone" onClick={() => photoRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', textAlign: 'left' }}>
                {photoPreview
                  ? <img src={photoPreview} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  : <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#E8E6F8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="user" size={22} color="#A8A5C8" /></div>
                }
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1A1740' }}>{photoPreview ? 'Change photo' : 'Upload photo'}</div>
                  <div style={{ fontSize: 11.5, color: '#A8A5C8', marginTop: 2 }}>JPG or PNG, max 5 MB</div>
                </div>
                <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
              </div>
              {errors.photo && <div className="reg-error">{errors.photo}</div>}
            </div>
          </>
        )}

        {/* ── Step 2: Verification ─────────────────────────────── */}
        {step === 2 && (
          <>
            <div style={{ background: '#F3F2FF', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#5A52C5', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <Icon name="shield" size={16} color="#7B72E8" sw={2} />
              <span>Your PAN details are encrypted and used only for tax compliance and bank transfer verification.</span>
            </div>

            <div className="reg-field-group">
              <label className="reg-label">PAN number <span style={{ color: '#E85248' }}>*</span></label>
              <input
                type="text"
                value={form.pan}
                onChange={e => { set('pan', e.target.value.toUpperCase()); clearErr('pan'); }}
                placeholder="ABCDE1234F"
                maxLength={10}
                className={`reg-input${errors.pan ? ' error' : ''}`}
                style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em', textTransform: 'uppercase' }}
              />
              {errors.pan && <div className="reg-error">{errors.pan}</div>}
            </div>

            <div className="reg-field-group">
              <label className="reg-label">PAN card upload <span style={{ color: '#E85248' }}>*</span></label>
              <div
                className={`reg-upload-zone${errors.panFile ? '' : ''}`}
                onClick={() => panRef.current?.click()}
                style={{ borderColor: errors.panFile ? '#E85248' : undefined }}
              >
                {panFileName ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                    <Icon name="file-text" size={20} color="#7B72E8" />
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: '#7B72E8' }}>{panFileName}</span>
                  </div>
                ) : (
                  <>
                    <Icon name="upload" size={24} color="#A8A5C8" />
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1A1740', marginTop: 8 }}>Click to upload PAN card</div>
                    <div style={{ fontSize: 11.5, color: '#A8A5C8', marginTop: 4 }}>JPG, PNG or PDF · Max 5 MB</div>
                  </>
                )}
                <input ref={panRef} type="file" accept="image/jpeg,image/png,application/pdf" onChange={handlePan} style={{ display: 'none' }} />
              </div>
              {errors.panFile && <div className="reg-error">{errors.panFile}</div>}
            </div>
          </>
        )}

        {/* ── Step 3: Review & Terms ────────────────────────────── */}
        {step === 3 && (
          <>
            <div className="reg-field-group">
              <div style={{ background: '#FAFAFE', borderRadius: 14, border: '1px solid #E8E6F8', overflow: 'hidden' }}>
                {[
                  { label: 'Name',    val: `${form.firstName} ${form.lastName}` },
                  { label: 'Email',   val: form.email },
                  { label: 'Contact', val: form.contact },
                  { label: 'College', val: `${form.college} · ${form.year}` },
                  { label: 'DOB',     val: form.dob },
                  { label: 'PAN',     val: form.pan, mono: true },
                ].map((r, i) => (
                  <div key={r.label} style={{ display: 'flex', padding: '11px 16px', borderTop: i > 0 ? '1px solid #F5F4FF' : 'none', gap: 12 }}>
                    <span style={{ width: 72, fontSize: 11.5, fontWeight: 600, color: '#A8A5C8', flexShrink: 0 }}>{r.label}</span>
                    <span style={{ fontSize: 13.5, color: '#1A1740', fontFamily: r.mono ? 'JetBrains Mono, monospace' : 'inherit', letterSpacing: r.mono ? '0.04em' : 0, fontWeight: 500, wordBreak: 'break-all' }}>{r.val || '—'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', padding: '14px 16px', background: form.terms ? '#F3F2FF' : '#FAFAFE', borderRadius: 12, border: `1.5px solid ${form.terms ? '#A29AFF' : '#E8E6F8'}`, marginBottom: 4, transition: 'all 0.15s', userSelect: 'none' }}
              onClick={() => { set('terms', !form.terms); clearErr('terms'); }}
            >
              <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${form.terms ? '#A29AFF' : '#D0CEEA'}`, background: form.terms ? '#A29AFF' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all 0.15s' }}>
                {form.terms && <Icon name="check" size={12} color="white" sw={2.5} />}
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1A1740' }}>I agree to the Terms and Conditions</div>
                <div style={{ fontSize: 12, color: '#A8A5C8', marginTop: 2, lineHeight: 1.5 }}>
                  By registering, I confirm all information is accurate. Points may be forfeited if details are found to be incorrect.
                </div>
              </div>
            </div>
            {errors.terms && <div className="reg-error" style={{ marginBottom: 8 }}>{errors.terms}</div>}
          </>
        )}

        {/* Navigation buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>
          <button className="reg-btn" onClick={next}>
            {step === 3 ? 'Create account' : 'Continue'}
          </button>
          {step > 1
            ? <button className="reg-btn-ghost" onClick={back}>Back</button>
            : <Link href="/" style={{ display: 'block', textAlign: 'center', fontSize: 13.5, color: '#A8A5C8', marginTop: 4, textDecoration: 'none' }}>Already have an account? Sign in</Link>
          }
        </div>
      </div>
    </div>
  );
}
