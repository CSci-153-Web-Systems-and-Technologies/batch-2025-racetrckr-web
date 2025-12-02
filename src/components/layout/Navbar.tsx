'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, LogOut, User } from 'lucide-react';
import LogoutModal from '@/components/navbar/LogoutModal';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    // Add your logout logic here (e.g., clear session, redirect to login)
    console.log('User logged out');
    setShowLogoutModal(false);
    // Example: router.push('/login');
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
            <Link href="/profile" className="w-10 h-10 rounded-full bg-[#fc4c02] flex items-center justify-center hover:bg-[#e64602] transition-colors">
              <User className="w-5 h-5 text-white" />
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
                className="px-4 py-2 text-gray-700 hover:text-[#fc4c02] hover:bg-orange-50 rounded-md transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
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
