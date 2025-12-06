'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trophy, TrendingUp, MapPin, Calendar, Timer, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/signup');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="RaceTrckr Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className="text-2xl font-bold text-gray-900">RaceTrckr</span>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleLogin}
                className="text-gray-700 hover:text-gray-900"
              >
                Login
              </Button>
              <Button
                onClick={handleGetStarted}
                className="bg-[#fc4c02] hover:bg-[#e63d00] text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#FF6B00] to-[#FF8C33] text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Hero Content */}
            <div className="space-y-6 lg:space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Trophy className="w-4 h-4" />
                <span className="text-sm">Track. Race. Achieve.</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Your Running Journey Starts Here
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 max-w-xl">
                Track your race progress, discover upcoming events, and celebrate your achievements with RaceTrckr - the ultimate companion for every runner.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={handleGetStarted}
                  className="bg-white text-[#FF6B00] px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-colors shadow-lg h-auto"
                  size="lg"
                >
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-colors border-2 border-white/30 h-auto"
                  size="lg"
                >
                  Learn More
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
                <div>
                  <div className="text-3xl md:text-4xl font-bold">10K+</div>
                  <div className="text-white/80 text-sm mt-1">Active Runners</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold">50K+</div>
                  <div className="text-white/80 text-sm mt-1">Races Tracked</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold">200+</div>
                  <div className="text-white/80 text-sm mt-1">Cities</div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Hero Image */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-white/20 rounded-3xl blur-2xl"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-8">
                  <div className="relative w-full h-96 rounded-2xl overflow-hidden">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&auto=format&fit=crop"
                      alt="Runner crossing finish line"
                      className="w-full h-full"
                      priority
                    />
                  </div>
                  
                  {/* Floating Stats Card */}
                  <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#FF6B00] p-3 rounded-xl">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">42.2 km</div>
                        <div className="text-sm text-gray-500">Personal Best</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to <span className="text-[#FF6B00]">Excel</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              RaceTrckr provides all the tools you need to track your progress, find races, and achieve your running goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="bg-[#FF6B00]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-[#FF6B00]" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Track Your Progress</h3>
              <p className="text-gray-600">
                Monitor your race statistics, total distance, and time on feet. Watch your progress grow with every run.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="bg-[#FF6B00]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-[#FF6B00]" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Discover Races</h3>
              <p className="text-gray-600">
                Find upcoming running events in your area. Filter by distance, date, and location to find your perfect race.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="bg-[#FF6B00]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-[#FF6B00]" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Race Calendar</h3>
              <p className="text-gray-600">
                Keep track of your upcoming races with our integrated calendar. Never miss a race day again.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="bg-[#FF6B00]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Timer className="w-8 h-8 text-[#FF6B00]" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Countdown Timers</h3>
              <p className="text-gray-600">
                Stay motivated with countdown timers for your next race. Build anticipation and stay focused on your goals.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="bg-[#FF6B00]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-[#FF6B00]" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Personal Bests</h3>
              <p className="text-gray-600">
                Track your personal records across all distances. Celebrate your achievements and set new goals.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="bg-[#FF6B00]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Trophy className="w-8 h-8 text-[#FF6B00]" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Best Efforts</h3>
              <p className="text-gray-600">
                View your best performances across different race distances and track your improvement over time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
