import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../../validation/auth.schema';
import toast from 'react-hot-toast';

export const ForgotPassword: React.FC = () => {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await authService.forgotPassword(data.email);
      setSuccess(true);
      toast.success('Reset link sent if the account exists');
    } catch (error: any) {
      toast.error(error.message || 'Failed to request password reset');
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1e1e1e] rounded-2xl shadow-2xl p-8 border border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Forgot Password</h1>
          <p className="text-gray-400">
            Enter your email to receive a password reset link
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400">
              A recovery link has been sent to your email address. Please check your inbox.
            </div>
            <Link to="/auth" className="inline-block text-blue-400 hover:text-blue-300 font-medium">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="name@company.com"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors mt-6 shadow-lg shadow-blue-500/30"
            >
              {isSubmitting ? 'Sending Request...' : 'Send Reset Link'}
            </button>
            <div className="text-center pt-2">
              <Link to="/auth" className="text-sm text-gray-400 hover:text-white transition-colors">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
