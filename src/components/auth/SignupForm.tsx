'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import GoogleButton from './shared/GoogleButton';
import { createClient } from '@/lib/supabase';
import { ButtonLoading } from './shared/LoadingSpinner';

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: name,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        toast.error(signUpError.message);
      } else if (data.user) {
        // Check if email confirmation is required
        if (data.user.identities && data.user.identities.length === 0) {
          // Email already exists but not confirmed
          const errorMsg = 'This email is already registered. Please check your inbox for verification.';
          setError(errorMsg);
          toast.error(errorMsg);
        } else if (data.user.confirmed_at) {
          // Email confirmed, redirect to dashboard
          toast.success('Account created successfully!');
          router.push('/dashboard');
        } else {
          // Show verification notice
          toast.success('Verification email sent! Please check your inbox.');
          setShowVerificationNotice(true);
        }
      }
    } catch (err) {
      const errorMsg = 'An unexpected error occurred';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // If verification notice is shown, display that instead of the form
  if (showVerificationNotice) {
    return (
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
              <h3 className="font-semibold text-gray-900">Verify Your Email Address</h3>
              <p className="text-sm text-gray-600">
                We've sent a verification email to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-600">
                Please check your inbox and click the verification link to activate your account.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#fc4c02]/20">
            <p className="text-xs text-gray-500">
              Didn't receive the email? Check your spam folder or{' '}
              <button 
                onClick={() => setShowVerificationNotice(false)}
                className="text-[#fc4c02] hover:underline font-medium"
              >
                try signing up again
              </button>
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/login" 
            className="text-sm text-[#fc4c02] hover:underline font-medium"
          >
            Already verified? Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
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
        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="text-gray-600">Start tracking your races today</p>
      </div>

      {/* Google Sign Up */}
      <GoogleButton mode="signup" />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#fc4c02]/31" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or continue with email</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent"
            placeholder="John Doe"
            required
          />
        </div>

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
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4c02] focus:border-transparent"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>

        <div className="flex items-start gap-2">
          <input 
            type="checkbox" 
            id="terms"
            className="w-4 h-4 mt-1 text-[#fc4c02] border-gray-300 rounded focus:ring-[#fc4c02]" 
            required
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the{' '}
            <Link href="/terms" className="text-[#fc4c02] hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-[#fc4c02] hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#fc4c02] hover:bg-[#e64602] text-white py-3 h-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <ButtonLoading /> : 'Create account'}
        </Button>
      </form>

      {/* Sign In Link */}
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-[#fc4c02] font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
