'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Menu, X, LogOut } from 'lucide-react';
import LogoutModal from '@/components/navbar/LogoutModal';
import { createClient } from '@/lib/supabase';
import { getAvatarUrl, getInitials } from '@/lib/avatar';

interface UserProfile {
  id: string;
  first_name: string | null;
  avatar_url: string | null;
  google_avatar_url: string | null;
}

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('id, first_name, avatar_url, google_avatar_url')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setShowLogoutModal(false);
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Image
                src="/logo.svg"
                alt="RaceTrackr Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-xl font-semibold">RaceTrackr</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-15">
            <Link href="/dashboard" className="text-black-700 hover:text-[#fc4c02] transition-colors font-medium">
              Dashboard
            </Link>
            <Link href="/events" className="text-black-700 hover:text-[#fc4c02] transition-colors font-medium">
              Events
            </Link>
            <Link href="/addrace" className="text-black-700 hover:text-[#fc4c02] transition-colors font-medium">
              Add Race
            </Link>
          </div>

          {/* Desktop Profile & Logout */}
          <div className="hidden lg:flex items-center gap-3">
            <Link 
              href="/profile" 
              className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-[#fc4c02] transition-colors"
            >
              {userProfile && getAvatarUrl(userProfile.avatar_url, userProfile.google_avatar_url) ? (
                <Image
                  src={getAvatarUrl(userProfile.avatar_url, userProfile.google_avatar_url)!}
                  alt={userProfile.first_name || 'User'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#fc4c02] text-white text-sm font-bold">
                  {userProfile ? getInitials(userProfile.first_name || 'U') : 'U'}
                </div>
              )}
            </Link>
            <button 
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 hover:border-red-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="flex flex-col gap-2">
              <Link 
                href="/dashboard" 
                className="px-4 py-2 text-gray-700 hover:text-[#fc4c02] hover:bg-orange-50 rounded-md transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/events" 
                className="px-4 py-2 text-gray-700 hover:text-[#fc4c02] hover:bg-orange-50 rounded-md transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
              <Link 
                href="/addrace" 
                className="px-4 py-2 text-gray-700 hover:text-[#fc4c02] hover:bg-orange-50 rounded-md transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Add Race
              </Link>
              <Link 
                href="/profile" 
                className="px-4 py-2 flex items-center gap-3 text-gray-700 hover:text-[#fc4c02] hover:bg-orange-50 rounded-md transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                  {userProfile && getAvatarUrl(userProfile.avatar_url, userProfile.google_avatar_url) ? (
                    <Image
                      src={getAvatarUrl(userProfile.avatar_url, userProfile.google_avatar_url)!}
                      alt={userProfile.first_name || 'User'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#fc4c02] text-white text-xs font-bold">
                      {userProfile ? getInitials(userProfile.first_name || 'U') : 'U'}
                    </div>
                  )}
                </div>
                <span>Profile</span>
              </Link>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <button 
                  onClick={() => {
                    setShowLogoutModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 hover:border-red-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </nav>
  );
}
