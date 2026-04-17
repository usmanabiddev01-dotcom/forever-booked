# Setup Instructions

## ✅ What I've Fixed

1. **Meta API is now OPTIONAL** - The app will save campaigns to Supabase even if Meta API fails
2. **Improved error handling** - Better error messages to help debug issues
3. **Simplified configuration** - Only Supabase credentials are required

## 🔧 Required: Get Your Supabase Credentials

### Step 1: Go to Your Supabase Project
1. Open https://app.supabase.com
2. Select your project: `wtgdornbdssmmulwrniz`

### Step 2: Get API Credentials
1. Click **Settings** (gear icon) in the left sidebar
2. Click **API** under Project Settings
3. You'll see two keys:
   - **Project URL**: `https://wtgdornbdssmmulwrniz.supabase.co` ✅ (already correct)
   - **anon public key**: A long string starting with `eyJ...`

### Step 3: Copy the anon/public Key
Copy the **anon/public** key (it looks like this):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0Z2Rvcm5iZHNzbW11bHdybml6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc...
```

### Step 4: Update `.env.local`
Replace `YOUR_ANON_KEY_HERE` with your actual anon key:

```env
NEXT_PUBLIC_SUPABASE_URL=https://wtgdornbdssmmulwrniz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...YOUR_ACTUAL_KEY
```

### Step 5: Create Database Table
1. In Supabase, go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Copy and paste the SQL from `schema.sql`
4. Click **Run** or press Cmd/Ctrl + Enter

### Step 6: Restart Dev Server
```bash
# Stop the server (Ctrl+C in the terminal where it's running)
# Then restart:
npm run dev
```

## 🎯 Testing

1. Go to http://localhost:3000
2. Click **Create Meta Ad**
3. The form should be pre-filled with random data
4. Click **Create Campaign**
5. ✅ **Success!** - Campaign saved to Supabase (Meta API will be skipped)

## ❓ Troubleshooting

### Error: "fetch failed" or "ENOTFOUND"
- ✅ **Fixed!** Make sure you copied the correct **anon key** from Supabase dashboard
- The key should start with `eyJ...` (it's a JWT token)
- Restart the dev server after updating `.env.local`

### Error: "Could not find the table 'meta_ads'"
- Run the SQL from `schema.sql` in your Supabase SQL Editor

### Error: "Invalid API key"
- Double-check you copied the **anon public** key (not the service_role key)
- Make sure there are no extra spaces in the `.env.local` file

## 📝 Meta API (Optional)

Meta API integration is **completely optional**. Leave these empty in `.env.local`:
```env
META_APP_ID=
META_APP_SECRET=
META_ACCESS_TOKEN=
META_AD_ACCOUNT_ID=
```

The app will work perfectly fine saving only to Supabase!
