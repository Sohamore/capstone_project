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
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

const Auth = () => {
  const navigate = useNavigate();
  const authContext = useAuth(); // use context
  const { toast } = useToast();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null);
  const [unverifiedCredentials, setUnverifiedCredentials] = useState<{ email: string; password: string } | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const handleLoginSuccess = (user, name, options: { delay?: number } = {}) => {
    const userData = {
      uid: user.uid,
      displayName: name,
      email: user.email,
      photoURL: user.photoURL || null
    };
    // persist user locally; do not assume context exposes setCurrentUser
    localStorage.setItem('user', JSON.stringify(userData));
    // reset loading state
    setLoading(false);
    // show success modal first
    setShowSuccessModal(true);
    // show toast notification
    toast({
      title: 'Login Successful!',
      description: 'Welcome to Shri Krishna Steel Works!',
    });
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider || new GoogleAuthProvider());
      const user = result.user;
      const nameToStore = user.displayName || user.email;
      await upsertUserInFirestore(user, nameToStore);
      // redirect to home immediately after Google sign-in
      handleLoginSuccess(user, nameToStore, { delay: 0 });
    } catch (err) {
      // show more detailed error info for debugging
      // eslint-disable-next-line no-console
      console.error('Google sign-in failed', err);
      const code = err?.code || 'unknown_error';
      const message = err?.message || 'An error occurred during Google sign-in.';
      toast({ title: 'Google sign-in failed', description: `${code}: ${message}` });
      // reset loading state on error
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
      // Don't auto-login/redirect — require email verification first
      setInfoMessage({ type: 'success', text: 'Verification email sent. Please check your inbox and verify your email before signing in.' });
      setMode('login');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Email sign-up failed', err);
      const code = err?.code || 'unknown_error';
      const message = err?.message || 'Failed to create account.';
      if (code === 'auth/email-already-in-use') setMode('login');
      toast({ title: 'Sign up failed', description: `${code}: ${message}` });
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
      if (!user.emailVerified) {
        // store credentials temporarily so we can resend verification
        setUnverifiedCredentials({ email, password });
        setInfoMessage({ type: 'error', text: 'Your email is not verified. Please verify your email. You can resend the verification email.' });
        setLoading(false); // reset loading state
        return;
      }
      const nameToStore = user.displayName || user.email;
      await upsertUserInFirestore(user, nameToStore);
      handleLoginSuccess(user, nameToStore);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Email sign-in failed', err);
      const code = err?.code || 'unknown_error';
      const message = err?.message || 'Failed to sign in.';
      toast({ title: 'Sign in failed', description: `${code}: ${message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedCredentials) return;
    setResendLoading(true);
    try {
      // sign in again to obtain user object and resend verification
      const cred = await signInWithEmailAndPassword(auth, unverifiedCredentials.email, unverifiedCredentials.password);
      await sendEmailVerification(cred.user);
      setInfoMessage({ type: 'success', text: 'Verification email resent. Please check your inbox.' });
      // optionally clear stored credentials
      setUnverifiedCredentials(null);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Resend verification failed', err);
      const message = err?.message || 'Failed to resend verification email.';
      setInfoMessage({ type: 'error', text: message });
    } finally {
      setResendLoading(false);
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

          {infoMessage && (
            <div className={`mb-4 text-sm p-3 rounded ${infoMessage.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {infoMessage.text}
            </div>
          )}

          {unverifiedCredentials && (
            <div className="mb-4">
              <div className="text-sm text-muted-foreground mb-2">Didn't receive the email?</div>
              <div className="flex gap-2">
                <Button onClick={handleResendVerification} disabled={resendLoading} className="hero-gradient">{resendLoading ? 'Sending...' : 'Resend Verification'}</Button>
                <Button onClick={() => setUnverifiedCredentials(null)} variant="ghost">Cancel</Button>
              </div>
            </div>
          )}

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

          {/* Success dialog shown after successful login */}
          <Dialog open={showSuccessModal} onOpenChange={(open) => setShowSuccessModal(open)}>
            <DialogContent className="max-w-md mx-auto">
              <DialogHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <DialogTitle className="text-2xl font-bold text-green-600">Login Successful!</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Welcome to Shri Krishna Steel Works! You have successfully logged in with Google.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex-col gap-3 sm:flex-row">
                <Button 
                  onClick={() => { 
                    setShowSuccessModal(false); 
                    navigate('/', { replace: true }); 
                  }} 
                  className="w-full hero-gradient"
                >
                  Go to Home Page
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full"
                >
                  Stay Here
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
    </Layout>
  );
};

export default Auth;
