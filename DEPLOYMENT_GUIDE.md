# Meta Ad Manager - Vercel Deployment & Meta API Setup

## Part 1: Meta Marketing API Setup (Test Mode)

### Step 1: Create a Meta Test App

1. Go to [Meta for Developers](https://developers.facebook.com/apps/)
2. Click **"Create App"**
3. Select **"Business"** type
4. Fill in app details:
   - App Name: "Meta Ad Manager Test"
   - Contact Email: your email
5. Click **"Create App"**

### Step 2: Get Your Test Credentials

After creating the app:

1. Go to **App Dashboard** > **Settings** > **Basic**
2. Copy:
   - **App ID**
   - **App Secret** (click "Show" to reveal)

### Step 3: Generate Test Access Token

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from the dropdown
3. Click **"Generate Access Token"**
4. Add permissions:
   - `ads_management`
   - `ads_read`
   - `business_management`
5. Copy the generated access token

### Step 4: Get Test Ad Account ID

1. Go to [Meta Business Suite](https://business.facebook.com/)
2. Navigate to **Business Settings** > **Accounts** > **Ad Accounts**
3. Create a test ad account or use existing
4. Copy the Ad Account ID (format: `act_1234567890`)

### Step 5: Update Environment Variables

Update `.env.local` with your test credentials:

```env
META_APP_ID=your_actual_app_id
META_APP_SECRET=your_actual_app_secret
META_ACCESS_TOKEN=your_actual_test_token
META_AD_ACCOUNT_ID=act_your_actual_account_id
```

## Part 2: Supabase Database Setup

### Update Database Schema

Run this SQL in your Supabase SQL Editor:

```sql
-- If table doesn't exist, create it
CREATE TABLE IF NOT EXISTS meta_ads (
  id SERIAL PRIMARY KEY,
  campaign_name VARCHAR(255) NOT NULL,
  objective VARCHAR(50) NOT NULL,
  budget DECIMAL(10, 2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  target_audience TEXT NOT NULL,
  headline VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  call_to_action VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'Active',
  thumbnail_url TEXT,
  meta_campaign_id VARCHAR(100),
  meta_sync_status VARCHAR(50) DEFAULT 'Not Synced',
  meta_last_sync TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- If table exists, add new columns
ALTER TABLE meta_ads 
  ADD COLUMN IF NOT EXISTS meta_campaign_id VARCHAR(100),
  ADD COLUMN IF NOT EXISTS meta_sync_status VARCHAR(50) DEFAULT 'Not Synced',
  ADD COLUMN IF NOT EXISTS meta_last_sync TIMESTAMP;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_meta_ads_status ON meta_ads(status);
CREATE INDEX IF NOT EXISTS idx_meta_ads_created_at ON meta_ads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_meta_ads_meta_campaign_id ON meta_ads(meta_campaign_id);
```

## Part 3: Vercel Deployment

### Step 1: Prepare for Deployment

The app is already configured for Vercel:
- ✅ Next.js App Router
- ✅ API routes as serverless functions
- ✅ Environment variables via `.env.local`
- ✅ Supabase integration

### Step 2: Push to GitHub

```bash
cd forever-booked
git add .
git commit -m "Initial Meta Ad Manager setup"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click **"Import Project"**
3. Select your GitHub repository
4. Configure Project:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` 
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 4: Add Environment Variables in Vercel

In Vercel project settings > Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://wtgdornbdssmmulwrniz.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_8uT0GKbrJj3DmZqmnAhi9g_aTxXCq61
META_APP_ID=your_app_id
META_APP_SECRET=your_app_secret
META_ACCESS_TOKEN=your_test_token
META_AD_ACCOUNT_ID=act_your_account_id
```

### Step 5: Deploy

Click **"Deploy"** and wait for the build to complete.

## How It Works

### With Meta API Configured:
1. User creates campaign in UI
2. App creates campaign in Meta via API
3. Saves campaign details + Meta campaign ID to Supabase
4. Shows "Synced" status

### Without Meta API (Test Mode):
1. User creates campaign in UI
2. Saves to Supabase only
3. Shows "Not Synced" status
4. App still works fully for testing

## Testing with Meta Test Tools

### Test Users
Create test users in Meta App Dashboard > Roles > Test Users

### Test Ads
Campaigns created with test tokens:
- Won't spend real money
- Visible only in test environment
- Can be managed via Meta Ads Manager in test mode

### Graph API Explorer
Test API calls at: https://developers.facebook.com/tools/explorer/

## Vercel-Specific Notes

- API routes run as serverless functions (cold starts possible)
- Environment variables are encrypted at rest
- Automatic HTTPS and CDN
- Preview deployments for every git push
- Production deployment on main branch

## Troubleshooting

### "Invalid OAuth 2.0 Access Token"
- Token expired (generate new one)
- Missing required permissions
- App not in development mode

### "Ad Account ID not found"
- Wrong format (must start with `act_`)
- Account not accessible with current token
- Need to request access to ad account

### Vercel Build Fails
- Check environment variables are set
- Ensure all dependencies in package.json
- Check build logs for specific errors
