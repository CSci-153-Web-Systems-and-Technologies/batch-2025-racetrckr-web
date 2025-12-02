'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase';
import { CheckCircle, XCircle, User as UserIcon } from 'lucide-react';

export default function AuthStatus() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[280px] max-w-[320px]">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-sm text-gray-900">Auth Status</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-[#fc4c02] rounded-full animate-spin" />
            <span>Checking auth...</span>
          </div>
        ) : user ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-green-700 font-medium">Signed In</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 rounded p-2">
              <UserIcon className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <div className="flex flex-col gap-1 min-w-0">
                <span className="font-medium truncate">{user.email}</span>
                {user.user_metadata?.full_name && (
                  <span className="text-gray-500 truncate">{user.user_metadata.full_name}</span>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-400 pt-1">
              ID: {user.id.slice(0, 8)}...
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span className="text-red-700 font-medium">Not Signed In</span>
          </div>
        )}
      </div>
    </div>
  );
}
