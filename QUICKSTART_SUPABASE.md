# Meta Ad Manager - Quick Setup Guide

## 📋 What You Need

1. **Supabase Account** - https://supabase.com (Free tier is fine)
2. **Your Supabase anon key** (we'll get this in Step 2)

## 🚀 Setup Steps

### Step 1: Create Database Table

1. Go to your Supabase project: https://app.supabase.com/project/wtgdornbdssmmulwrniz
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy the entire contents of `schema.sql` or `supabase-schema.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. ✅ You should see "Success" - your table is now created!

### Step 2: Get Your Supabase API Key

1. In Supabase, click **Settings** (⚙️ gear icon) in the left sidebar
2. Click **API** under Project Settings
3. Find the **Project API keys** section
4. Copy the **anon public** key (it's a long string starting with `eyJ...`)

### Step 3: Update Environment Variables

1. Open `/Users/awaisnazir/Desktop/forever-booked/.env.local`
2. Replace `YOUR_ANON_KEY_HERE` with the key you copied:

```env
NEXT_PUBLIC_SUPABASE_URL=https://wtgdornbdssmmulwrniz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_actual_key_here...

# Leave Meta API empty (optional integration)
META_APP_ID=
META_APP_SECRET=
META_ACCESS_TOKEN=
META_AD_ACCOUNT_ID=
```

3. Save the file

### Step 4: Start the App

```bash
cd /Users/awaisnazir/Desktop/forever-booked
npm run dev
```

Open http://localhost:3000 in your browser!

## ✅ Testing

1. Click **Create Meta Ad**
2. Form is pre-filled with random data
3. Click **Create Campaign**
4. ✅ Success! Campaign saved to Supabase

## 🔍 View Your Data

Go to Supabase:
1. Click **Table Editor** in the left sidebar
2. Select **meta_ads** table
3. You'll see all your campaigns!

## 📝 About Meta API

- **Meta API is OPTIONAL** and will silently fail if not configured
- The app works 100% with just Supabase
- Leave Meta credentials empty in `.env.local`
- Campaigns always save to Supabase, regardless of Meta API status

## ❓ Troubleshooting

### Error: "fetch failed" or "ENOTFOUND"
✅ Make sure you copied the correct **anon public** key from Supabase
✅ The key should be very long (200+ characters) and start with `eyJ`
✅ Restart the dev server after updating `.env.local`

### Error: "table 'meta_ads' does not exist"
✅ Run the SQL from `schema.sql` in Supabase SQL Editor

### Error: "Invalid API key"
✅ You copied the **service_role** key instead of **anon public** key
✅ Go back to Supabase Settings > API and copy the **anon public** key

## 📁 Project Structure

```
forever-booked/
├── schema.sql              # Database schema (simple version)
├── supabase-schema.sql     # Database schema (detailed with comments)
├── .env.local              # Your environment variables (not in git)
├── src/
│   ├── app/
│   │   ├── page.tsx           # Homepage
│   │   ├── create/page.tsx    # Create campaign form
│   │   ├── ads/page.tsx       # View all campaigns
│   │   └── api/ads/route.ts   # API endpoint (CRUD operations)
│   └── lib/
│       ├── supabase.ts        # Supabase client
│       └── metaAPI.ts         # Meta API (optional, silently fails)
```

## 🎉 You're All Set!

Your Meta Ad Manager is now fully functional with Supabase for all CRUD operations!
