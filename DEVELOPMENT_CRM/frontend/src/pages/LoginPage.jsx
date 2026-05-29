import React, { useState, useCallback, useRef, useEffect, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
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

/* ─── Spinner ─────────────────────────────────────────────────── */
function Spinner() {
  return (
    <Loader2
      size={18}
      className="animate-spin"
      aria-hidden="true"
    />
  );
}

/* ─── LoginPage ───────────────────────────────────────────────── */
export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const emailId    = useId();
  const passwordId = useId();

  const [formState, setFormState] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [submitState, setSubmitState] = useState('idle'); // idle | loading | success | error
  const [serverError, setServerError] = useState('');
  const [jiggle, setJiggle] = useState(false);

  const emailRef    = useRef(null);
  const passwordRef = useRef(null);
  const formRef     = useRef(null);

  // Auto-focus email on mount
  useEffect(() => { emailRef.current?.focus(); }, []);

  // ── Field change ────────────────────────────────────────────────
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newVal = type === 'checkbox' ? checked : value;
    setFormState(prev => ({ ...prev, [name]: newVal }));

    // Real-time validation after first touch
    if (touched[name]) {
      if (name === 'email')    setErrors(prev => ({ ...prev, email: validateEmail(value) }));
      if (name === 'password') setErrors(prev => ({ ...prev, password: validatePassword(value) }));
    }
    if (serverError) setServerError('');
  }, [touched, serverError]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    if (name === 'email')    setErrors(prev => ({ ...prev, email: validateEmail(value) }));
    if (name === 'password') setErrors(prev => ({ ...prev, password: validatePassword(value) }));
  }, []);

  // ── Submit ───────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (submitState === 'loading') return;

    const emailErr = validateEmail(formState.email);
    const passErr  = validatePassword(formState.password);
    setTouched({ email: true, password: true });
    setErrors({ email: emailErr, password: passErr });

    if (emailErr || passErr) {
      setJiggle(true);
      setTimeout(() => setJiggle(false), 400);
      emailErr ? emailRef.current?.focus() : passwordRef.current?.focus();
      return;
    }

    setSubmitState('loading');
    setServerError('');

    const result = await login(formState.email, formState.password, formState.rememberMe);

    if (result.success) {
      setSubmitState('success');
      setTimeout(() => navigate('/console', { replace: true }), 900);
    } else {
      setSubmitState('error');
      setServerError(result.message);
      setJiggle(true);
      setTimeout(() => { setJiggle(false); setSubmitState('idle'); }, 400);
      passwordRef.current?.focus();
    }
  }, [formState, submitState, login, navigate]);

  // ── OAuth (placeholder – PKCE flow Phase 2) ─────────────────────
  const handleOAuth = (provider) => {
    alert(`${provider} OAuth with PKCE flow will be implemented in Phase 2.`);
  };

  const isLoading = submitState === 'loading';
  const isSuccess = submitState === 'success';

  return (
    <div className="min-h-screen flex" role="main">
      {/* ── Left: Form panel (45%) ─────────────────────────────────── */}
      <section
        className="relative flex flex-col justify-center w-full md:w-[45%] min-h-screen
                   bg-brand-dark px-6 py-10 sm:px-12"
        aria-labelledby="login-heading"
      >
        {/* Logo */}
        <div className="mb-8 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg bg-brand-blue flex items-center justify-center
                       text-white font-bold text-sm select-none"
            aria-hidden="true"
          >
            UT
          </div>
          <span className="font-bold text-white text-sm tracking-wide">
            UT Service Console
          </span>
        </div>

        {/* Heading */}
        <header className="mb-8">
          <h1
            id="login-heading"
            className="text-3xl font-bold text-white mb-2 animate-fadeIn"
          >
            Welcome back
          </h1>
          <p className="text-brand-muted text-sm">
            Sign in to your account to continue.
          </p>
        </header>

        {/* Server-level error banner */}
        {serverError && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-5 flex items-start gap-3 bg-red-500/10 border border-brand-error/40
                       text-brand-error rounded-lg px-4 py-3 text-sm animate-fadeIn"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Success banner */}
        {isSuccess && (
          <div
            role="status"
            aria-live="polite"
            className="mb-5 flex items-center gap-3 bg-green-500/10 border border-brand-success/40
                       text-brand-success rounded-lg px-4 py-3 text-sm animate-fadeIn"
          >
            <CheckCircle size={16} aria-hidden="true" />
            <span>Login successful! Redirecting…</span>
          </div>
        )}

        {/* Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          aria-label="Sign in form"
          className={jiggle ? 'animate-jiggle' : ''}
        >
          {/* Email */}
          <div className="mb-5">
            <label
              htmlFor={emailId}
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              Email address
            </label>
            <div className="relative">
              <span
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none"
                aria-hidden="true"
              >
                <Mail size={16} />
              </span>
              <input
                ref={emailRef}
                id={emailId}
                name="email"
                type="email"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                value={formState.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="you@example.com"
                aria-required="true"
                aria-invalid={Boolean(errors.email && touched.email)}
                aria-describedby={errors.email && touched.email ? `${emailId}-error` : undefined}
                disabled={isLoading || isSuccess}
                className={`input-field pl-10 ${errors.email && touched.email ? 'error' : ''}`}
              />
            </div>
            {errors.email && touched.email && (
              <p
                id={`${emailId}-error`}
                role="alert"
                className="mt-1.5 text-xs text-brand-error flex items-center gap-1 animate-fadeIn"
              >
                <AlertCircle size={12} aria-hidden="true" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor={passwordId}
                className="text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <button
                type="button"
                className="text-xs text-brand-blue hover:text-brand-blueDark
                           transition-colors duration-150 underline-offset-2 hover:underline
                           focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-blue rounded"
                tabIndex={0}
                onClick={() => alert('Forgot password flow coming in Phase 2.')}
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <span
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none"
                aria-hidden="true"
              >
                <Lock size={16} />
              </span>
              <input
                ref={passwordRef}
                id={passwordId}
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={formState.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Min. 8 characters"
                aria-required="true"
                aria-invalid={Boolean(errors.password && touched.password)}
                aria-describedby={errors.password && touched.password ? `${passwordId}-error` : undefined}
                disabled={isLoading || isSuccess}
                className={`input-field pl-10 pr-11 ${errors.password && touched.password ? 'error' : ''}`}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(v => !v)}
                disabled={isLoading || isSuccess}
                className="absolute right-3 top-1/2 -translate-y-1/2
                           text-brand-muted hover:text-gray-300
                           transition-colors duration-150
                           min-w-[44px] min-h-[44px] flex items-center justify-center -mr-1"
              >
                {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
              </button>
            </div>
            {errors.password && touched.password && (
              <p
                id={`${passwordId}-error`}
                role="alert"
                className="mt-1.5 text-xs text-brand-error flex items-center gap-1 animate-fadeIn"
              >
                <AlertCircle size={12} aria-hidden="true" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-3 mb-7">
            <input
              id="remember-me"
              name="rememberMe"
              type="checkbox"
              checked={formState.rememberMe}
              onChange={handleChange}
              disabled={isLoading || isSuccess}
              className="w-4 h-4 rounded border-brand-border bg-brand-card
                         accent-brand-blue cursor-pointer"
            />
            <label
              htmlFor="remember-me"
              className="text-sm text-gray-400 cursor-pointer select-none"
            >
              Remember me for 30 days
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || isSuccess}
            aria-busy={isLoading}
            className="btn-primary w-full mb-5"
          >
            {isLoading && <Spinner />}
            {isSuccess && <CheckCircle size={18} aria-hidden="true" />}
            {isLoading ? 'Signing in…' : isSuccess ? 'Success!' : 'Sign in'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5" aria-hidden="true">
          <hr className="flex-1 border-brand-border" />
          <span className="text-xs text-brand-muted">or continue with</span>
          <hr className="flex-1 border-brand-border" />
        </div>

        {/* OAuth buttons */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => handleOAuth('UT SSO')}
            className="btn-secondary w-full"
            aria-label="Sign in with UT Single Sign-On"
          >
            <span
              className="w-5 h-5 rounded bg-brand-blue text-white text-[10px] font-bold
                         flex items-center justify-center"
              aria-hidden="true"
            >
              UT
            </span>
            Sign in with UT Account
          </button>
          <button
            type="button"
            onClick={() => handleOAuth('Microsoft')}
            className="btn-secondary w-full"
            aria-label="Sign in with Microsoft Account"
          >
            <svg
              width="18" height="18" viewBox="0 0 21 21"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect x="1"  y="1"  width="9" height="9" fill="#F25022"/>
              <rect x="11" y="1"  width="9" height="9" fill="#7FBA00"/>
              <rect x="1"  y="11" width="9" height="9" fill="#00A4EF"/>
              <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
            </svg>
            Sign in with Microsoft
          </button>
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs text-brand-muted text-center">
          © 2026 United Tractors. All rights reserved.
        </p>
      </section>

      {/* ── Right: Brand panel (55%) – hidden on mobile ────────────── */}
      <aside
        className="hidden md:flex md:w-[55%] flex-col items-center justify-center
                   relative overflow-hidden bg-brand-panel"
        aria-hidden="true"
      >
        {/* Decorative gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full
                       bg-brand-blue/20 blur-3xl"
          />
          <div
            className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full
                       bg-brand-blue/10 blur-3xl"
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                       w-64 h-64 rounded-full bg-brand-blue/5 blur-2xl"
          />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(#fff 1px, transparent 1px),
                                linear-gradient(90deg, #fff 1px, transparent 1px)`,
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-sm text-center px-8 animate-fadeIn">
          <div
            className="w-20 h-20 rounded-2xl bg-brand-blue/20 border border-brand-blue/30
                       flex items-center justify-center mx-auto mb-8"
          >
            <span className="text-4xl font-bold text-brand-blue">UT</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">
            Enterprise Service Management
          </h2>
          <p className="text-brand-muted text-sm leading-relaxed mb-8">
            Manage cases, work orders, and service resources all in one place.
            Built for field operations teams at scale.
          </p>

          {/* Feature list */}
          <ul className="space-y-3 text-left" aria-label="Platform features">
            {[
              { icon: '📋', label: 'Case Management' },
              { icon: '🔧', label: 'Work Order Tracking' },
              { icon: '📊', label: 'SLA Monitoring' },
              { icon: '🏭', label: 'Asset Management' },
            ].map(({ icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 text-sm text-gray-400"
              >
                <span
                  className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center
                             justify-center text-base shrink-0"
                >
                  {icon}
                </span>
                {label}
              </li>
            ))}
          </ul>

          {/* Version badge */}
          <div className="mt-10 inline-flex items-center gap-2 px-3 py-1.5
                          bg-brand-blue/10 border border-brand-blue/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
            <span className="text-xs text-brand-muted">MVP v1.0 — All Systems Operational</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
