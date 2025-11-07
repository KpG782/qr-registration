-- QR Registration System - Supabase Database Setup
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  date BIGINT,
  created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())
);

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  school_institution TEXT,
  attendance_status TEXT DEFAULT 'pending' CHECK(attendance_status IN ('pending', 'checked_in')),
  checked_in_at BIGINT,
  winner_rank INTEGER CHECK(winner_rank IN (1, 2, 3)),
  created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()),
  UNIQUE(category_id, email)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_categories_event_id ON categories(event_id);
CREATE INDEX IF NOT EXISTS idx_participants_category_id ON participants(category_id);
CREATE INDEX IF NOT EXISTS idx_participants_email ON participants(email);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
-- For now, allow all operations (you can restrict later)

-- Events policies
CREATE POLICY "Allow all operations on events" ON events FOR ALL USING (true) WITH CHECK (true);

-- Categories policies
CREATE POLICY "Allow all operations on categories" ON categories FOR ALL USING (true) WITH CHECK (true);

-- Participants policies
CREATE POLICY "Allow all operations on participants" ON participants FOR ALL USING (true) WITH CHECK (true);

-- Verify tables were created
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('events', 'categories', 'participants')
ORDER BY table_name;
