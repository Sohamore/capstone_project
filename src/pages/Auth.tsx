import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, sendPasswordResetEmail, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

const Auth = () => {
  const [mode, setMode] = useState<'signup' | 'signin'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const navigate = useNavigate();

  // Initialize reCAPTCHA when component mounts
  useEffect(() => {
    const initializeRecaptcha = () => {
      try {
        // Check if reCAPTCHA container exists
        const container = document.getElementById('recaptcha-container');
        if (!container) {
          console.error('reCAPTCHA container not found');
          setError('reCAPTCHA container not found. Please refresh the page.');
          return;
        }

        // Clear any existing reCAPTCHA
        if (recaptchaVerifier) {
          recaptchaVerifier.clear();
        }

        // Try invisible reCAPTCHA first, fallback to visible if needed
        let verifier;
        try {
          verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: () => {
              console.log('reCAPTCHA solved');
            },
            'expired-callback': () => {
              console.log('reCAPTCHA expired');
              setError('reCAPTCHA expired. Please try again.');
            },
            'error-callback': (error: any) => {
              console.error('reCAPTCHA error:', error);
              setError('reCAPTCHA error. Please refresh the page.');
            }
          });
        } catch (invisibleError) {
          console.warn('Invisible reCAPTCHA failed, trying visible:', invisibleError);
          // Fallback to visible reCAPTCHA
          verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'normal',
            callback: () => {
              console.log('reCAPTCHA solved');
            },
            'expired-callback': () => {
              console.log('reCAPTCHA expired');
              setError('reCAPTCHA expired. Please try again.');
            },
            'error-callback': (error: any) => {
              console.error('reCAPTCHA error:', error);
              setError('reCAPTCHA error. Please refresh the page.');
            }
          });
        }
        
        setRecaptchaVerifier(verifier);
        console.log('reCAPTCHA initialized successfully');
      } catch (error) {
        console.error('Error initializing reCAPTCHA:', error);
        setError('Failed to initialize reCAPTCHA. Please refresh the page.');
      }
    };

    // Wait for DOM and reCAPTCHA script to be ready
    const timer = setTimeout(initializeRecaptcha, 500);
    return () => {
      clearTimeout(timer);
      // Cleanup reCAPTCHA verifier
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear();
        } catch (error) {
          console.error('Error clearing reCAPTCHA:', error);
        }
      }
    };
  }, []);

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      setError('Please enter a valid phone number');
      return;
    }

    // Check for billing error and provide demo mode
    if (!recaptchaVerifier) {
      setError('reCAPTCHA not initialized. Please refresh the page.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Format phone number (ensure it starts with +)
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      console.log('Attempting to send OTP to:', formattedPhone);
      console.log('reCAPTCHA verifier:', recaptchaVerifier);
      
      const result = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
      setConfirmationResult(result);
      setError(null);
      alert('OTP sent successfully! Check your phone.');
    } catch (err: any) {
      console.error('Error sending OTP:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      
      // Handle billing error specifically
      if (err.code === 'auth/billing-not-enabled') {
        setError('Billing required. Using demo mode instead.');
        // Enable demo mode
        enableDemoMode();
      } else if (err.code === 'auth/internal-error') {
        setError('Configuration error. Please check Firebase settings.');
      } else {
        setError(formatPhoneAuthError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  // Demo mode for testing without billing
  const enableDemoMode = () => {
    const demoCode = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtp(demoCode);
    alert(`Demo OTP: ${demoCode}`);
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult && !sentOtp) {
      setError('Please request an OTP first.');
      return;
    }

    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Check if we're in demo mode
      if (sentOtp && !confirmationResult) {
        if (otp === sentOtp) {
          console.log('Demo mode: OTP verified successfully');
          alert('✅ Welcome! You have successfully signed in via phone authentication.');
          navigate('/');
        } else {
          setError('Incorrect OTP. Please check and try again.');
        }
        return;
      }
      
      // Real Firebase verification
      if (confirmationResult) {
        const result = await confirmationResult.confirm(otp);
        const user = result.user;
        console.log('User logged in:', user.phoneNumber);
        alert('✅ Welcome! You have successfully signed in via phone authentication.');
        navigate('/');
      }
    } catch (err: any) {
      console.error('Error verifying OTP:', err);
      setError(formatPhoneAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async () => {
    try {
      setLoading(true);
      setError(null);
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      try {
        await sendEmailVerification(cred.user);
      } catch {}
      
      // Professional success message
      alert('🎉 Welcome! Your account has been created successfully. You are now signed up as a new user.');
      navigate('/');
    } catch (err: any) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      
      // Professional success message
      alert('✅ Welcome back! You have successfully signed in to your account.');
      navigate('/');
    } catch (err: any) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      setError(null);
      await sendPasswordResetEmail(auth, email.trim());
      alert('Password reset email sent. Check your inbox.');
    } catch (err: any) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  function formatAuthError(err: any): string {
    const code = String(err?.code || '').replace('auth/', '');
    switch (code) {
      case 'invalid-credential':
        return 'Email or password is incorrect.';
      case 'user-not-found':
        return 'No account found for this email.';
      case 'wrong-password':
        return 'Incorrect password.';
      case 'too-many-requests':
        return 'Too many attempts. Try again later or reset password.';
      case 'network-request-failed':
        return 'Network error. Check your connection.';
      default:
        return `Firebase error: ${code || 'unknown'}`;
    }
  }

  function formatPhoneAuthError(err: any): string {
    const code = String(err?.code || '').replace('auth/', '');
    switch (code) {
      case 'invalid-phone-number':
        return 'Invalid phone number format.';
      case 'too-many-requests':
        return 'Too many attempts. Try again later.';
      case 'quota-exceeded':
        return 'SMS quota exceeded. Try again later.';
      case 'invalid-verification-code':
        return 'Invalid OTP. Please check and try again.';
      case 'invalid-verification-id':
        return 'Invalid verification. Please request a new OTP.';
      case 'network-request-failed':
        return 'Network error. Check your connection.';
      default:
        return `Phone auth error: ${code || 'unknown'}`;
    }
  }

  return (
    <Layout>
      <section className="py-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 bg-background rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold mb-4 text-center">Client Portal Authentication</h1>

          <div className="flex justify-center gap-3 mb-6">
            <Button size="sm" variant={mode === 'signin' ? 'default' : 'ghost'} onClick={() => setMode('signin')}>Sign In</Button>
            <Button size="sm" variant={mode === 'signup' ? 'default' : 'ghost'} onClick={() => setMode('signup')}>Sign Up</Button>
          </div>

          {/* Email form */}
          <div className="space-y-3 mb-6">
            <label className="block text-sm font-medium">Email</label>
            <Input value={email} onChange={(e) => setEmail((e.target as HTMLInputElement).value)} placeholder="you@example.com" />

            <label className="block text-sm font-medium">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword((e.target as HTMLInputElement).value)} placeholder="Password" />

            {mode === 'signup' ? (
              <Button className="w-full hero-gradient" onClick={handleEmailSignUp} disabled={loading}>
                {loading ? 'Creating...' : 'Create account & verify email'}
              </Button>
            ) : (
            <div className="flex gap-2">
              <Button className="flex-1 hero-gradient" onClick={handleEmailSignIn} disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in with email'}
              </Button>
              <Button variant="outline" onClick={handleResetPassword} disabled={loading}>
                Reset
              </Button>
            </div>
            )}
          </div>

        {error && (
          <div className="text-sm text-red-600 mb-4" role="alert">
            {error}
          </div>
        )}

          <div className="flex items-center my-4">
            <hr className="flex-1 border-border" />
            <span className="px-4 text-sm text-muted-foreground">OR</span>
            <hr className="flex-1 border-border" />
          </div>

          {/* Phone verification form */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Mobile / Phone</label>
            <Input 
              value={phone} 
              onChange={(e) => setPhone((e.target as HTMLInputElement).value)} 
              placeholder="+91xxxxxxxxxx" 
              disabled={loading}
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleSendOtp} 
                className="flex-1 hero-gradient" 
                disabled={loading || !phone.trim()}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </Button>
              <Button 
                onClick={handleVerifyOtp} 
                className="flex-1" 
                disabled={loading || (!confirmationResult && !sentOtp) || !otp.trim()}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </div>
            
            {/* Demo mode button */}
            <Button 
              onClick={enableDemoMode} 
              variant="outline" 
              className="w-full"
              disabled={loading}
            >
              Demo Mode
            </Button>

            <label className="block text-sm font-medium">Enter OTP</label>
            <Input 
              value={otp} 
              onChange={(e) => setOtp((e.target as HTMLInputElement).value)} 
              placeholder="123456" 
              disabled={loading || !confirmationResult}
            />
            
            {/* reCAPTCHA container */}
            <div id="recaptcha-container"></div>
            
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Enter phone number with country code (e.g., +91 for India).
            <br />
            Use Demo Mode for testing without billing setup.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Auth;
