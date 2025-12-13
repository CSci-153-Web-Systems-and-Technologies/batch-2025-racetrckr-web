# RaceTrckr

A modern web platform for runners to track their race performance, discover upcoming events, and celebrate achievements. Built with Next.js and Supabase, RaceTrckr provides a seamless experience for managing your running journey.

🔗 **Live Demo**: [https://racetrckr.vercel.app/](https://racetrckr.vercel.app/)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

### For Runners
- **Race Tracking**: Log completed races with distance, finish time, pace, location, and photos
- **Performance Analytics**: Track best efforts across standard distances (5K, 10K, Half Marathon, Marathon, Ultra Marathon)
- **Personal Dashboard**: View total races, distance, time on feet, and upcoming events
- **Race Archive**: Browse personal race history with pagination
- **Profile Management**: Upload avatars, view statistics, and manage personal information

### For Event Discovery
- **Browse Events**: Discover upcoming running events with cover photos and details
- **Multi-Distance Support**: Filter events by available race distances
- **Event Registration**: Direct links to register for events
- **Location-Based**: Search events by province and city in the Philippines
- **Mark Attendance**: Track which events you plan to attend

### For Event Organizers
- **Add Events**: Create public events with cover photos, distances, and registration details
- **CAPTCHA Protection**: Cloudflare Turnstile prevents spam submissions
- **Event Management**: Update event details and availability

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Backend**: Supabase (PostgreSQL, Authentication, Storage, Real-time)
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui with Radix UI primitives
- **Animation**: Framer Motion
- **Form Protection**: Cloudflare Turnstile CAPTCHA
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast notifications)
- **Loading UI**: Next.js Top Loader

## Prerequisites

Before you begin, ensure you have:

- Node.js 20+ and npm
- A Supabase account and project
- A Cloudflare account (for Turnstile CAPTCHA)
- Git installed

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/CSci-153-Web-Systems-and-Technologies/batch-2025-racetrckr-web.git
cd batch-2025-racetrckr-web
npm install
```

## Environment Setup

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudflare Turnstile (CAPTCHA)
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=your_turnstile_site_key
CLOUDFLARE_TURNSTILE_SECRET_KEY=your_turnstile_secret_key
```

### Getting Your Credentials

**Supabase:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to Settings → API
4. Copy the Project URL and anon/public key

**Cloudflare Turnstile:**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to Turnstile
3. Create a new site
4. Add your domains (including `localhost` for development)
5. Copy the Site Key and Secret Key

## Database Setup

Run the following SQL in your Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Races table
CREATE TABLE races (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  distance NUMERIC NOT NULL,
  date DATE NOT NULL,
  province TEXT,
  province_code TEXT,
  city_municipality TEXT,
  city_municipality_code TEXT,
  barangay TEXT,
  hours INTEGER,
  minutes INTEGER,
  seconds INTEGER,
  notes TEXT,
  cover_photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Events table
CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  event_date DATE NOT NULL,
  city_municipality TEXT NOT NULL,
  province TEXT NOT NULL,
  baranggay TEXT,
  available_distances TEXT[] NOT NULL,
  registration_url TEXT NOT NULL,
  organizer TEXT,
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- User Events (Attendance tracking)
CREATE TABLE user_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  event_id UUID REFERENCES events(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, event_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE races ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for races
CREATE POLICY "Users can view own races" ON races
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own races" ON races
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for events
CREATE POLICY "Anyone can view active events" ON events
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can create events" ON events
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- RLS Policies for user_events
CREATE POLICY "Users can view own attendance" ON user_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can mark attendance" ON user_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Storage Buckets

Create the following storage buckets in Supabase Dashboard (Storage):

1. `avatars` - For user profile pictures
2. `race-covers` - For race photo uploads
3. `event-covers` - For event banner images

Set bucket policies to allow authenticated users to upload.

## Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Getting Started
1. Sign up with email/password or Google OAuth
2. Complete your profile with name and avatar
3. Start logging races or discover upcoming events

### Logging a Race
1. Navigate to "Add Race" from the dashboard
2. Fill in race details (name, date, distance, time, location)
3. Upload a cover photo (required)
4. Complete CAPTCHA verification
5. Submit to save to your race archive

### Adding an Event
1. Go to the Events page
2. Click "Add Event" button
3. Enter event details (name, date, location, distances, registration link)
4. Upload event cover photo (required)
5. Complete CAPTCHA verification
6. Submit for public listing

### Tracking Performance
- Dashboard displays your total races, distance, and time on feet
- Best Efforts section shows your fastest times for each distance
- Profile page shows complete race history with pagination

## Project Structure

```
batch-2025-racetrckr-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages (login, signup, reset)
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── api/               # API routes (CAPTCHA verification)
│   │   ├── auth/              # OAuth callback
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   ├── addrace/          # Add race form components
│   │   ├── auth/             # Authentication UI
│   │   ├── dashboard/        # Dashboard widgets
│   │   ├── events/           # Event browsing and management
│   │   ├── layout/           # Navigation and footer
│   │   ├── profile/          # Profile page components
│   │   └── ui/               # Reusable UI components (shadcn)
│   ├── lib/                   # Utility functions
│   │   ├── supabase.ts       # Supabase client
│   │   ├── supabase-server.ts # Server-side Supabase
│   │   └── utils.ts          # Helper functions
│   ├── types/                 # TypeScript definitions
│   └── utils/                 # Additional utilities
├── public/                    # Static assets
├── .env.local                # Environment variables (gitignored)
├── .env.example              # Environment template
└── README.md                 # This file
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import the project into [Vercel](https://vercel.com)
3. Add environment variables in project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY`
   - `CLOUDFLARE_TURNSTILE_SECRET_KEY`
4. Deploy

Vercel will automatically detect Next.js and configure the build settings.

### Post-Deployment

1. Update Supabase Auth settings with your production URL
2. Add production domain to Cloudflare Turnstile allowed domains
3. Configure Google OAuth redirect URIs (if using)

## Contributing

This project is developed as part of the Web Systems and Technologies course. Contributions are welcome:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- **[Next.js](https://nextjs.org/)** — The React framework for production
- **[Supabase](https://supabase.com/)** — Open source Firebase alternative
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** — Beautifully designed components
- **[21st.dev](https://21st.dev/)** — UI components and design inspiration
- **Visayas State University** — For the academic opportunity

---

**RaceTrckr** — Track. Race. Achieve.

## 🆘 Support

For issues or questions:
- Check [SECURITY.md](./SECURITY.md) for security-related concerns
- Review existing GitHub issues
- Contact the development team

---

**Built with ❤️ by the RaceTrckr Team**
