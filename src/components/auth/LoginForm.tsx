'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import GoogleButton from './GoogleButton';
import { createClient } from '@/lib/supabase';
import { ButtonLoading } from './LoadingSpinner';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for error messages from redirect
    const errorParam = searchParams.get('error');
    if (errorParam === 'session_expired') {
      const errorMsg = 'Your session has expired. Please sign in again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } else if (errorParam === 'auth_failed') {
      const errorMsg = 'Authentication failed. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        toast.error(signInError.message);
      } else if (data.user) {
        // Successfully logged in
        toast.success('Welcome back!');
        // Check if there's a redirect parameter
        const redirect = searchParams.get('redirect') || '/dashboard';
        router.push(redirect);
      }
    } catch (err) {
      const errorMsg = 'An unexpected error occurred';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-gray-600">Sign in to continue to RaceTrackr</p>
      </div>

      {/* Google Sign In */}
      <GoogleButton />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#fc4c02]/31" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or continue with email</span>
        </div>
      </div>

      {/* Login Form */}
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
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-[#fc4c02] border-gray-300 rounded focus:ring-[#fc4c02]" />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-sm text-[#fc4c02] hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#fc4c02] hover:bg-[#e64602] text-white py-3 h-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <ButtonLoading /> : 'Sign in'}
        </Button>
      </form>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-[#fc4c02] font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
