'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

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
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 transition-colors">
              Dashboard
            </Link>
            <Link href="/find-races" className="text-gray-700 hover:text-gray-900 transition-colors">
              Find Races
            </Link>
            <Link href="/add-race" className="text-gray-700 hover:text-gray-900 transition-colors">
              Add Race
            </Link>
          </div>

          {/* Desktop Logout Button */}
          <div className="hidden lg:block">
            <button className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
              Logout
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
                className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/find-races" 
                className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Races
              </Link>
              <Link 
                href="/add-race" 
                className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Add Race
              </Link>
              <button className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors text-left">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
