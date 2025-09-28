import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [mode, setMode] = useState<'signup' | 'signin'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState<string | null>(null);
  const navigate = useNavigate();

  // NOTE: This file provides a UI and simulated flows for email/phone verification.
  // For production you should wire these handlers to Firebase Auth or another
  // authentication provider. See README comments below.

  const handleSendOtp = () => {
    // simulate sending OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtp(code);
    // In a real app you'd send via Firebase or SMS provider
    // For now we show it in an alert for testing
    alert(`Simulated OTP (for demo): ${code}`);
  };

  const handleVerifyOtp = () => {
    if (!sentOtp) {
      alert('Please request an OTP first.');
      return;
    }
    if (otp === sentOtp) {
      alert('Phone verified (simulated). Proceeding to client portal.');
      navigate('/projects');
    } else {
      alert('Incorrect OTP.');
    }
  };

  const handleEmailSignUp = () => {
    // Simulated sign-up: in real app call createUserWithEmailAndPassword + sendEmailVerification
    alert(`Simulated sign up for ${email}. In production, wire to Firebase Auth.`);
    navigate('/projects');
  };

  const handleEmailSignIn = () => {
    // Simulated sign-in: in real app call signInWithEmailAndPassword
    alert(`Simulated sign in for ${email}. In production, wire to Firebase Auth.`);
    navigate('/projects');
  };

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
              <Button className="w-full hero-gradient" onClick={handleEmailSignUp}>Create account & verify email</Button>
            ) : (
              <Button className="w-full hero-gradient" onClick={handleEmailSignIn}>Sign in with email</Button>
            )}
          </div>

          <div className="flex items-center my-4">
            <hr className="flex-1 border-border" />
            <span className="px-4 text-sm text-muted-foreground">OR</span>
            <hr className="flex-1 border-border" />
          </div>

          {/* Phone verification form (simulated) */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Mobile / Phone</label>
            <Input value={phone} onChange={(e) => setPhone((e.target as HTMLInputElement).value)} placeholder="+91xxxxxxxxxx" />
            <div className="flex gap-2">
              <Button onClick={handleSendOtp} className="flex-1 hero-gradient">Send OTP</Button>
              <Button onClick={handleVerifyOtp} className="flex-1">Verify OTP</Button>
            </div>

            <label className="block text-sm font-medium">Enter OTP</label>
            <Input value={otp} onChange={(e) => setOtp((e.target as HTMLInputElement).value)} placeholder="123456" />
          </div>

          <p className="text-xs text-muted-foreground mt-4">Note: This page uses simulated verification flows. To enable real email/phone verification, integrate Firebase Auth and replace the simulated handlers with Firebase calls (createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signInWithPhoneNumber, etc.).</p>
        </div>
      </section>
    </Layout>
  );
};

export default Auth;
