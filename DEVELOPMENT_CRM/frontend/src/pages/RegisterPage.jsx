import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { signUpWithSupabase, syncUserToSupabase } from '../utils/supabase';

/* ─── Validation helpers ──────────────────────────────────────────── */
const RFC5322 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateUsername(v) {
  if (!v.trim()) return 'Username is required.';
  if (v.trim().length < 3) return 'Username must be at least 3 characters.';
  return '';
}
function validateEmail(v) {
  if (!v.trim()) return 'Email is required.';
  if (!RFC5322.test(v)) return 'Please enter a valid email address.';
  return '';
}
function validatePassword(v) {
  if (!v) return 'Password is required.';
  if (v.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(v)) return 'Must contain at least one uppercase letter.';
  if (!/[0-9]/.test(v)) return 'Must contain at least one number.';
  if (!/[@#$%!&*()_\-+=[\]{}|;:',.<>?/\\`~^]/.test(v)) return 'Must contain at least one special character.';
  return '';
}
function validateConfirm(v, password) {
  if (!v) return 'Please confirm your password.';
  if (v !== password) return 'Passwords do not match.';
  return '';
}

/* ─── Inline CSS ─────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=Manrope:wght@400;500;600;700&display=swap');

  .rp-root {
    --ink: #1A1A1A; --ink-2: #5C5C5C; --line: #E4E4E4;
    --surface: #FFFFFF; --surface-2: #F7F7F5;
    --accent: #FFC400; --accent-press: #E6B000;
    --cover-dark: #16181D; --danger: #C0392B; --ok: #3FB950;
    --r: 10px;
    font-family: 'Manrope', system-ui, sans-serif;
    color: var(--ink);
    background: var(--surface);
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 1023px) {
    .rp-root { grid-template-columns: 1fr; }
    .rp-cover { display: none !important; }
    .rp-form-col { padding: 32px 24px; }
  }
  .rp-form-col {
    display: flex; flex-direction: column;
    padding: 40px clamp(24px, 6vw, 80px);
    overflow-y: auto;
  }
  .rp-brand {
    display: flex; align-items: center; gap: 10px;
    font-weight: 700; font-size: 15px; margin-bottom: auto;
  }
  .rp-glyph {
    width: 34px; height: 34px; border-radius: 8px;
    display: grid; place-items: center;
    font-family: 'Archivo', sans-serif; font-weight: 800; font-size: 14px;
    background: var(--ink); color: #fff; letter-spacing: .5px;
  }
  .rp-wrap {
    flex: 1; display: flex; flex-direction: column;
    justify-content: center; max-width: 420px; width: 100%; margin: 0 auto;
    padding: 32px 0;
  }
  .rp-h1 {
    font-family: 'Archivo', sans-serif; font-weight: 800;
    font-size: 28px; letter-spacing: -.02em; margin-bottom: 6px;
  }
  .rp-sub { color: var(--ink-2); font-size: 15px; margin-bottom: 28px; }
  .rp-label {
    display: block; font-size: 13px; font-weight: 600;
    letter-spacing: .01em; margin-bottom: 8px; color: var(--ink);
  }
  .rp-field { position: relative; margin-bottom: 16px; }
  .rp-field-ic {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: var(--ink-2); pointer-events: none; display: flex;
  }
  .rp-input {
    width: 100%; height: 48px; border: 1px solid var(--line);
    border-radius: var(--r); padding: 0 44px 0 42px;
    font-family: inherit; font-size: 15px; color: var(--ink);
    background: var(--surface); transition: border-color .15s, box-shadow .15s;
    box-sizing: border-box;
  }
  .rp-input.no-icon { padding-left: 14px; }
  .rp-input::placeholder { color: #A6A6A6; }
  .rp-input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(255,196,0,.28); }
  .rp-input.invalid { border-color: var(--danger); box-shadow: 0 0 0 3px rgba(192,57,43,.15); }
  .rp-eye {
    position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
    background: none; border: 0; cursor: pointer; color: var(--ink-2);
    width: 34px; height: 34px; border-radius: 7px; display: grid; place-items: center;
  }
  .rp-eye:hover { background: var(--surface-2); }
  .rp-err {
    display: flex; align-items: center; gap: 6px;
    color: var(--danger); font-size: 12.5px; margin-top: -8px; margin-bottom: 12px;
  }
  .rp-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .rp-server-err {
    display: flex; align-items: center; gap: 8px;
    background: rgba(192,57,43,.08); border: 1px solid rgba(192,57,43,.3);
    color: var(--danger); border-radius: var(--r);
    padding: 10px 14px; font-size: 13px; margin-bottom: 20px;
  }
  .rp-server-ok {
    display: flex; align-items: center; gap: 8px;
    background: rgba(63,185,80,.08); border: 1px solid rgba(63,185,80,.3);
    color: #1a7f37; border-radius: var(--r);
    padding: 10px 14px; font-size: 13px; margin-bottom: 20px;
  }
  .rp-btn {
    width: 100%; height: 50px; border-radius: var(--r);
    background: var(--accent); border: none; cursor: pointer;
    font-family: 'Archivo', sans-serif; font-weight: 700; font-size: 15px;
    color: var(--ink); letter-spacing: .01em;
    transition: background .15s, transform .1s, box-shadow .15s;
    margin-top: 4px;
  }
  .rp-btn:hover:not(:disabled) { background: #FFD040; box-shadow: 0 4px 16px rgba(255,196,0,.35); transform: translateY(-1px); }
  .rp-btn:active:not(:disabled) { background: var(--accent-press); transform: translateY(0); box-shadow: none; }
  .rp-btn:disabled { opacity: .6; cursor: not-allowed; }
  .rp-footer { margin-top: auto; padding-top: 24px; text-align: center; font-size: 12px; color: var(--ink-2); }
  .rp-login-link { font-size: 14px; margin-top: 20px; text-align: center; color: var(--ink-2); }
  .rp-login-link a { color: var(--ink); font-weight: 700; text-decoration: none; border-bottom: 1px solid transparent; }
  .rp-login-link a:hover { border-bottom-color: var(--ink); }

  @keyframes rp-stagger { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .rp-anim > * { opacity: 0; animation: rp-stagger .45s ease forwards; }
  .rp-anim > *:nth-child(1)  { animation-delay: .05s; }
  .rp-anim > *:nth-child(2)  { animation-delay: .10s; }
  .rp-anim > *:nth-child(3)  { animation-delay: .15s; }
  .rp-anim > *:nth-child(4)  { animation-delay: .20s; }
  .rp-anim > *:nth-child(5)  { animation-delay: .25s; }
  .rp-anim > *:nth-child(6)  { animation-delay: .30s; }
  .rp-anim > *:nth-child(7)  { animation-delay: .35s; }
  .rp-anim > *:nth-child(8)  { animation-delay: .40s; }
  .rp-anim > *:nth-child(9)  { animation-delay: .45s; }
  .rp-anim > *:nth-child(10) { animation-delay: .50s; }

  @keyframes rp-jiggle {
    0%,100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
  .rp-jiggle { animation: rp-jiggle .4s ease; }

  /* cover — identical to login page */
  .rp-cover {
    position: relative; overflow: hidden;
    background:
      url('/hero.jpg') center/cover no-repeat,
      radial-gradient(120% 80% at 80% 10%, rgba(255,196,0,.12), transparent 60%),
      linear-gradient(160deg, #23262E 0%, #16181D 55%, #0E0F13 100%);
    color: #fff; display: flex; flex-direction: column;
    justify-content: space-between; padding: 48px;
  }
  .rp-cover::before {
    content: ''; position: absolute; inset: 0;
    background: rgba(0,0,0,.8); z-index: 0;
  }
  .rp-cover::after {
    content: ''; position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(120% 100% at 70% 30%, #000 30%, transparent 80%);
    z-index: 1;
  }
  .rp-cover-top, .rp-cover-mid, .rp-cover-bot { position: relative; z-index: 2; }
  .rp-cover-mid { max-width: 420px; }
  .rp-pill {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12);
    padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; letter-spacing: .02em;
  }
  .rp-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--ok); box-shadow: 0 0 0 3px rgba(63,185,80,.25); flex-shrink: 0;
  }
`;

/* ─── SVG icons (inline, no dep) ─────────────────────────────────── */
const IconUser   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconMail   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const IconLock   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconEye    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconEyeOff = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>;
const IconAlert  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>;
const IconCheck  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconSpin   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '', firstName: '', lastName: '',
    email: '', password: '', confirm: '',
    role: 'ServiceAdvisor', department: '', phone: '',
  });
  const [errors, setErrors]       = useState({});
  const [showPw, setShowPw]       = useState(false);
  const [showCf, setShowCf]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [serverErr, setServerErr] = useState('');
  const [success, setSuccess]     = useState(false);
  const [jiggle, setJiggle]       = useState(false);

  const wrapRef     = useRef(null);
  const usernameRef = useRef(null);

  useEffect(() => { usernameRef.current?.focus(); }, []);

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
    if (serverErr) setServerErr('');
  }

  function validate() {
    const e = {};
    e.username = validateUsername(form.username);
    e.email    = validateEmail(form.email);
    e.password = validatePassword(form.password);
    e.confirm  = validateConfirm(form.confirm, form.password);
    setErrors(e);
    return Object.values(e).every(v => !v);
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) {
      setJiggle(true);
      setTimeout(() => setJiggle(false), 420);
      return;
    }

    setLoading(true);
    setServerErr('');

    try {
      // 1. Create user in Supabase Auth
      const { error: sbError } = await signUpWithSupabase(form.email, form.password, {
        username:   form.username,
        first_name: form.firstName,
        last_name:  form.lastName,
        role:       form.role,
      });

      if (sbError && sbError.message !== 'User already registered') {
        // Non-fatal: Supabase might be unconfigured; we still sync to backend
        console.warn('Supabase signUp warning:', sbError.message);
      }

      // 2. Sync to ASP.NET backend DB
      const res = await api.post('/auth/register', {
        username:   form.username.trim(),
        email:      form.email.trim(),
        password:   form.password,
        firstName:  form.firstName.trim() || null,
        lastName:   form.lastName.trim()  || null,
        role:       form.role,
        department: form.department.trim() || null,
        phoneNumber: form.phone.trim()    || null,
      });

      if (res.data?.data?.success === false) {
        setServerErr(res.data.data.message || 'Registration failed.');
        return;
      }

      // Sync to Supabase app_users (fire-and-forget)
      const newUser = res.data?.data?.user;
      if (newUser) syncUserToSupabase(newUser, null);

      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);

    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.Message ||
        err.response?.data?.data?.message ||
        'Registration failed. Please try again.';
      setServerErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{STYLES}</style>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div className="rp-root">
        {/* ── Form column ── */}
        <div className="rp-form-col">
          <div className="rp-brand">
            <div className="rp-glyph">UT</div>
            <span>UT Service Console</span>
          </div>

          <div className={`rp-wrap rp-anim${jiggle ? ' rp-jiggle' : ''}`} ref={wrapRef}>
            <h1 className="rp-h1">Create an account</h1>
            <p className="rp-sub">Fill in the details below to register.</p>

            {serverErr && (
              <div className="rp-server-err" role="alert">
                <IconAlert /> {serverErr}
              </div>
            )}
            {success && (
              <div className="rp-server-ok" role="status">
                <IconCheck /> Account created! Redirecting to login…
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Username */}
              <label className="rp-label" htmlFor="rp-username">Username</label>
              <div className="rp-field">
                <span className="rp-field-ic"><IconUser /></span>
                <input
                  id="rp-username" ref={usernameRef}
                  className={`rp-input${errors.username ? ' invalid' : ''}`}
                  type="text" autoComplete="username"
                  placeholder="e.g. john_doe"
                  value={form.username}
                  onChange={e => set('username', e.target.value)}
                  aria-invalid={!!errors.username}
                />
              </div>
              {errors.username && <p className="rp-err"><IconAlert />{errors.username}</p>}

              {/* First / Last name */}
              <div className="rp-row">
                <div>
                  <label className="rp-label" htmlFor="rp-fname">First name</label>
                  <div className="rp-field">
                    <input id="rp-fname" className="rp-input no-icon" type="text"
                      placeholder="John" value={form.firstName}
                      onChange={e => set('firstName', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="rp-label" htmlFor="rp-lname">Last name</label>
                  <div className="rp-field">
                    <input id="rp-lname" className="rp-input no-icon" type="text"
                      placeholder="Doe" value={form.lastName}
                      onChange={e => set('lastName', e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Email */}
              <label className="rp-label" htmlFor="rp-email">Email address</label>
              <div className="rp-field">
                <span className="rp-field-ic"><IconMail /></span>
                <input
                  id="rp-email"
                  className={`rp-input${errors.email ? ' invalid' : ''}`}
                  type="email" autoComplete="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && <p className="rp-err"><IconAlert />{errors.email}</p>}

              {/* Password */}
              <label className="rp-label" htmlFor="rp-password">Password</label>
              <div className="rp-field">
                <span className="rp-field-ic"><IconLock /></span>
                <input
                  id="rp-password"
                  className={`rp-input${errors.password ? ' invalid' : ''}`}
                  type={showPw ? 'text' : 'password'} autoComplete="new-password"
                  placeholder="Min 8 chars, uppercase, number, symbol"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  aria-invalid={!!errors.password}
                />
                <button type="button" className="rp-eye"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPw(s => !s)}>
                  {showPw ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
              {errors.password && <p className="rp-err"><IconAlert />{errors.password}</p>}

              {/* Confirm password */}
              <label className="rp-label" htmlFor="rp-confirm">Confirm password</label>
              <div className="rp-field">
                <span className="rp-field-ic"><IconLock /></span>
                <input
                  id="rp-confirm"
                  className={`rp-input${errors.confirm ? ' invalid' : ''}`}
                  type={showCf ? 'text' : 'password'} autoComplete="new-password"
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={e => set('confirm', e.target.value)}
                  aria-invalid={!!errors.confirm}
                />
                <button type="button" className="rp-eye"
                  aria-label={showCf ? 'Hide' : 'Show'}
                  onClick={() => setShowCf(s => !s)}>
                  {showCf ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
              {errors.confirm && <p className="rp-err"><IconAlert />{errors.confirm}</p>}

              {/* Role + Department */}
              <div className="rp-row">
                <div>
                  <label className="rp-label" htmlFor="rp-role">Role</label>
                  <div className="rp-field">
                    <select id="rp-role" className="rp-input no-icon"
                      value={form.role} onChange={e => set('role', e.target.value)}
                      style={{ appearance: 'auto' }}>
                      <option value="ServiceAdvisor">Service Advisor</option>
                      <option value="Mechanic">Mechanic</option>
                      <option value="Manager">Manager</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="rp-label" htmlFor="rp-dept">Department</label>
                  <div className="rp-field">
                    <input id="rp-dept" className="rp-input no-icon" type="text"
                      placeholder="e.g. Field Service"
                      value={form.department}
                      onChange={e => set('department', e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Phone */}
              <label className="rp-label" htmlFor="rp-phone">Phone (optional)</label>
              <div className="rp-field">
                <input id="rp-phone" className="rp-input no-icon" type="tel"
                  placeholder="+62 812 3456 7890"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)} />
              </div>

              <button type="submit" className="rp-btn" disabled={loading || success}>
                {loading ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><IconSpin /> Creating account…</span>
                  : success ? '✓ Account created'
                  : 'Create account'}
              </button>
            </form>

            <p className="rp-login-link">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>

          <footer className="rp-footer">© 2026 United Tractors. All rights reserved.</footer>
        </div>

        {/* ── Cover panel ── */}
        <aside className="rp-cover" aria-hidden="true">
          <div className="rp-cover-top">
            <span className="rp-pill">
              <span className="rp-dot" />
              MVP v1.0 — All Systems Operational
            </span>
          </div>
          <div className="rp-cover-mid">
            <p style={{ fontFamily: "'Archivo',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#FFC400', marginBottom: 16 }}>
              United Tractors
            </p>
            <h2 style={{ fontFamily: "'Archivo',sans-serif", fontSize: 36, fontWeight: 800, lineHeight: 1.1, margin: '0 0 20px' }}>
              Enterprise<br /><span style={{ color: '#FFC400' }}>Service</span><br />Management
            </h2>
            <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, lineHeight: 1.7, marginBottom: 32 }}>
              Join your team on the platform that unifies case management, work orders, and field operations across all UT branches.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { icon: '🔧', label: 'Case Management' },
                { icon: '💬', label: 'Team Collaboration' },
                { icon: '📊', label: 'Live Analytics' },
                { icon: '⚙️', label: 'Work Orders' },
              ].map(({ icon, label }) => (
                <div key={label} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600 }}>
                  <span style={{ fontSize: 20 }}>{icon}</span> {label}
                </div>
              ))}
            </div>
          </div>
          <div className="rp-cover-bot" style={{ color: 'rgba(255,255,255,.35)', fontSize: 12 }}>
            Secure • Scalable • Enterprise-ready
          </div>
        </aside>
      </div>
    </>
  );
}
