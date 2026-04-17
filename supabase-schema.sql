-- ============================================
-- Meta Ads Manager - Supabase Database Schema
-- ============================================
-- Run this in your Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste > Run

-- Drop existing table if you want to start fresh (optional)
-- DROP TABLE IF EXISTS meta_ads CASCADE;

-- Create meta_ads table
CREATE TABLE IF NOT EXISTS meta_ads (
  id BIGSERIAL PRIMARY KEY,
  
  -- Campaign Information
  campaign_name VARCHAR(255) NOT NULL,
  objective VARCHAR(50) NOT NULL,
  budget DECIMAL(10, 2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  target_audience TEXT NOT NULL,
  
  -- Ad Creative
  headline VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  call_to_action VARCHAR(50) NOT NULL,
  
  -- Status
  status VARCHAR(20) DEFAULT 'Active' NOT NULL,
  thumbnail_url TEXT,
  
  -- Meta API Integration (optional - will be NULL if Meta API fails)
  meta_campaign_id VARCHAR(100),
  meta_sync_status VARCHAR(50) DEFAULT 'Not Synced',
  meta_last_sync TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('Active', 'Paused', 'Completed', 'Draft')),
  CONSTRAINT valid_objective CHECK (objective IN ('awareness', 'traffic', 'engagement', 'leads', 'sales')),
  CONSTRAINT positive_budget CHECK (budget > 0)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_meta_ads_status ON meta_ads(status);
CREATE INDEX IF NOT EXISTS idx_meta_ads_created_at ON meta_ads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_meta_ads_campaign_name ON meta_ads(campaign_name);
CREATE INDEX IF NOT EXISTS idx_meta_ads_meta_campaign_id ON meta_ads(meta_campaign_id);
CREATE INDEX IF NOT EXISTS idx_meta_ads_objective ON meta_ads(objective);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_meta_ads_updated_at ON meta_ads;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_meta_ads_updated_at
  BEFORE UPDATE ON meta_ads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) - Optional but recommended
-- Uncomment if you want to enable RLS
-- ALTER TABLE meta_ads ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (for development)
-- Uncomment and modify based on your auth requirements
-- CREATE POLICY "Allow all operations on meta_ads" ON meta_ads
--   FOR ALL
--   USING (true)
--   WITH CHECK (true);

-- Insert some sample data (optional - for testing)
-- Uncomment to add sample campaigns
/*
INSERT INTO meta_ads (
  campaign_name,
  objective,
  budget,
  start_date,
  end_date,
  target_audience,
  headline,
  description,
  call_to_action,
  status
) VALUES 
(
  'Summer Sale 2026',
  'sales',
  150.00,
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days',
  'Age 25-45, United States, Interested in Shopping',
  'Huge Summer Savings - Up to 50% Off',
  'Don''t miss our biggest sale of the year! Shop now and save big on all your favorite items.',
  'shop_now',
  'Active'
),
(
  'Brand Awareness Campaign',
  'awareness',
  75.00,
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '60 days',
  'Age 18-35, Global, Tech Enthusiasts',
  'Discover the Future of Technology',
  'Join thousands of innovators who are already transforming the way they work with our cutting-edge solutions.',
  'learn_more',
  'Active'
);
*/

-- Verify the table was created
SELECT 'meta_ads table created successfully!' AS status;

-- Show table structure
SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'meta_ads'
ORDER BY ordinal_position;
