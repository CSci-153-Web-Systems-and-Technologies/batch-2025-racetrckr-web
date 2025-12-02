'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase';
import { ButtonLoading } from '@/components/auth/LoadingSpinner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setEmailSent(true);
        toast.success('Password reset email sent!');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/logo.svg"
              alt="RaceTrackr Logo"
              width={64}
              height={64}
              className="h-16 w-16"
            />
            <h1 className="text-3xl font-bold">Check Your Email</h1>
          </div>

          <div className="bg-[#fc4c02]/10 border border-[#fc4c02]/31 rounded-lg p-6 space-y-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-[#fc4c02] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Password Reset Email Sent</h3>
                <p className="text-sm text-gray-600">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-gray-600">
                  Please check your inbox and click the link to reset your password.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#fc4c02]/20">
              <p className="text-xs text-gray-500">
                Didn't receive the email? Check your spam folder or{' '}
                <button 
                  onClick={() => setEmailSent(false)}
                  className="text-[#fc4c02] hover:underline font-medium"
                >
                  try again
                </button>
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link 
              href="/login" 
              className="text-sm text-[#fc4c02] hover:underline font-medium"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/logo.svg"
            alt="RaceTrackr Logo"
            width={64}
            height={64}
            className="h-16 w-16"
          />
          <h1 className="text-3xl font-bold">Forgot Password?</h1>
          <p className="text-gray-600 text-center">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Reset Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent"
              placeholder="you@example.com"
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#fc4c02] hover:bg-[#e64602] text-white py-3 h-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <ButtonLoading /> : 'Send reset link'}
          </Button>
        </form>

        {/* Back to Login */}
        <p className="text-center text-sm text-gray-600">
          Remember your password?{' '}
          <Link href="/login" className="text-[#fc4c02] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
