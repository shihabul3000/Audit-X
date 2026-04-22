import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { verifyOtpSchema, VerifyOtpFormData } from '../../validation/auth.schema';
import toast from 'react-hot-toast';

export const VerifyEmail: React.FC = () => {
  const [resending, setResending] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // Expect email to be passed in location state from registration
  const email = location.state?.email;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
  });

  const onSubmit = async (data: VerifyOtpFormData) => {
    if (!email) {
      toast.error('Missing email address. Please log in again.');
      navigate('/auth');
      return;
    }

    try {
      await authService.verifyEmail({ email, otp: data.otp });
      toast.success('Email verified successfully! You can now log in.');
      navigate('/auth');
    } catch (error: any) {
      toast.error(error.message || 'Invalid or expired OTP');
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      await authService.resendOtp(email);
      toast.success('New OTP sent to your email.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
        <div className="text-center p-8 bg-[#1e1e1e] rounded-2xl border border-gray-800">
          <h2 className="text-xl text-red-400 mb-4">Verification Context Lost</h2>
          <button onClick={() => navigate('/auth')} className="text-blue-400 hover:underline">
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1e1e1e] rounded-2xl shadow-2xl p-8 border border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Verify Your Email</h1>
          <p className="text-gray-400">
            We sent a 6-digit code to <span className="text-white">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Verification Code</label>
            <input
              {...register('otp')}
              type="text"
              maxLength={6}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-xl text-white text-center text-2xl tracking-widest focus:ring-2 focus:ring-blue-500"
              placeholder="000000"
            />
            {errors.otp && <p className="text-red-400 text-sm mt-1 text-center">{errors.otp.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors mt-6"
          >
            {isSubmitting ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Didn't receive the code?{' '}
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors disabled:opacity-50"
          >
            {resending ? 'Sending...' : 'Resend Code'}
          </button>
        </div>
      </div>
    </div>
  );
};
