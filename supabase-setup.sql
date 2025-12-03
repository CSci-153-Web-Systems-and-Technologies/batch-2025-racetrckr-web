-- ============================================
-- RACES TABLE SETUP
-- ============================================
-- Run this SQL in your Supabase SQL Editor

-- Create races table for storing user race data
CREATE TABLE IF NOT EXISTS races (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  distance NUMERIC NOT NULL,
  date DATE NOT NULL,
  province TEXT,
  province_code TEXT,
  city_municipality TEXT,
  city_municipality_code TEXT,
  barangay TEXT,
  hours INTEGER,
  minutes INTEGER,
  seconds INTEGER,
  notes TEXT,
  cover_photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS races_user_id_idx ON races(user_id);

-- Create index on date for sorting
CREATE INDEX IF NOT EXISTS races_date_idx ON races(date DESC);

-- Enable Row Level Security
ALTER TABLE races ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own races
CREATE POLICY "Users can view own races"
  ON races
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own races
CREATE POLICY "Users can insert own races"
  ON races
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own races
CREATE POLICY "Users can update own races"
  ON races
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own races
CREATE POLICY "Users can delete own races"
  ON races
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at on row update
CREATE TRIGGER update_races_updated_at
  BEFORE UPDATE ON races
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- STORAGE BUCKET SETUP
-- ============================================

-- Create storage bucket for race cover photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('race-covers', 'race-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Allow authenticated users to upload their own race covers
CREATE POLICY "Users can upload own race covers"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'race-covers' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage Policy: Allow authenticated users to update their own race covers
CREATE POLICY "Users can update own race covers"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'race-covers' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage Policy: Allow authenticated users to delete their own race covers
CREATE POLICY "Users can delete own race covers"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'race-covers' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage Policy: Allow public read access to race covers
CREATE POLICY "Anyone can view race covers"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'race-covers');
