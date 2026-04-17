# Meta Ad Manager

A professional Meta advertising campaign management platform built with Next.js 16, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🎯 Create and manage Meta ad campaigns
- 🔄 Auto-sync with Meta Marketing API (optional)
- 💾 PostgreSQL database via Supabase
- 🎨 Professional, modern UI
- 📊 Campaign dashboard and analytics
- 🧪 Test mode with dummy data generation

## Tech Stack

- **Frontend**: Next.js 16.2, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Meta Integration**: Meta Marketing API v19.0
- **Deployment**: Vercel

## Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Meta Developer account (for API integration)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Update .env.local with your credentials
# See DEPLOYMENT_GUIDE.md for detailed setup

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Required variables in `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_key

# Meta Marketing API (optional for testing)
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
META_ACCESS_TOKEN=your_test_access_token
META_AD_ACCOUNT_ID=act_your_ad_account_id
```

## Database Setup

Run the SQL schema in your Supabase SQL Editor:

```bash
# See schema.sql for complete table structure
```

## Deployment to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/forever-booked)

### Manual Deployment

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com/new)
3. Add environment variables
4. Deploy

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

## Features

### Campaign Creation
- Professional form with validation
- Random test data generation
- Character counters for text fields
- Auto-sync to Meta API (if configured)

### Campaign Management
- Grid view of all campaigns
- Thumbnail previews
- Status badges (Active/Paused/Completed)
- Meta sync status indicators
- Search and filter functionality

### Meta API Integration
- Automatic campaign creation in Meta
- Test mode support
- Fallback to local-only if API unavailable
- Sync status tracking

## Testing

### Without Meta API
The app works fully without Meta API credentials - campaigns are stored locally in Supabase.

### With Meta Test Credentials
Use test users and test tokens to create campaigns that won't spend real money.

## Project Structure

```
forever-booked/
├── src/
│   ├── app/
│   │   ├── api/ads/        # API routes for CRUD operations
│   │   ├── create/         # Create campaign page
│   │   ├── ads/            # View campaigns page
│   │   ├── layout.tsx      # Root layout with header/sidebar
│   │   └── page.tsx        # Homepage
│   ├── components/         # Reusable components
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   └── lib/
│       ├── supabase.ts     # Supabase client
│       └── metaAPI.ts      # Meta Marketing API wrapper
├── public/                 # Static assets
├── schema.sql             # Database schema
├── DEPLOYMENT_GUIDE.md    # Deployment instructions
└── vercel.json            # Vercel configuration
```

## Documentation

- `DEPLOYMENT_GUIDE.md` - Complete deployment and API setup guide
- `DATABASE_SETUP.md` - Database configuration (deprecated, see DEPLOYMENT_GUIDE.md)
- `schema.sql` - PostgreSQL table schema

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
