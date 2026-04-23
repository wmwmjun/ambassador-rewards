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

type Errors = Partial<Record<keyof FormData, string>>;

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'];
const PAN_RE   = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[6-9]\d{9}$/;

/* ─── Field component at module level (avoids remount-on-keypress) ─── */
interface FieldProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  mono?: boolean;
  maxLength?: number;
  transform?: (v: string) => string;
}
function Field({ label, required = true, value, onChange, error, type = 'text', placeholder = '', mono = false, maxLength, transform }: FieldProps) {
  return (
    <div className="reg-field-group">
      <label className="reg-label">
        {label} {required ? <span style={{ color: '#E85248' }}>*</span> : <span style={{ color: '#A8A5C8', fontWeight: 400 }}>(optional)</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(transform ? transform(e.target.value) : e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`reg-input${error ? ' error' : ''}`}
        style={mono ? { fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.06em' } : {}}
      />
      {error && <div className="reg-error">{error}</div>}
    </div>
  );
}
/* ──────────────────────────────────────────────────────────────────── */

export default function RegisterPage() {
  const [step, setStep] = useState<Step>(1);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    contact: '', dob: '', college: '', year: '', photo: null,
    pan: '', panFile: null, terms: false,
  });
  const [errors, setErrors]         = useState<Errors>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [panFileName, setPanFileName]   = useState<string | null>(null);

  const photoRef = useRef<HTMLInputElement>(null);
  const panRef   = useRef<HTMLInputElement>(null);

  const set = (k: keyof FormData, v: string | boolean | File | null) =>
    setForm(f => ({ ...f, [k]: v }));

  const field = (k: keyof FormData) => ({
    value:    form[k] as string,
    onChange: (v: string) => { set(k, v); setErrors(e => { const n = { ...e }; delete n[k]; return n; }); },
    error:    errors[k],
  });

  /* ── Validation ── */
  function validateStep1() {
    const e: Errors = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim())  e.lastName  = 'Required';
    if (!form.email.trim())     e.email     = 'Required';
    else if (!EMAIL_RE.test(form.email)) e.email = 'Invalid email format';
    if (!form.password)         e.password  = 'Required';
    else if (form.password.length < 8)       e.password = 'Minimum 8 characters';
    else if (!/[A-Z]/.test(form.password))   e.password = 'Must contain an uppercase letter';
    else if (!/[0-9]/.test(form.password))   e.password = 'Must contain a number';
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match';
    const ph = form.contact.replace(/\D/g, '');
    if (!ph)                   e.contact = 'Required';
    else if (!PHONE_RE.test(ph)) e.contact = 'Enter a valid 10-digit mobile number';
    if (!form.dob)     e.dob     = 'Required';
    if (!form.college.trim()) e.college = 'Required';
    if (!form.year)    e.year    = 'Select year of study';
    if (!form.photo)   e.photo   = 'Profile photo is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2() {
    const e: Errors = {};
    const pan = form.pan.toUpperCase().trim();
    if (!pan)                 e.pan     = 'Required';
    else if (!PAN_RE.test(pan)) e.pan   = 'Invalid PAN format — e.g. ABCDE1234F';
    if (!form.panFile)        e.panFile = 'Please upload your PAN card image';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep3() {
    const e: Errors = {};
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

  /* ── File handlers ── */
  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { setErrors(er => ({ ...er, photo: 'File must be under 5 MB' })); return; }
    if (!['image/jpeg', 'image/png'].includes(f.type)) { setErrors(er => ({ ...er, photo: 'Only JPG or PNG allowed' })); return; }
    set('photo', f);
    setPhotoPreview(URL.createObjectURL(f));
    setErrors(er => { const n = { ...er }; delete n.photo; return n; });
  }

  function handlePanFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { setErrors(er => ({ ...er, panFile: 'File must be under 5 MB' })); return; }
    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(f.type)) {
      setErrors(er => ({ ...er, panFile: 'Only JPG, PNG or PDF allowed' }));
      return;
    }
    set('panFile', f);
    setPanFileName(f.name);
    setErrors(er => { const n = { ...er }; delete n.panFile; return n; });
  }

  const stepLabels = ['Personal info', 'PAN verification', 'Review & terms'];

  /* ── Success ── */
  if (done) return (
    <div className="reg-root">
      <div className="reg-card" style={{ textAlign: 'center', padding: '48px 40px' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#A29AFF,#E66BFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Icon name="check" size={32} color="white" />
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#1A1740', marginBottom: 8 }}>Application submitted!</div>
        <div style={{ fontSize: 14, color: '#6B6880', marginBottom: 8, lineHeight: 1.6 }}>
          Thank you, <strong style={{ color: '#1A1740' }}>{form.firstName}</strong>. Your application is under review.
        </div>
        <div style={{ background: '#F5F4FF', borderRadius: 10, padding: '12px 16px', marginBottom: 28, fontSize: 13, color: '#5A52C5' }}>
          You'll receive a confirmation at <strong>{form.email}</strong> once your account is approved — usually within 24 hours.
        </div>
        <Link href="/" style={{ display: 'block', width: '100%', height: 50, borderRadius: 12, background: 'linear-gradient(135deg,#A29AFF,#E66BFF)', color: 'white', fontSize: 15, fontWeight: 700, textDecoration: 'none', lineHeight: '50px', textAlign: 'center' }}>
          Back to Home
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
              <div key={i} style={{ display: 'contents' }}>
                <div className={`reg-step-dot ${i + 1 < step ? 'done' : i + 1 === step ? 'active' : 'idle'}`}>
                  {i + 1 < step ? <Icon name="check" size={13} color="white" sw={2.5} /> : i + 1}
                </div>
                {i < stepLabels.length - 1 && (
                  <div className={`reg-step-line${i + 1 < step ? ' done' : ''}`} />
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            {stepLabels.map((l, i) => (
              <div key={l} className="reg-step-label" style={{ color: i + 1 === step ? '#7B72E8' : '#A8A5C8' }}>{l}</div>
            ))}
          </div>
        </div>

        {/* ── Step 1: Personal Info ── */}
        {step === 1 && (
          <>
            <div className="reg-grid-2">
              <Field label="First name" {...field('firstName')} placeholder="Rahul" />
              <Field label="Last name"  {...field('lastName')}  placeholder="Sharma" />
            </div>
            <Field label="Email address" {...field('email')} type="email" placeholder="you@example.com" />
            <Field label="Password" {...field('password')} type="password" placeholder="Min 8 chars, 1 uppercase, 1 number" />
            <Field label="Confirm password" {...field('confirmPassword')} type="password" />
            <Field label="Contact number" {...field('contact')} placeholder="9876543210" />
            <Field label="Date of birth" {...field('dob')} type="date" />
            <Field label="College / University" {...field('college')} placeholder="Delhi University" />

            <div className="reg-field-group">
              <label className="reg-label">Year of study <span style={{ color: '#E85248' }}>*</span></label>
              <select
                value={form.year}
                onChange={e => { set('year', e.target.value); setErrors(er => { const n = { ...er }; delete n.year; return n; }); }}
                className={`reg-select${errors.year ? ' error' : ''}`}
              >
                <option value="">Select year…</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              {errors.year && <div className="reg-error">{errors.year}</div>}
            </div>

            {/* Profile photo — required */}
            <div className="reg-field-group">
              <label className="reg-label">Profile photo <span style={{ color: '#E85248' }}>*</span></label>
              <div
                className="reg-upload-zone"
                onClick={() => photoRef.current?.click()}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', textAlign: 'left', borderColor: errors.photo ? '#E85248' : undefined }}
              >
                {photoPreview
                  ? <img src={photoPreview} alt="Profile" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  : <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#E8E6F8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon name="user" size={24} color="#A8A5C8" />
                    </div>
                }
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1A1740' }}>
                    {photoPreview ? 'Change photo' : 'Upload your photo'}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#A8A5C8', marginTop: 2 }}>JPG or PNG · Max 5 MB</div>
                </div>
                <input ref={photoRef} type="file" accept="image/jpeg,image/png" onChange={handlePhoto} style={{ display: 'none' }} />
              </div>
              {errors.photo && <div className="reg-error">{errors.photo}</div>}
            </div>
          </>
        )}

        {/* ── Step 2: PAN Verification ── */}
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
                onChange={e => {
                  const v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
                  set('pan', v);
                  setErrors(er => { const n = { ...er }; delete n.pan; return n; });
                }}
                placeholder="ABCDE1234F"
                maxLength={10}
                className={`reg-input${errors.pan ? ' error' : ''}`}
                style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', fontSize: 15 }}
              />
              {form.pan.length > 0 && (
                <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                  {['AAAAA', '9999', 'A'].map((seg, i) => {
                    const starts = [0, 5, 9];
                    const ends   = [5, 9, 10];
                    const chunk  = form.pan.slice(starts[i], ends[i]);
                    const done   = chunk.length === seg.length;
                    return (
                      <span key={i} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: done ? '#EDFFF4' : '#F5F4FF', color: done ? '#1A8C3C' : '#A8A5C8', fontWeight: 600 }}>
                        {['5 letters', '4 digits', '1 letter'][i]}: {done ? '✓' : `${chunk.length}/${seg.length}`}
                      </span>
                    );
                  })}
                </div>
              )}
              {errors.pan && <div className="reg-error">{errors.pan}</div>}
            </div>

            <div className="reg-field-group">
              <label className="reg-label">PAN card photo <span style={{ color: '#E85248' }}>*</span></label>
              <div
                className="reg-upload-zone"
                onClick={() => panRef.current?.click()}
                style={{ borderColor: errors.panFile ? '#E85248' : undefined }}
              >
                {panFileName ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                    <Icon name="file-text" size={20} color="#7B72E8" />
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: '#7B72E8' }}>{panFileName}</div>
                      <div style={{ fontSize: 11.5, color: '#A8A5C8', marginTop: 2 }}>Click to replace</div>
                    </div>
                  </div>
                ) : (
                  <>
                    <Icon name="upload" size={26} color="#A8A5C8" />
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1A1740', marginTop: 10 }}>Click to upload PAN card</div>
                    <div style={{ fontSize: 11.5, color: '#A8A5C8', marginTop: 4 }}>JPG, PNG or PDF · Max 5 MB</div>
                  </>
                )}
                <input ref={panRef} type="file" accept="image/jpeg,image/png,application/pdf" onChange={handlePanFile} style={{ display: 'none' }} />
              </div>
              {errors.panFile && <div className="reg-error">{errors.panFile}</div>}
            </div>
          </>
        )}

        {/* ── Step 3: Review & Terms ── */}
        {step === 3 && (
          <>
            {/* Photo preview */}
            {photoPreview && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, padding: '14px 16px', background: '#FAFAFE', border: '1px solid #E8E6F8', borderRadius: 12 }}>
                <img src={photoPreview} alt="Profile" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#1A1740' }}>{form.firstName} {form.lastName}</div>
                  <div style={{ fontSize: 12, color: '#A8A5C8', marginTop: 2 }}>{form.college} · {form.year}</div>
                </div>
              </div>
            )}

            <div className="reg-field-group">
              <div style={{ background: '#FAFAFE', borderRadius: 14, border: '1px solid #E8E6F8', overflow: 'hidden' }}>
                {[
                  { label: 'Email',    val: form.email },
                  { label: 'Contact',  val: form.contact },
                  { label: 'DOB',      val: form.dob },
                  { label: 'PAN',      val: form.pan,      mono: true },
                  { label: 'PAN doc',  val: panFileName ?? '—' },
                ].map((r, i) => (
                  <div key={r.label} style={{ display: 'flex', padding: '11px 16px', borderTop: i > 0 ? '1px solid #F5F4FF' : 'none', gap: 12 }}>
                    <span style={{ width: 72, fontSize: 11.5, fontWeight: 600, color: '#A8A5C8', flexShrink: 0 }}>{r.label}</span>
                    <span style={{ fontSize: 13.5, color: '#1A1740', fontFamily: r.mono ? 'JetBrains Mono, monospace' : 'inherit', letterSpacing: r.mono ? '0.06em' : 0, fontWeight: 500, wordBreak: 'break-all' }}>
                      {r.val || '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', padding: '14px 16px', background: form.terms ? '#F3F2FF' : '#FAFAFE', borderRadius: 12, border: `1.5px solid ${form.terms ? '#A29AFF' : '#E8E6F8'}`, marginBottom: 4, transition: 'all 0.15s', userSelect: 'none' }}
              onClick={() => { set('terms', !form.terms); setErrors(er => { const n = { ...er }; delete n.terms; return n; }); }}
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

        {/* Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
          <button className="reg-btn" onClick={next}>
            {step === 3 ? 'Submit application' : 'Continue'}
          </button>
          {step > 1
            ? <button className="reg-btn-ghost" onClick={back}>Back</button>
            : <Link href="/" style={{ display: 'block', textAlign: 'center', fontSize: 13.5, color: '#A8A5C8', marginTop: 4, textDecoration: 'none' }}>
                Already have an account? Sign in
              </Link>
          }
        </div>
      </div>
    </div>
  );
}
