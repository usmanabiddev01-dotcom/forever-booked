-- Meta Ads Manager - Database Schema
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS meta_ads (
  id BIGSERIAL PRIMARY KEY,
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
  meta_last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meta_ads_status ON meta_ads(status);
CREATE INDEX IF NOT EXISTS idx_meta_ads_created_at ON meta_ads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_meta_ads_meta_campaign_id ON meta_ads(meta_campaign_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_meta_ads_updated_at ON meta_ads;
CREATE TRIGGER update_meta_ads_updated_at 
  BEFORE UPDATE ON meta_ads 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
