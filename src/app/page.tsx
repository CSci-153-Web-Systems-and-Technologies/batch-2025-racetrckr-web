'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trophy, TrendingUp, MapPin, Calendar, Timer, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import DisplayCards from '@/components/ui/display-cards';
import { createClient } from '@/lib/supabase';
import Footer from '@/components/layout/Footer';

export default function Home() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    async function checkAuthAndFetchEvents() {
      const supabase = createClient();
      
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Redirect to dashboard if logged in
        router.push('/dashboard');
        return;
      }

      // Fetch events only if not logged in
      const { data, error } = await supabase
        .from('events')
        .select('id, title, event_date, city_municipality, province, cover_image_url')
        .eq('is_active', true)
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true })
        .limit(3);

      if (data) {
        setEvents(data);
      }
    }

    checkAuthAndFetchEvents();
  }, [router]);

  const handleGetStarted = () => {
    router.push('/signup');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const eventCards = events.map((event, index) => ({
    icon: <Calendar className="size-4 text-gray-300 group-hover:text-orange-300 transition-colors duration-300" />,
    title: event.title,
    description: `${event.city_municipality}, ${event.province}`,
    date: new Date(event.event_date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),
    coverImage: event.cover_image_url,
    iconClassName: "bg-gray-900 group-hover:bg-orange-900 transition-colors duration-300",
    className: index === 0
      ? "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0"
      : index === 1
      ? "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0"
      : "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10"
  }));

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
      <section className="relative bg-gradient-to-br from-[#FF6B00] to-[#FF8C33] text-white overflow-hidden min-h-screen flex items-start pt-16 lg:pt-24">
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 w-full">
          <div className={`grid gap-12 items-center ${events.length >= 3 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            {/* Left Column - Hero Content */}
            <div className={`space-y-3 lg:space-y-4 ${events.length < 3 ? 'text-center max-w-3xl mx-auto' : ''}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full ${events.length < 3 ? 'mx-auto' : ''}`}
              >
                <Trophy className="w-4 h-4" />
                <span className="text-sm">Track. Race. Achieve.</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              >
                Your Running Journey Starts Here
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base md:text-lg text-white/90 max-w-xl"
              >
                Track your race progress, discover upcoming events, and celebrate your achievements with RaceTrckr - the ultimate companion for every runner.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className={`pt-2 ${events.length < 3 ? 'flex justify-center' : ''}`}
              >
                <Button
                  onClick={handleGetStarted}
                  className="bg-white text-[#FF6B00] px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors shadow-lg h-auto"
                >
                  Get Started
                </Button>
              </motion.div>
            </div>
            
            {/* Right Column - Upcoming Events Cards */}
            {events.length >= 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden lg:flex items-center justify-center"
              >
                <DisplayCards cards={eventCards} />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to <span className="text-[#FF6B00]">Excel</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              RaceTrckr provides all the tools you need to track your progress, find races, and achieve your running goals.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="bg-[#FF6B00]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-[#FF6B00]" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Track Your Progress</h3>
              <p className="text-gray-600">
                Comprehensive race analytics with detailed statistics including total distance covered, time on feet, and performance metrics across all your runs.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="bg-[#FF6B00]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-[#FF6B00]" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Discover Races</h3>
              <p className="text-gray-600">
                Access a curated database of running events nationwide. Advanced filtering by distance, date, and location helps you find races that match your goals.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="bg-[#FF6B00]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-[#FF6B00]" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Race Calendar</h3>
              <p className="text-gray-600">
                Integrated calendar system to organize and manage your racing schedule. Automated reminders ensure you're always prepared for race day.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="bg-[#FF6B00]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Timer className="w-8 h-8 text-[#FF6B00]" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Countdown Timers</h3>
              <p className="text-gray-600">
                Real-time countdown timers for registered events help maintain motivation and focus. Strategic preparation tools to optimize race-day performance.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="bg-[#FF6B00]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-[#FF6B00]" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Personal Bests</h3>
              <p className="text-gray-600">
                Automatic tracking of personal records across all race distances. Historical performance data enables goal-setting and milestone achievement.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="bg-[#FF6B00]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Trophy className="w-8 h-8 text-[#FF6B00]" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Best Efforts</h3>
              <p className="text-gray-600">
                Advanced performance analytics showcasing top results across standard race distances. Data-driven insights to track improvement and identify training opportunities.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="text-[#FF6B00]">Works</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Get started with RaceTrckr in three simple steps
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-center"
            >
              <div className="bg-[#FF6B00] text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Your Profile</h3>
              <p className="text-gray-600">
                Register and build your personalized runner profile with demographic information, training history, and performance objectives.
              </p>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-center"
            >
              <div className="bg-[#FF6B00] text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Find & Add Races</h3>
              <p className="text-gray-600">
                Search our comprehensive event database or manually log upcoming races and historical results with detailed race information and performance metrics.
              </p>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-center"
            >
              <div className="bg-[#FF6B00] text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Track & Improve</h3>
              <p className="text-gray-600">
                Leverage data-driven insights to monitor progress, recognize achievements, and implement continuous performance improvement strategies.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#FF6B00] to-[#FF8C33] text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of runners who are already tracking their progress and achieving their goals with RaceTrckr.
          </p>
          <Button
            onClick={handleGetStarted}
            className="bg-white text-[#FF6B00] px-10 py-5 rounded-full font-semibold text-lg hover:bg-gray-50 transition-colors shadow-lg h-auto"
            size="lg"
          >
            Get Started for Free
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
