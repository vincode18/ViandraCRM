import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/* ─── Validation helpers ──────────────────────────────────────── */
const RFC5322 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(val) {
  if (!val.trim()) return 'Email is required.';
  if (!RFC5322.test(val)) return 'Please enter a valid email address.';
  return '';
}

function validatePassword(val) {
  if (!val) return 'Password is required.';
  if (val.length < 8) return 'Password must be at least 8 characters.';
  return '';
}

/* ─── Inline CSS ─────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=Manrope:wght@400;500;600;700&display=swap');

  .lp-root {
    --ink: #111827; --ink-2: #6B7280; --line: #E5E7EB;
    --surface: #FFFFFF; --surface-2: #F7F7F5;
    --accent: #FBBF24; --accent-press: #F59E0B;
    --cover-dark: #16181D; --danger: #C0392B; --ok: #3FB950;
    --r: 8px;
    font-family: 'Manrope', system-ui, sans-serif;
    color: var(--ink);
    background: var(--surface);
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .lp-form-col {
    display: flex; flex-direction: column;
    padding: 40px clamp(24px, 6vw, 80px);
  }
  .lp-brand {
    display: flex; align-items: center; gap: 10px;
    font-weight: 700; font-size: 15px; margin-bottom: auto;
  }
  .lp-glyph {
    width: 34px; height: 34px; border-radius: 8px;
    display: grid; place-items: center;
    font-family: 'Archivo', sans-serif; font-weight: 800; font-size: 14px;
    background: var(--ink); color: #fff; letter-spacing: .5px;
  }
  .lp-wrap {
    flex: 1; display: flex; flex-direction: column;
    justify-content: center; max-width: 400px; width: 100%; margin: 0 auto;
    padding: 40px 0;
  }
  .lp-h1 {
    font-family: 'Archivo', sans-serif; font-weight: 700;
    font-size: 32px; letter-spacing: -.02em; margin-bottom: 6px;
  }
  .lp-sub { color: var(--ink-2); font-size: 14px; margin-bottom: 32px; }
  .lp-label {
    display: block; font-size: 13px; font-weight: 600;
    letter-spacing: .01em; margin-bottom: 8px; color: var(--ink);
  }
  .lp-field { position: relative; margin-bottom: 18px; }
  .lp-field-ic {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: var(--ink-2); pointer-events: none; display: flex;
  }
  .lp-input {
    width: 100%; height: 48px; border: 1px solid var(--line);
    border-radius: var(--r); padding: 0 44px 0 42px;
    font-family: inherit; font-size: 15px; color: var(--ink);
    background: var(--surface); transition: border-color .15s, box-shadow .15s;
  }
  .lp-input::placeholder { color: #9CA3AF; }
  .lp-input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(251,191,36,.2); }
  .lp-input.invalid { border-color: var(--danger); box-shadow: 0 0 0 3px rgba(192,57,43,.15); }
  .lp-eye {
    position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
    background: none; border: 0; cursor: pointer; color: var(--ink-2);
    width: 34px; height: 34px; border-radius: 7px; display: grid; place-items: center;
  }
  .lp-eye:hover { background: var(--surface-2); }
  .lp-row-between {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;
  }
  .lp-link {
    color: var(--accent); font-size: 13px; font-weight: 600;
    text-decoration: none; border-bottom: 1px solid transparent; background: none; border-top: none; border-left: none; border-right: none;
    cursor: pointer; font-family: inherit;
  }
  .lp-link:hover { border-bottom-color: var(--accent); }
  .lp-err {
    display: flex; align-items: center; gap: 6px;
    color: var(--danger); font-size: 12.5px; margin-top: -10px; margin-bottom: 16px;
  }
  .lp-remember {
    display: flex; align-items: center; gap: 9px;
    font-size: 14px; color: var(--ink-2); margin: 4px 0 22px; cursor: pointer;
  }
  .lp-remember input { width: 17px; height: 17px; accent-color: var(--ink); cursor: pointer; }
  .lp-btn {
    width: 100%; height: 48px; border: 0; border-radius: 9999px;
    font-family: inherit; font-weight: 700; font-size: 15px; cursor: pointer;
    transition: transform .12s, background .15s, box-shadow .15s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .lp-btn-primary { background: var(--accent); color: #1F2937; box-shadow: 0 1px 0 rgba(0,0,0,.04); }
  .lp-btn-primary:hover { background: var(--accent-press); transform: translateY(-1px); box-shadow: 0 6px 16px rgba(251,191,36,.35); }
  .lp-btn-primary:active { background: #EAAA08; transform: translateY(0); }
  .lp-btn-primary:disabled { opacity: .6; cursor: not-allowed; transform: none; }
  .lp-divider {
    display: flex; align-items: center; gap: 14px;
    color: var(--ink-2); font-size: 12.5px; margin: 24px 0;
  }
  .lp-divider::before, .lp-divider::after { content: ''; flex: 1; height: 1px; background: var(--line); }
  .lp-sso {
    width: 100%; height: 48px; border: 1px solid var(--line); border-radius: 9999px;
    background: #FFFFFF; font-family: inherit; font-weight: 600;
    font-size: 14.5px; color: var(--ink);
    display: flex; align-items: center; justify-content: center; gap: 10px;
    cursor: pointer; transition: border-color .15s, background .15s; margin-bottom: 12px;
  }
  .lp-sso:hover { border-color: #D1D5DB; background: #F9FAFB; }
  .lp-ut-mark {
    width: 20px; height: 18px; border-radius: 4px;
    background: var(--ink); color: #fff; font-family: 'Archivo', sans-serif;
    font-weight: 800; font-size: 9px; display: grid; place-items: center;
  }
  .lp-footer { margin-top: 34px; text-align: center; color: #9A9A9A; font-size: 12px; }
  .lp-server-err {
    display: flex; align-items: center; gap: 8px;
    background: rgba(192,57,43,.08); border: 1px solid rgba(192,57,43,.3);
    color: var(--danger); border-radius: var(--r);
    padding: 10px 14px; font-size: 13px; margin-bottom: 20px;
  }

  /* cover */
  .lp-cover {
    position: relative; overflow: hidden;
    background:
      url('/hero.jpg') center/cover no-repeat,
      radial-gradient(120% 80% at 80% 10%, rgba(255,196,0,.12), transparent 60%),
      linear-gradient(160deg, #23262E 0%, #16181D 55%, #0E0F13 100%);
    color: #fff; display: flex; flex-direction: column;
    justify-content: space-between; padding: 48px;
  }
  .lp-cover::before {
    content: ''; position: absolute; inset: 0;
    background: rgba(0,0,0,.8);
    z-index: 0;
  }
  .lp-cover::after {
    content: ''; position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(120% 100% at 70% 30%, #000 30%, transparent 80%);
    z-index: 1;
  }
  .lp-machine {
    position: absolute; right: -40px; bottom: -30px; width: 520px; opacity: .16;
    color: #FFC400; pointer-events: none;
  }
  .lp-cover-top, .lp-cover-mid, .lp-cover-bot { position: relative; z-index: 2; }
  .lp-cover-mid { max-width: 420px; }
  .lp-pill {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12);
    padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; letter-spacing: .02em;
  }
  .lp-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--ok); box-shadow: 0 0 0 3px rgba(63,185,80,.25); flex-shrink: 0;
  }
  .lp-cover-h2 {
    font-family: 'Archivo', sans-serif; font-weight: 800;
    font-size: 36px; line-height: 1.08; letter-spacing: -.02em; margin: 18px 0 14px;
  }
  .lp-cover-h2 span { color: var(--accent); }
  .lp-cover-p { color: #B9BCC4; font-size: 15px; line-height: 1.6; max-width: 380px; }
  .lp-feats { list-style: none; display: grid; gap: 14px; margin-top: 30px; padding: 0; }
  .lp-feats li { display: flex; align-items: center; gap: 13px; font-size: 14.5px; font-weight: 500; }
  .lp-tile {
    width: 34px; height: 34px; border-radius: 9px; flex: none; display: grid; place-items: center;
    background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); color: var(--accent);
  }
  .lp-cover-bot-text { font-size: 13px; color: #8A8D96; }

  /* stagger animation */
  @keyframes lp-rise { to { opacity: 1; transform: none; } }
  .lp-s { opacity: 0; transform: translateY(8px); animation: lp-rise .5s ease forwards; }
  .lp-s:nth-child(1){animation-delay:.05s} .lp-s:nth-child(2){animation-delay:.11s}
  .lp-s:nth-child(3){animation-delay:.17s} .lp-s:nth-child(4){animation-delay:.23s}
  .lp-s:nth-child(5){animation-delay:.29s} .lp-s:nth-child(6){animation-delay:.35s}
  .lp-s:nth-child(7){animation-delay:.41s} .lp-s:nth-child(8){animation-delay:.47s}

  /* jiggle */
  @keyframes lp-jiggle { 0%,100%{transform:none} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
  .lp-jiggle { animation: lp-jiggle .35s ease; }

  /* responsive */
  @media (max-width: 1024px) {
    .lp-root { grid-template-columns: 1fr; }
    .lp-cover { display: none; }
    .lp-mobile-tag { display: block !important; color: var(--ink-2); font-size: 13.5px; margin-top: 4px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .lp-s { animation: none; opacity: 1; transform: none; }
    .lp-btn-primary:hover { transform: none; }
  }
`;

/* ─── LoginPage ───────────────────────────────────────────────── */
export default function LoginPage() {
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [remember, setRemember]   = useState(false);
  const [showPw, setShowPw]       = useState(false);
  const [emailErr, setEmailErr]   = useState('');
  const [passErr, setPassErr]     = useState('');
  const [serverErr, setServerErr] = useState('');
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [jiggle, setJiggle]       = useState(false);

  const emailRef = useRef(null);
  const passRef  = useRef(null);

  useEffect(() => { emailRef.current?.focus(); }, []);

  const clearErr = (field) => {
    if (field === 'email') setEmailErr('');
    if (field === 'password') setPassErr('');
    if (serverErr) setServerErr('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailErr(eErr);
    setPassErr(pErr);
    if (eErr || pErr) {
      setJiggle(true);
      setTimeout(() => setJiggle(false), 400);
      eErr ? emailRef.current?.focus() : passRef.current?.focus();
      return;
    }
    setLoading(true);
    setServerErr('');
    const result = await login(email, password, remember);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        try {
          const stored = localStorage.getItem('ut_user');
          const user = stored ? JSON.parse(stored) : null;
          const role = user?.role || '';
          if (role === 'Mechanic' || role === 'Field Technician') {
            navigate('/field/jobs', { replace: true });
          } else {
            navigate('/console', { replace: true });
          }
        } catch {
          navigate('/console', { replace: true });
        }
      }, 900);
    } else {
      setServerErr(result.message || 'Invalid credentials. Please try again.');
      setJiggle(true);
      setTimeout(() => setJiggle(false), 400);
      setLoading(false);
      passRef.current?.focus();
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <main className="lp-root">

        {/* ── LEFT: FORM ── */}
        <section className="lp-form-col" aria-labelledby="lp-heading">
          {/* Brand mark */}
          <div className="lp-brand lp-s">
            <span className="lp-glyph" aria-hidden="true">UT</span>
            UT Service Console
          </div>

          <div className="lp-wrap">
            <h1 className="lp-h1 lp-s" id="lp-heading">Welcome back</h1>
            <p className="lp-sub lp-s">Sign in to your account to continue.</p>
            <p className="lp-mobile-tag lp-s" style={{ display: 'none' }}>Enterprise Service Management — cases, work orders &amp; assets in one place.</p>

            {/* Server error */}
            {serverErr && (
              <div role="alert" aria-live="assertive" className="lp-server-err">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
                {serverErr}
              </div>
            )}

            {/* Success */}
            {success && (
              <div role="status" style={{ display:'flex',alignItems:'center',gap:8,background:'rgba(63,185,80,.1)',border:'1px solid rgba(63,185,80,.3)',color:'#3FB950',borderRadius:10,padding:'10px 14px',fontSize:13,marginBottom:20 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
                Login successful! Redirecting…
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className={jiggle ? 'lp-jiggle' : ''}>

              {/* Email */}
              <div className="lp-s">
                <label htmlFor="lp-email" className="lp-label">Email address</label>
                <div className="lp-field">
                  <span className="lp-field-ic" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                  </span>
                  <input
                    ref={emailRef}
                    id="lp-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); clearErr('email'); }}
                    className={`lp-input${emailErr ? ' invalid' : ''}`}
                    aria-required="true"
                    aria-invalid={!!emailErr}
                    aria-describedby={emailErr ? 'lp-email-err' : undefined}
                    disabled={loading || success}
                  />
                </div>
                {emailErr && (
                  <p id="lp-email-err" className="lp-err" role="alert">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
                    {emailErr}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="lp-s">
                <div className="lp-row-between">
                  <label htmlFor="lp-password" className="lp-label" style={{ marginBottom: 0 }}>Password</label>
                  <button type="button" className="lp-link" onClick={() => alert('Forgot password — Phase 2.')}>Forgot password?</button>
                </div>
                <div className="lp-field" style={{ marginTop: 8 }}>
                  <span className="lp-field-ic" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
                  </span>
                  <input
                    ref={passRef}
                    id="lp-password"
                    type={showPw ? 'text' : 'password'}
                    name="password"
                    autoComplete="current-password"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={e => { setPassword(e.target.value); clearErr('password'); }}
                    className={`lp-input${passErr ? ' invalid' : ''}`}
                    aria-required="true"
                    aria-invalid={!!passErr}
                    aria-describedby={passErr ? 'lp-pass-err' : undefined}
                    disabled={loading || success}
                  />
                  <button
                    type="button"
                    className="lp-eye"
                    onClick={() => setShowPw(v => !v)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                    disabled={loading || success}
                  >
                    {showPw
                      ? <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
                {passErr && (
                  <p id="lp-pass-err" className="lp-err" role="alert">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
                    {passErr}
                  </p>
                )}
              </div>

              {/* Remember */}
              <label className="lp-remember lp-s">
                <input type="checkbox" name="remember" checked={remember} onChange={e => setRemember(e.target.checked)} disabled={loading || success} />
                Remember me for 30 days
              </label>

              {/* Submit */}
              <button type="submit" className="lp-btn lp-btn-primary lp-s" disabled={loading || success} aria-busy={loading}>
                {loading && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" style={{ animation: 'spin 1s linear infinite' }}>
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                  </svg>
                )}
                {loading ? 'Signing in…' : success ? 'Success!' : 'Sign in'}
              </button>

              {/* Divider */}
              <div className="lp-divider lp-s">or continue with</div>

              {/* SSO */}
              <button type="button" className="lp-sso lp-s" onClick={() => alert('UT SSO — Phase 2.')}>
                <span className="lp-ut-mark" aria-hidden="true">UT</span>
                Sign in with UT Account
              </button>
              <button type="button" className="lp-sso lp-s" onClick={() => alert('Microsoft SSO — Phase 2.')}>
                <svg width="17" height="17" viewBox="0 0 23 23" aria-hidden="true">
                  <path fill="#F25022" d="M0 0h11v11H0z"/>
                  <path fill="#7FBA00" d="M12 0h11v11H12z"/>
                  <path fill="#00A4EF" d="M0 12h11v11H0z"/>
                  <path fill="#FFB900" d="M12 12h11v11H12z"/>
                </svg>
                Sign in with Microsoft
              </button>
            </form>

            <p className="lp-s" style={{ textAlign: 'center', fontSize: 14, color: 'var(--ink-2)', margin: '16px 0 0' }}>
              Don't have an account? <Link to="/register" style={{ color: 'var(--ink)', fontWeight: 700, textDecoration: 'none', borderBottom: '1px solid transparent' }} onMouseOver={e => e.currentTarget.style.borderBottomColor = 'var(--ink)'} onMouseOut={e => e.currentTarget.style.borderBottomColor = 'transparent'}>Create one</Link>
            </p>
            <footer className="lp-footer lp-s">© 2026 United Tractors. All rights reserved.</footer>
          </div>
        </section>

        {/* ── RIGHT: COVER ── */}
        <aside className="lp-cover" aria-hidden="true">
          {/* Equipment silhouette */}
          <svg className="lp-machine" viewBox="0 0 200 120" fill="currentColor">
            <rect x="40" y="60" width="90" height="30" rx="4"/>
            <path d="M30 90h150l-10 18H40z"/>
            <rect x="130" y="40" width="36" height="30" rx="3"/>
            <path d="M166 48l28-18v8l-22 14z"/>
            <circle cx="60" cy="112" r="9"/>
            <circle cx="95" cy="112" r="9"/>
            <circle cx="150" cy="112" r="9"/>
          </svg>

          <div className="lp-cover-top">
            <span className="lp-pill">UT Service Console</span>
          </div>

          <div className="lp-cover-mid">
            <h2 className="lp-cover-h2">Enterprise <span>Service</span><br/>Management</h2>
            <p className="lp-cover-p">Manage cases, work orders, and service resources all in one place. Built for field operations teams at scale.</p>
            <ul className="lp-feats" aria-label="Platform features">
              <li>
                <span className="lp-tile"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 4h16v12H5l-1 4z"/></svg></span>
                Case Management
              </li>
              <li>
                <span className="lp-tile"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M14 3l7 7-9 9-7 1 1-7z"/></svg></span>
                Work Order Tracking
              </li>
              <li>
                <span className="lp-tile"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg></span>
                SLA Monitoring
              </li>
              <li>
                <span className="lp-tile"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M10 4v16"/></svg></span>
                Asset Management
              </li>
              <li>
                <span className="lp-tile"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
                Contact Management
              </li>
              <li>
                <span className="lp-tile"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 1 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></span>
                Field Service
              </li>
            </ul>
          </div>

          <div className="lp-cover-bot">
            <span className="lp-pill lp-cover-bot-text">
              <span className="lp-dot" />
              <strong style={{ color: '#fff', fontWeight: 600 }}>MVP v1.0</strong> — All Systems Operational
            </span>
          </div>
        </aside>

      </main>
    </>
  );
}
