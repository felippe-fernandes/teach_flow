-- Row Level Security (RLS) Policies for TeachFlow
-- Run this SQL in Supabase SQL Editor to enable security on all tables

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Users can only see and manage their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT
  USING (supabase_auth_id = auth.uid());

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE
  USING (supabase_auth_id = auth.uid());

-- Contractors table policies
-- Users can only manage their own contractors
CREATE POLICY "Users can view own contractors" ON contractors
  FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE supabase_auth_id = auth.uid()));

CREATE POLICY "Users can insert own contractors" ON contractors
  FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM users WHERE supabase_auth_id = auth.uid()));

CREATE POLICY "Users can update own contractors" ON contractors
  FOR UPDATE
  USING (user_id IN (SELECT id FROM users WHERE supabase_auth_id = auth.uid()));

CREATE POLICY "Users can delete own contractors" ON contractors
  FOR DELETE
  USING (user_id IN (SELECT id FROM users WHERE supabase_auth_id = auth.uid()));

-- Students table policies
-- Users can only manage their own students
CREATE POLICY "Users can view own students" ON students
  FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE supabase_auth_id = auth.uid()));

CREATE POLICY "Users can insert own students" ON students
  FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM users WHERE supabase_auth_id = auth.uid()));

CREATE POLICY "Users can update own students" ON students
  FOR UPDATE
  USING (user_id IN (SELECT id FROM users WHERE supabase_auth_id = auth.uid()));

CREATE POLICY "Users can delete own students" ON students
  FOR DELETE
  USING (user_id IN (SELECT id FROM users WHERE supabase_auth_id = auth.uid()));

-- Classes table policies
-- Users can only manage their own classes
CREATE POLICY "Users can view own classes" ON classes
  FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE supabase_auth_id = auth.uid()));

CREATE POLICY "Users can insert own classes" ON classes
  FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM users WHERE supabase_auth_id = auth.uid()));

CREATE POLICY "Users can update own classes" ON classes
  FOR UPDATE
  USING (user_id IN (SELECT id FROM users WHERE supabase_auth_id = auth.uid()));

CREATE POLICY "Users can delete own classes" ON classes
  FOR DELETE
  USING (user_id IN (SELECT id FROM users WHERE supabase_auth_id = auth.uid()));

-- Payments table policies
-- Users can only manage their own payments
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT
  USING (user_id IN (SELECT id FROM users WHERE supabase_auth_id = auth.uid()));

CREATE POLICY "Users can insert own payments" ON payments
  FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM users WHERE supabase_auth_id = auth.uid()));

CREATE POLICY "Users can update own payments" ON payments
  FOR UPDATE
  USING (user_id IN (SELECT id FROM users WHERE supabase_auth_id = auth.uid()));

CREATE POLICY "Users can delete own payments" ON payments
  FOR DELETE
  USING (user_id IN (SELECT id FROM users WHERE supabase_auth_id = auth.uid()));
