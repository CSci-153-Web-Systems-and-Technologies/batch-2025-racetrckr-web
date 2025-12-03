-- ============================================
-- ADD COVER PHOTO COLUMN TO EXISTING RACES TABLE
-- ============================================
-- Run this SQL in your Supabase SQL Editor if the races table already exists

-- Add cover_photo_url column to existing races table
ALTER TABLE races 
ADD COLUMN IF NOT EXISTS cover_photo_url TEXT;

-- ============================================
-- STORAGE BUCKET SETUP (if not already done)
-- ============================================

-- Create storage bucket for race cover photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('race-covers', 'race-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload own race covers" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own race covers" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own race covers" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view race covers" ON storage.objects;

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
