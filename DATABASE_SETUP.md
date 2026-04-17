# Meta Ad Manager - PostgreSQL Setup Guide

## Issue: Database Connection Failed

The hostname `db.wtgdornbdssmmulwrniz.supabase.co` is not resolving. This means we need the correct connection string from your Supabase dashboard.

## Step 1: Get the Correct Connection String

**For Next.js (serverless/edge), you MUST use the Connection Pooler:**

1. Go to: https://wtgdornbdssmmulwrniz.supabase.co/project/wtgdornbdssmmulwrniz/settings/database
2. Scroll to **Connection string** section
3. Click on **Connection pooling** tab (NOT "Direct connection")
4. Select **Transaction** mode
5. Port should be **6543** (not 5432)
6. Copy the full URI

The connection string should look like:
```
postgresql://postgres.wtgdornbdssmmulwrniz:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
```

Note: The username is `postgres.wtgdornbdssmmulwrniz` (includes project ref), and hostname is `aws-0-[region].pooler.supabase.com`

## Step 2: Update Environment Variable

Open `.env.local` and replace the `DATABASE_URL` with the connection pooler string you copied:

```env
DATABASE_URL=postgresql://postgres.wtgdornbdssmmulwrniz:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
```

## Step 3: Create the Database Table

1. In Supabase dashboard, go to **SQL Editor**
2. Copy and paste this SQL:

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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_meta_ads_status ON meta_ads(status);
CREATE INDEX idx_meta_ads_created_at ON meta_ads(created_at DESC);
```

3. Click **Run**

## Step 4: Restart Development Server

The server will auto-reload when you save `.env.local`, but if not:
```bash
npm run dev
```

## Step 5: Test

1. Visit http://localhost:3000
2. Try clicking "View Meta Ads" - should show empty state (not error)
3. Create a campaign via "Create Meta Ad"
4. View it in "View Meta Ads"

## Why Connection Pooler?

- **Direct connection** (`db.*.supabase.co:5432`) is for long-running servers
- **Connection pooler** (`aws-0-*.pooler.supabase.com:6543`) is for serverless/edge functions like Next.js
- Prevents connection exhaustion in serverless environments
