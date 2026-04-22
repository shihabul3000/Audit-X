import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { resetPasswordSchema, ResetPasswordFormData } from '../../validation/auth.schema';
import toast from 'react-hot-toast';

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }

    try {
      await authService.resetPassword({ token, newPassword: data.newPassword });
      toast.success('Password has been reset successfully');
      navigate('/auth');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
        <div className="text-center p-8 bg-[#1e1e1e] rounded-2xl">
          <h2 className="text-xl text-red-400 mb-4">Invalid Reset Link</h2>
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
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Set New Password</h1>
          <p className="text-gray-400">Please choose a strong password</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
            <input
              {...register('newPassword')}
              type="password"
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
              placeholder="At least 8 characters"
            />
            {errors.newPassword && <p className="text-red-400 text-sm mt-1">{errors.newPassword.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
            <input
              {...register('confirmPassword')}
              type="password"
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Repeat new password"
            />
            {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors mt-6"
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
