# UNIFI Financial OS

A gamified financial management dashboard built with Next.js 14, Supabase, and TypeScript. This application helps users achieve their financial goals through intelligent insights, collaborative tracking, and engaging gamification features.

## 🚀 Features

### Core Functionality
- **Financial Dashboard**: Comprehensive overview of financial health with real-time metrics
- **Goal Tracking**: Set and monitor financial goals with progress visualization
- **Transaction Management**: Categorize and analyze spending patterns
- **Analytics & Insights**: AI-powered financial insights and recommendations
- **Gamification**: XP system, badges, challenges, and streaks to motivate users
- **Community Features**: Leaderboards and social engagement
- **Learning System**: Interactive financial education modules
- **Mobile-First Design**: Responsive design optimized for all devices

### Technical Features
- **Authentication**: Secure user authentication with Supabase Auth
- **Real-time Data**: Live updates using Supabase real-time subscriptions
- **Type Safety**: Full TypeScript implementation with strict typing
- **Modern UI**: Built with Radix UI components and Tailwind CSS
- **AI Integration**: Intelligent chat widget for financial guidance
- **Data Visualization**: Interactive charts and graphs using Recharts

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Charts**: Recharts
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd dashboard
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Follow the detailed setup guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
3. Run the database schema from `lib/database-schema.sql`

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 5. Run the Development Server

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # Main dashboard pages
│   ├── onboarding/              # User onboarding flow
│   └── layout.tsx               # Root layout
├── components/                   # Reusable UI components
│   ├── ai-chat/                 # AI chat functionality
│   ├── auth/                    # Authentication components
│   ├── chat/                    # Chat system components
│   ├── community/               # Community features
│   ├── dashboard/               # Dashboard-specific components
│   ├── finance/                 # Financial components
│   ├── gamification/           # Gamification features
│   ├── learning/               # Learning system components
│   ├── settings/               # Settings components
│   └── ui/                     # Base UI components
├── hooks/                       # Custom React hooks
├── lib/                         # Utility libraries
│   ├── analytics/              # Analytics functions
│   ├── supabase/               # Supabase configuration
│   └── *.ts                    # Utility functions
├── types/                       # TypeScript type definitions
├── data/                        # Mock data and CSV files
└── public/                      # Static assets
```

## 🗄️ Database Schema

The application uses the following main tables:

- **profiles**: User profile information
- **user_goals**: Financial goals and targets
- **transactions**: Financial transactions
- **user_achievements**: Gamification achievements
- **user_stats**: User statistics and progress

See `lib/database-schema.sql` for the complete schema.

## 🎮 Gamification System

The app includes a comprehensive gamification system:

- **XP System**: Earn experience points for financial activities
- **Levels**: Progress through levels based on XP
- **Badges**: Unlock achievements for milestones
- **Challenges**: Daily, weekly, and custom challenges
- **Streaks**: Maintain daily activity streaks
- **Leaderboards**: Compete with other users

## 📱 Mobile Support

The application is fully responsive with:

- Mobile-optimized navigation
- Touch-friendly interactions
- Responsive charts and tables
- Mobile-specific chat interface
- Progressive Web App capabilities

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔧 Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Code Style

- TypeScript strict mode enabled
- ESLint configuration included
- Prettier formatting (recommended)
- Component-based architecture
- Custom hooks for state management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- Check the [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for setup issues
- Review [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for deployment help
- Open an issue for bug reports or feature requests

## 🎯 Roadmap

- [ ] Advanced AI insights
- [ ] Multi-currency support
- [ ] Investment tracking
- [ ] Bill reminders
- [ ] Budget planning tools
- [ ] Export functionality
- [ ] Mobile app (React Native)
- [ ] API for third-party integrations

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Supabase](https://supabase.com/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)
- Charts from [Recharts](https://recharts.org/)

---

**UNIFI Financial OS** - Making financial management engaging and accessible for everyone! 💰
