# Quick Start Guide

## 1. Database Setup (Required)

Go to your Supabase SQL Editor and run:

```sql
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
```

## 2. Environment Variables (Required)

Your `.env.local` already has:
```
NEXT_PUBLIC_SUPABASE_URL=https://wtgdornbdssmmulwrniz.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_8uT0GKbrJj3DmZqmnAhi9g_aTxXCq61
```

## 3. Meta API Setup (Optional)

**Without Meta API:** App works fully - campaigns saved to database only

**With Meta API:** Follow `DEPLOYMENT_GUIDE.md` to get test credentials

## 4. Test the App

```bash
npm run dev
```

Visit http://localhost:3000 and:
1. Click "Create Meta Ad"
2. Form is pre-filled with dummy data
3. Click "Create Campaign"
4. See success modal
5. View campaign in "View Meta Ads"

## Current Status

✅ Form pre-fills with random dummy data on each load  
✅ Professional success modal (no more alerts)  
✅ Cursor pointer on all buttons  
✅ Meta API integration ready (optional)  
✅ Vercel deployment configured  
✅ Works with or without Meta API credentials  

## Next Steps

1. **Create the database table** in Supabase (see step 1 above)
2. **Optionally** set up Meta test credentials (see DEPLOYMENT_GUIDE.md)
3. **Test locally** - everything should work
4. **Deploy to Vercel** when ready
