import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoPersonAdd, IoMail, IoLockClosed, IoPerson } from 'react-icons/io5';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/services/firebaseConfig';
import GlassCard from '@/components/ui/GlassCard';
import BlobBackground from '@/components/ui/BlobBackground';
import { useTheme } from '@/context/ThemeContext';

export default function RegisterPage() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true); setError('');
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      await setDoc(doc(db, 'users', cred.user.uid), { name, email, createdAt: new Date().toISOString() });
      navigate('/');
    } catch (err: any) {
      setError(err.code === 'auth/email-already-in-use' ? 'Email already registered. Please login instead.' : err.message);
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
            <IoPersonAdd size={38} color="#fff" />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: colors.text, marginBottom: 6 }}>Create Account</h1>
          <p style={{ fontSize: 14, color: colors.textSecondary }}>Join BloomeeTunes and explore a world of music</p>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { Icon: IoPerson, placeholder: 'Full Name', value: name, setter: setName, type: 'text' },
            { Icon: IoMail, placeholder: 'Email Address', value: email, setter: setEmail, type: 'email' },
            { Icon: IoLockClosed, placeholder: 'Password', value: password, setter: setPassword, type: 'password' },
          ].map(({ Icon, placeholder, value, setter, type }) => (
            <div key={placeholder} className="input-wrapper" style={{ background: colors.surface, borderColor: colors.glassBorder }}>
              <Icon size={20} color={colors.textSecondary} />
              <input type={type} placeholder={placeholder} value={value}
                onChange={e => setter(e.target.value)} style={{ flex: 1, color: colors.text, fontSize: 15 }} />
            </div>
          ))}

          {error && <p style={{ color: '#ff4444', fontSize: 13, textAlign: 'center' }}>{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading} style={{ background: colors.primary, opacity: loading ? 0.7 : 1 }}>
            {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : 'Create Account'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 14, color: colors.textSecondary, marginTop: 12 }}>
            Already have an account?{' '}
            <span onClick={() => navigate('/login')} style={{ color: colors.primary, fontWeight: 700, cursor: 'pointer' }}>Login</span>
          </p>
        </form>
      </GlassCard>
    </div>
  );
}
