# RaceTrckr - Running Event Tracking Platform

A modern web application for runners to track their race progress, discover upcoming events, and celebrate achievements.

## 🏃 Features

- **Race Tracking**: Log your race results with distance, time, pace, and location details
- **Event Discovery**: Browse and join upcoming running events with multi-distance support
- **Personal Dashboard**: View your stats, best efforts, and upcoming races
- **Profile Management**: Customize your profile with avatar uploads and personal information
- **Best Efforts Tracking**: Monitor your performance across standard distances (5K, 10K, Half Marathon, Marathon)
- **Authentication**: Secure login with email/password and Google OAuth integration

## 🚨 Important Security Notice

**API keys were previously exposed in git history.** Please read [SECURITY.md](./SECURITY.md) for critical instructions on:
1. Rotating your Supabase API keys
2. Force pushing the cleaned git history
3. Updating deployment environment variables

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm
- Supabase account and project
- Git

### Environment Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Get your Supabase credentials:**
   - Go to your [Supabase Dashboard](https://supabase.com/dashboard)
   - Navigate to Settings → API
   - Copy your Project URL and anon/public key

3. **Update `.env.local` with your credentials:**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📦 Tech Stack

- **Framework**: Next.js 16.0.0 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1.15
- **UI Components**: Custom components with Radix UI primitives
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Animation**: Motion (Framer Motion) 12.23.25
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Notifications**: Sonner

## 🗄️ Database Schema

The application uses Supabase with the following main tables:

- `profiles`: User profile information
- `races`: User's completed race records
- `events`: Public running events
- `user_events`: User attendance for events

Storage buckets:
- `avatars`: User profile pictures
- `race-covers`: Race photo uploads
- `event-covers`: Event banner images

## 🔒 Security Best Practices

- ✅ Keep `.env.local` out of version control
- ✅ Enable Row Level Security (RLS) on all Supabase tables
- ✅ Store secrets in deployment platform environment variables
- ✅ Review [SECURITY.md](./SECURITY.md) for complete guidelines

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Other Platforms

Compatible with any platform supporting Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🛠️ Development

### Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/             # Utility functions and Supabase clients
├── types/           # TypeScript type definitions
└── utils/           # Helper utilities
```

### Key Components

- **Auth**: Login, signup, password reset with Google OAuth
- **Dashboard**: User stats, best efforts, upcoming races
- **Events**: Browse events, view details, mark attendance
- **Add Race**: Form to log completed races
- **Profile**: User profile with race archive and stats

## 🤝 Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For issues or questions:
- Check [SECURITY.md](./SECURITY.md) for security-related concerns
- Review existing GitHub issues
- Contact the development team

---

**Built with ❤️ by the RaceTrckr Team**
