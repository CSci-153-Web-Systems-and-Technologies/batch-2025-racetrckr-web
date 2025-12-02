'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export function SessionManager({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Set up session refresh
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Handle different auth events
      switch (event) {
        case 'SIGNED_IN':
          console.log('User signed in');
          break;
        case 'SIGNED_OUT':
          console.log('User signed out');
          router.push('/login');
          break;
        case 'TOKEN_REFRESHED':
          console.log('Token refreshed successfully');
          break;
        case 'USER_UPDATED':
          console.log('User data updated');
          break;
        case 'PASSWORD_RECOVERY':
          router.push('/reset-password');
          break;
      }

      // Refresh the page data when session changes
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        router.refresh();
      }
    });

    // Check session validity on mount
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error);
        // Session is invalid, redirect to login
        router.push('/login');
      } else if (!session) {
        console.log('No active session');
      }
    };

    checkSession();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return <>{children}</>;
}
