-- ==============================================================================
-- CAMPUS 2 CAREER (C2C) DATABASE SCHEMA
-- Project: Career 2 Campus (aqvlwrzfipzpynbuwgkl)
-- Run this in your Supabase SQL Editor ('>_' icon in the left sidebar)
-- ==============================================================================

-- 1. Profiles Table (Linked to Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT DEFAULT '',
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'admin')),
    department TEXT DEFAULT 'Computer Science & Engineering',
    avatar_url TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on profiles"
    ON public.profiles FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow users to update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 2. C2C Students Master Table
CREATE TABLE IF NOT EXISTS public.c2c_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roll_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    department TEXT NOT NULL DEFAULT 'Computer Science & Engineering',
    semester TEXT NOT NULL DEFAULT '7th Semester',
    section TEXT NOT NULL DEFAULT 'Section B',
    mentor_name TEXT DEFAULT 'Dr. K. Srinivas Rao',
    cgpa NUMERIC(4, 2) NOT NULL DEFAULT 8.42,
    credits_earned INTEGER NOT NULL DEFAULT 146,
    total_credits INTEGER NOT NULL DEFAULT 160,
    active_backlogs INTEGER NOT NULL DEFAULT 0,
    success_score INTEGER NOT NULL DEFAULT 74,
    attendance_rate NUMERIC(5, 2) NOT NULL DEFAULT 68.4,
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=160',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.c2c_students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on c2c_students" ON public.c2c_students FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow insert/update on c2c_students" ON public.c2c_students FOR ALL TO authenticated USING (true);

-- 3. Academic Records Table
CREATE TABLE IF NOT EXISTS public.c2c_academic_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.c2c_students(id) ON DELETE CASCADE,
    semester TEXT NOT NULL DEFAULT 'Sem 7',
    subject_code TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    credits INTEGER NOT NULL DEFAULT 3,
    subject_type TEXT NOT NULL DEFAULT 'Theory',
    internal_marks NUMERIC(5, 2) NOT NULL DEFAULT 0,
    max_internal NUMERIC(5, 2) NOT NULL DEFAULT 50,
    mid_marks NUMERIC(5, 2) NOT NULL DEFAULT 0,
    max_mid NUMERIC(5, 2) NOT NULL DEFAULT 50,
    grade TEXT NOT NULL DEFAULT 'A',
    trend TEXT DEFAULT 'stable',
    faculty_name TEXT,
    risk_flag TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.c2c_academic_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on c2c_academic_records" ON public.c2c_academic_records FOR SELECT TO anon, authenticated USING (true);

-- 4. Attendance Subjects Table
CREATE TABLE IF NOT EXISTS public.c2c_attendance_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.c2c_students(id) ON DELETE CASCADE,
    subject_code TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    attended_hours INTEGER NOT NULL DEFAULT 0,
    total_hours INTEGER NOT NULL DEFAULT 0,
    faculty_name TEXT,
    credits INTEGER NOT NULL DEFAULT 3,
    type TEXT NOT NULL DEFAULT 'Theory',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.c2c_attendance_subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on c2c_attendance_subjects" ON public.c2c_attendance_subjects FOR SELECT TO anon, authenticated USING (true);

-- 5. Student Permissions / Gate Passes / OD Table
CREATE TABLE IF NOT EXISTS public.c2c_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.c2c_students(id) ON DELETE CASCADE,
    request_type TEXT NOT NULL, -- 'leave', 'onduty', 'lab_access', 'gate_pass'
    permission_category TEXT NOT NULL,
    title TEXT NOT NULL,
    from_date TEXT,
    to_date TEXT,
    time_slot TEXT,
    status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
    approver TEXT,
    qr_pass_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.c2c_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on c2c_permissions" ON public.c2c_permissions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow all on c2c_permissions" ON public.c2c_permissions FOR ALL TO authenticated USING (true);

-- 6. Action Plans Table
CREATE TABLE IF NOT EXISTS public.c2c_action_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.c2c_students(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    detected_insight TEXT,
    why_it_matters TEXT,
    recommended_action TEXT,
    priority TEXT NOT NULL DEFAULT 'Medium',
    impact TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.c2c_action_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on c2c_action_plans" ON public.c2c_action_plans FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow all on c2c_action_plans" ON public.c2c_action_plans FOR ALL TO authenticated USING (true);

-- 7. Seed Initial Student (Ananya V.)
INSERT INTO public.c2c_students (
    id, roll_number, name, email, department, semester, section, mentor_name,
    cgpa, credits_earned, total_credits, active_backlogs, success_score, attendance_rate
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '21CSE084',
    'Ananya V.',
    'ananya.v@campus.edu',
    'Computer Science & Engineering',
    '7th Semester',
    'Section B',
    'Dr. K. Srinivas Rao',
    8.42,
    146,
    160,
    0,
    74,
    68.4
) ON CONFLICT (roll_number) DO NOTHING;

-- Seed Attendance Subjects for Ananya
INSERT INTO public.c2c_attendance_subjects (student_id, subject_code, subject_name, attended_hours, total_hours, faculty_name, credits, type)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'CS701', 'Cloud Computing & Distributed Systems', 32, 45, 'Dr. K. Srinivas Rao', 4, 'Theory'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'CS702', 'Machine Learning & Deep Neural Nets', 28, 42, 'Prof. Rajesh Kumar', 4, 'Theory'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'CS703', 'Information & Network Security', 22, 38, 'Dr. P. Sharmila', 3, 'Theory'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'CS708', 'Advanced Cloud Infrastructure Lab', 14, 24, 'Er. Vignesh R.', 2, 'Lab')
ON CONFLICT DO NOTHING;

-- Seed Academic Records for Ananya
INSERT INTO public.c2c_academic_records (student_id, semester, subject_code, subject_name, credits, internal_marks, max_internal, mid_marks, max_mid, grade, trend)
VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Sem 7', 'CS701', 'Cloud Computing & Distributed Systems', 4, 44, 50, 46, 50, 'A+', 'up'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Sem 7', 'CS702', 'Machine Learning & Deep Neural Nets', 4, 39, 50, 42, 50, 'A', 'stable'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Sem 7', 'CS703', 'Information & Network Security', 3, 35, 50, 38, 50, 'B+', 'down')
ON CONFLICT DO NOTHING;
