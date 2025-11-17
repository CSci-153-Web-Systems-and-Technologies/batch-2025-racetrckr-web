'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              Find Races
            </Link>
            <Link href="/addrace" className="text-black-700 hover:text-[#fc4c02] transition-colors font-medium">
              Add Race
            </Link>
          </div>

          {/* Desktop Logout Button */}
          <div className="hidden lg:block">
            <Button variant="outline" className="hover:bg-red-50 hover:text-red-600 hover:border-red-600 transition-colors">
              <LogOut />
              Logout
            </Button>
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
                Find Races
              </Link>
              <Link 
                href="/addraace" 
                className="px-4 py-2 text-gray-700 hover:text-[#fc4c02] hover:bg-orange-50 rounded-md transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Add Race
              </Link>
              <Button variant="outline" className="w-full justify-start hover:bg-red-50 hover:text-red-600 hover:border-red-600 transition-colors">
                <LogOut />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
