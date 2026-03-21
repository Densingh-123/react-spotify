import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IoMusicalNotes, IoMail, IoLockClosed, IoLogoGoogle } from 'react-icons/io5';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/services/firebaseConfig';
import GlassCard from '@/components/ui/GlassCard';
import BlobBackground from '@/components/ui/BlobBackground';
import { useTheme } from '@/context/ThemeContext';

export default function LoginPage() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromPath = searchParams.get('from') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true); setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(fromPath, { replace: true });
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    if (!auth) {
      setError('Firebase Auth not initialized correctly.');
      return;
    }
    setLoading(true); setError('');
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      console.log('Attempting Google Sign-In with:', { auth, provider });
      await signInWithPopup(auth, provider);
      navigate(fromPath, { replace: true });
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      const m = err.code === 'auth/popup-blocked' ? 'Popup blocked! Please allow popups for this site.'
        : err.code === 'auth/popup-closed-by-user' ? 'Login popup was closed.' 
        : err.code === 'auth/argument-error' ? 'Configuration error (auth/argument-error). Please verify your Firebase project setup.'
        : err.message || 'An unexpected error occurred during Google Sign-In.';
      setError(m);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <BlobBackground />
      <GlassCard style={{ width: '100%', maxWidth: 420, padding: 36, borderRadius: 28, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 22, background: colors.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', boxShadow: `0 8px 24px ${colors.primary}55`,
          }}>
            <img src="/logo.png" alt="Melodify" style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover' }} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: colors.text, marginBottom: 6 }}>Welcome Back</h1>
          <p style={{ fontSize: 14, color: colors.textSecondary }}>Login to continue your musical journey</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="input-wrapper" style={{ background: colors.surface, borderColor: colors.glassBorder }}>
            <IoMail size={20} color={colors.textSecondary} />
            <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)}
              style={{ flex: 1, color: colors.text, fontSize: 15 }} />
          </div>
          <div className="input-wrapper" style={{ background: colors.surface, borderColor: colors.glassBorder }}>
            <IoLockClosed size={20} color={colors.textSecondary} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
              style={{ flex: 1, color: colors.text, fontSize: 15 }} />
          </div>

          {error && <p style={{ color: '#ff4444', fontSize: 13, textAlign: 'center' }}>{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading} style={{ background: colors.primary, opacity: loading ? 0.7 : 1 }}>
            {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : 'Login'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
            <div style={{ flex: 1, height: 1, background: colors.glassBorder }} />
            <span style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 700 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: colors.glassBorder }} />
          </div>

          <button type="button" onClick={handleGoogle} className="btn-ghost"
            style={{ borderColor: colors.glassBorder, color: colors.text, justifyContent: 'center', gap: 10 }}>
            <IoLogoGoogle size={20} /> Continue with Google
          </button>

          <p style={{ textAlign: 'center', fontSize: 14, color: colors.textSecondary, marginTop: 12 }}>
            Don't have an account?{' '}
            <span onClick={() => navigate(`/register?from=${encodeURIComponent(fromPath)}`)} style={{ color: colors.primary, fontWeight: 700, cursor: 'pointer' }}>Register</span>
          </p>
        </form>
      </GlassCard>
    </div>
  );
}
