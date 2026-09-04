import React, { useState, useEffect } from 'react';
import { Button, Input, Alert } from '@ecommerce/ui';
import { useAuth } from '../context/AuthContext.jsx';

export function LoginPage({ onNavigateRegister, onNavigateForgot, onSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      await login(email, password);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card-container">
      <div className="auth-card">
        <h2>Sign In to ApexStore</h2>
        <p className="auth-subtitle">Access your account, wishlist, and orders</p>

        {error && <Alert variant="danger">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <div className="label-with-link">
              <label>Password</label>
              <button
                type="button"
                className="text-link-btn"
                onClick={onNavigateForgot}
              >
                Forgot?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="form-input"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="auth-footer-text">
          Don't have an account?{' '}
          <button className="text-link-btn" onClick={onNavigateRegister}>
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage({ onNavigateLogin, onRegistered }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      const res = await register(form);
      onRegistered(form.email, res?.otp);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card-container">
      <div className="auth-card">
        <h2>Create an Account</h2>
        <p className="auth-subtitle">Join ApexStore for the best online shopping</p>

        {error && <Alert variant="danger">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <div className="form-row-two">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Password (min 8 chars)</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              minLength={8}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Phone (Optional)</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="form-input"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        <div className="auth-footer-text">
          Already have an account?{' '}
          <button className="text-link-btn" onClick={onNavigateLogin}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export function VerifyEmailPage({ email, testOtp, onVerified, onNavigateLogin }) {
  const { verifyEmail, resendVerification } = useAuth();
  const [otp, setOtp] = useState(testOtp || '');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      await verifyEmail(email, otp);
      onVerified();
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      setError(null);
      const res = await resendVerification(email);
      setMessage(res.message);
      if (res.otp) setOtp(res.otp);
      setCooldown(60);
    } catch (err) {
      setError(err.message || 'Failed to resend code');
    }
  };

  return (
    <div className="auth-card-container">
      <div className="auth-card">
        <h2>Verify Your Email</h2>
        <p className="auth-subtitle">
          We sent a 6-digit verification code to <strong>{email}</strong>
        </p>

        {testOtp && (
          <Alert variant="info">
            Development Mode OTP: <strong>{testOtp}</strong>
          </Alert>
        )}

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label>6-Digit Verification Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              placeholder="123456"
              required
              className="form-input otp-input"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify Account'}
          </Button>
        </form>

        <div className="auth-resend-row">
          <span>Didn't receive the code?</span>
          <button
            type="button"
            className="text-link-btn"
            disabled={cooldown > 0}
            onClick={handleResend}
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend Code'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ForgotPasswordPage({ onNavigateLogin, onCodeSent }) {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      const res = await forgotPassword(email);
      setMessage(res.message);
      onCodeSent(email, res?.resetToken);
    } catch (err) {
      setError(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card-container">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <p className="auth-subtitle">
          Enter your registered email address to receive password reset instructions
        </p>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="form-input"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Code'}
          </Button>
        </form>

        <div className="auth-footer-text">
          Remember your password?{' '}
          <button className="text-link-btn" onClick={onNavigateLogin}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export function ResetPasswordPage({ email, testToken, onSuccess, onNavigateLogin }) {
  const { resetPassword } = useAuth();
  const [token, setToken] = useState(testToken || '');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      await resetPassword(email, token, newPassword);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card-container">
      <div className="auth-card">
        <h2>Set New Password</h2>
        <p className="auth-subtitle">
          Enter the code sent to <strong>{email}</strong> along with your new password
        </p>

        {testToken && (
          <Alert variant="info">
            Development Reset Code: <strong>{testToken}</strong>
          </Alert>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Reset Code / Token</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="6-digit code"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>New Password (min 8 chars)</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              required
              className="form-input"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Resetting Password...' : 'Update Password'}
          </Button>
        </form>

        <div className="auth-footer-text">
          <button className="text-link-btn" onClick={onNavigateLogin}>
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
