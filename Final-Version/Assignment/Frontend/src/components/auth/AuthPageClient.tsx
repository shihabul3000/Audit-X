'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authClient } from '@/lib/authClient';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Loader2, Fingerprint } from 'lucide-react';

type AuthMode = 'login' | 'register' | 'verify-otp';

export function AuthPageClient() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const redirectByRole = async (roleHint?: string) => {
    // If we have a role hint from signIn response, use it directly
    const r = (roleHint || '').toUpperCase();
    if (r === 'SUPER_ADMIN' || r === 'ADMIN') {
      router.push(r === 'SUPER_ADMIN' ? '/dashboard/system' : '/dashboard/admin');
      return;
    }
    if (r === 'STUDENT') {
      router.push('/dashboard/my-companies');
      return;
    }
    // Fallback: fetch from API (for OTP verify or when role not in signIn response)
    try {
      const res = await fetch('/api/v1/users/me', { credentials: 'include' });
      const json = await res.json();
      const role = (json?.data?.role || '').toUpperCase();
      if (role === 'SUPER_ADMIN') {
        router.push('/dashboard/system');
      } else if (role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/my-companies');
      }
    } catch {
      router.push('/dashboard/my-companies');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) {
        if (result.error.code === 'EMAIL_NOT_VERIFIED') {
          setMode('verify-otp');
          toast.info('Please verify your email. Check your inbox for OTP.');
        } else {
          toast.error(result.error.message || 'Sign in failed');
        }
      } else {
        toast.success('Welcome back!');
        // Get role from signIn response (fallback to API call if not present)
        const roleFromResponse = (result.data as any)?.user?.role as string | undefined;
        await redirectByRole(roleFromResponse);
      }
    } catch {
      toast.error('Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await authClient.signUp.email({ name, email, password });
      if (result.error) {
        toast.error(result.error.message || 'Registration failed');
      } else {
        setMode('verify-otp');
        toast.success('Account created! Check your email for OTP verification.');
      }
    } catch {
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Use direct API call for OTP verification
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/email-otp/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, otp }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || 'OTP verification failed');
      } else {
        toast.success('Email verified! Signing you in...');
        await redirectByRole();
      }
    } catch {
      toast.error('OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({ provider: 'google', callbackURL: '/dashboard' });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Gradients & Orbs */}
      <div className="absolute top-0 inset-x-0 h-full w-full pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full mix-blend-screen blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] bg-emerald-600/20 rounded-full mix-blend-screen blur-[120px]"
        />
        <div className="absolute bottom-[-20%] left-[20%] w-[400px] h-[400px] bg-blue-600/20 rounded-full mix-blend-screen blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800/60 p-8 sm:p-10 overflow-hidden relative">
          
          {/* Subtle top glare */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-emerald-400 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20"
            >
              <ShieldCheck className="text-white w-8 h-8" />
            </motion.div>
            <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
              {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Account' : 'Verify Email'}
            </h1>
            <p className="text-slate-400 text-sm">
              {mode === 'login'
                ? 'Sign in to your intelligent audit workspace'
                : mode === 'register'
                ? 'Join to start managing financial years'
                : `Enter the 6-digit code sent to ${email}`}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'verify-otp' ? (
              <motion.form 
                key="otp-form"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyOTP} className="space-y-6"
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Fingerprint className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="text" required maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl text-white text-center text-2xl tracking-[0.5em] focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-700"
                    placeholder="000000"
                  />
                </div>
                
                <button type="submit" disabled={loading} className="group relative w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-70 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center overflow-hidden">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Continue'}
                  {!loading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
                
                <button type="button" onClick={() => setMode('login')} className="w-full text-sm text-slate-400 hover:text-white transition-colors">
                  Back to login
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="auth-form"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-5"
              >
                {mode === 'register' && (
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    </div>
                    <input
                      type="text" required value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                      placeholder="Full Name"
                    />
                  </div>
                )}
                
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                    placeholder="Email Address"
                  />
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <input
                    type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                    placeholder="Password"
                  />
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={loading} className="group w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-70 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === 'login' ? 'Sign In' : 'Create Account'}
                    {!loading && <ArrowRight className="ml-2 w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />}
                  </button>
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
                  <div className="relative flex justify-center text-sm"><span className="px-3 bg-slate-900/60 text-slate-500 text-xs uppercase tracking-wider font-semibold backdrop-blur-xl">Or continue with</span></div>
                </div>

                <button type="button" onClick={handleGoogleLogin} className="w-full py-3.5 px-4 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {mode !== 'verify-otp' && (
            <div className="mt-8 text-center text-sm text-slate-400">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
