import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth(); // use context
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const upsertUserInFirestore = async (user, name) => {
    await setDoc(
      doc(db, 'users', user.uid),
      {
        uid: user.uid,
        name: name || user.displayName || null,
        email: user.email,
        photoURL: user.photoURL || null,
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    );
  };

  const handleLoginSuccess = (user, name) => {
    const userData = {
      uid: user.uid,
      displayName: name,
      email: user.email,
      photoURL: user.photoURL || null
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentUser(userData);
    navigate('/'); // redirect to home
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider || new GoogleAuthProvider());
      const user = result.user;
      const nameToStore = user.displayName || user.email;
      await upsertUserInFirestore(user, nameToStore);
      handleLoginSuccess(user, nameToStore);
    } catch (err) {
      alert(`Google sign-in failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert('Please enter email and password.');
    if (password.length < 6) return alert('Password must be at least 6 characters.');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await sendEmailVerification(user);
      const nameToStore = displayName || user.email;
      await upsertUserInFirestore(user, nameToStore);
      handleLoginSuccess(user, nameToStore);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setMode('login');
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert('Please enter email and password.');
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (!user.emailVerified) return alert('Please verify your email first.');
      const nameToStore = user.displayName || user.email;
      await upsertUserInFirestore(user, nameToStore);
      handleLoginSuccess(user, nameToStore);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="py-20 flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-10 text-center">
          <h1 className="text-3xl font-extrabold mb-8">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </h1>

          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Full name (optional)"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="border p-3 rounded-lg mb-4 w-full"
            />
          )}

          <form onSubmit={mode === 'login' ? handleEmailSignIn : handleEmailSignUp} className="flex flex-col gap-4 mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border p-3 rounded-lg w-full"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border p-3 rounded-lg w-full"
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Sign up'}
            </Button>
          </form>

          <div className="text-sm mt-2">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="text-blue-600 underline">
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="text-blue-600 underline">
                  Sign in
                </button>
              </>
            )}
          </div>

          <div className="text-sm text-muted-foreground my-4 font-semibold">OR</div>

          <Button onClick={handleGoogleSignIn} disabled={loading} className="w-full py-3">
            Continue with Google
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Auth;
