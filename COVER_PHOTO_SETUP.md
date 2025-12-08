# Cover Photo Upload Integration Guide

## What Was Implemented

The cover photo upload functionality has been fully integrated into the Add Race feature. Users can now upload a cover photo for each race, which is stored in Supabase Storage and synced with the database.

## Features

### 1. **File Upload**
- Users can select an image file (JPG, PNG, GIF, WebP)
- Maximum file size: 5MB
- Real-time validation for file type and size

### 2. **Image Preview**
- Live preview of selected image before submission
- Remove/change photo before submitting
- Loading indicator during upload

### 3. **Supabase Storage**
- Photos stored in `race-covers` bucket
- Organized by user ID (`userId/filename.ext`)
- Public access for viewing
- User-specific write permissions

### 4. **Database Integration**
- Cover photo URL saved in `cover_photo_url` column
- Automatically fetched and displayed in profile
- Falls back to placeholder if no photo uploaded

## Setup Instructions

### Step 1: Run SQL Setup

Open your Supabase Dashboard > SQL Editor and run `supabase-setup.sql`:

This will:
- Create the `races` table with all necessary columns
- Add the `cover_photo_url` column
- Create the `race-covers` storage bucket
- Set up Row Level Security policies
- Configure storage access policies

### Step 2: Verify Storage Bucket

1. Go to Supabase Dashboard > Storage
2. Confirm `race-covers` bucket exists
3. Check that it's set to **Public** (for viewing)
4. Verify policies are in place

### Step 3: Test Upload

1. Navigate to `/addrace` in your app
2. Fill out race information
3. Click "Pick Cover Photo" and select an image
4. You should see a preview
5. Submit the form
6. Check your profile - the race should display with your uploaded photo

## How It Works

### Upload Flow

1. **User selects photo** → Preview shown
2. **Form submitted** → Photo uploaded to Supabase Storage first
3. **Upload succeeds** → Get public URL
4. **Race saved** → URL stored in `cover_photo_url` column
5. **Profile loads** → Cover photos fetched and displayed

### File Structure in Storage

```
race-covers/
  └── {user-id}/
      ├── {user-id}-1234567890.jpg
      ├── {user-id}-1234567891.png
      └── ...
```

### Database Structure

```sql
races table:
  - id (uuid)
  - user_id (uuid)
  - name (text)
  - distance (numeric)
  - date (date)
  - cover_photo_url (text) ← NEW
  - ... other fields
```

## Security

### Storage Policies
- ✅ Users can only upload to their own folder (`userId/`)
- ✅ Users can only update/delete their own photos
- ✅ Anyone can view photos (public read)

### Database Policies
- ✅ Users can only insert races with their own `user_id`
- ✅ Users can only view/edit/delete their own races
- ✅ Row Level Security enabled

## User Experience

### Adding a Race
1. Photo selection happens before form submission
2. Preview shows immediately
3. Upload happens during submission (with loading state)
4. Success message after both photo and race are saved
5. Redirects to profile showing the new race with photo

### Viewing Races
- Profile page shows all races with their cover photos
- Falls back to default placeholder if no photo
- Uses Next.js Image component for optimization

## Troubleshooting

### Photo Upload Fails
1. Check browser console for detailed error
2. Verify `race-covers` bucket exists
3. Check storage policies are active
4. Confirm file is under 5MB and valid format

### Photo Doesn't Display
1. Check if `cover_photo_url` is in database
2. Verify URL is publicly accessible
3. Ensure Next.js `remotePatterns` includes your Supabase storage domain

### Permission Errors
1. Verify user is authenticated
2. Check RLS policies on `races` table
3. Verify storage policies match user ID structure

## Next Steps

Optional enhancements you could add:
- Image cropping/resizing before upload
- Multiple photos per race
- Photo gallery view
- Delete race photos separately
- Batch upload for multiple races
