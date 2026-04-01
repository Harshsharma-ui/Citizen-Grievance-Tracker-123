/*
  SUPABASE SQL SETUP SCRIPT
  Run this in the Supabase SQL Editor to set up the database schema, RLS, and seed data.
*/

-- 1. Enums and Extensions
CREATE TYPE user_role AS ENUM ('citizen', 'officer', 'admin');
CREATE TYPE complaint_status AS ENUM ('DRAFT', 'SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED');
CREATE TYPE complaint_severity AS ENUM ('low', 'medium', 'high');

-- 2. Tables
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role user_role DEFAULT 'citizen',
    department_id UUID REFERENCES departments(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id UUID REFERENCES profiles(id),
    category TEXT NOT NULL,
    severity complaint_severity DEFAULT 'medium',
    status complaint_status DEFAULT 'SUBMITTED',
    description TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    department_id UUID REFERENCES departments(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE TABLE complaint_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    cloudinary_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_images ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile, Admins can read all
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Departments: Everyone can read
CREATE POLICY "Public read departments" ON departments FOR SELECT USING (true);

-- Complaints:
-- Citizens: View public (all) or manage own
CREATE POLICY "Citizens can view all complaints" ON complaints FOR SELECT USING (true);
CREATE POLICY "Citizens can insert own complaints" ON complaints FOR INSERT WITH CHECK (auth.uid() = citizen_id);
CREATE POLICY "Citizens can update own draft complaints" ON complaints FOR UPDATE USING (auth.uid() = citizen_id AND status = 'DRAFT');
CREATE POLICY "Citizens can rate resolved complaints" ON complaints FOR UPDATE USING (auth.uid() = citizen_id AND status = 'RESOLVED');

-- Officers: View/Update assigned department
CREATE POLICY "Officers view assigned department" ON complaints FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR (role = 'officer' AND department_id = complaints.department_id)))
);
CREATE POLICY "Officers update assigned department" ON complaints FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (role = 'admin' OR (role = 'officer' AND department_id = complaints.department_id)))
);

-- 4. Assignment Logic (Trigger)
CREATE OR REPLACE FUNCTION assign_complaint_department()
RETURNS TRIGGER AS $$
DECLARE
    dept_id UUID;
BEGIN
    -- Simple mapping logic
    SELECT id INTO dept_id FROM departments 
    WHERE name = CASE 
        WHEN NEW.category IN ('Broken Roads', 'Potholes') THEN 'Roads & Transport'
        WHEN NEW.category IN ('Leaking Pipes', 'Water Supply') THEN 'Water & Sewage'
        WHEN NEW.category IN ('Waste Management', 'Garbage') THEN 'Sanitation'
        ELSE 'General Administration'
    END;
    
    NEW.department_id := dept_id;
    NEW.status := 'ASSIGNED';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_complaint_submitted
    BEFORE INSERT ON complaints
    FOR EACH ROW
    WHEN (NEW.status = 'SUBMITTED')
    EXECUTE FUNCTION assign_complaint_department();

-- 5. Seed Data (Mumbai)
INSERT INTO departments (name) VALUES 
('Roads & Transport'), 
('Water & Sewage'), 
('Sanitation'), 
('General Administration');

-- Seed 100 synthesized complaints for Mumbai
-- Coordinates roughly within Mumbai (18.9 - 19.3 N, 72.8 - 73.0 E)
DO $$
DECLARE
    i INT;
    lat DOUBLE PRECISION;
    lng DOUBLE PRECISION;
    cat TEXT;
    sev complaint_severity;
    stat complaint_status;
    depts UUID[];
BEGIN
    SELECT array_agg(id) INTO depts FROM departments;
    
    FOR i IN 1..100 LOOP
        lat := 18.9 + (random() * 0.4);
        lng := 72.8 + (random() * 0.2);
        cat := (ARRAY['Broken Roads', 'Leaking Pipes', 'Waste Management', 'Potholes', 'Garbage', 'Water Supply'])[floor(random() * 6 + 1)];
        sev := (ARRAY['low', 'medium', 'high'])[floor(random() * 3 + 1)]::complaint_severity;
        stat := (ARRAY['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'])[floor(random() * 4 + 1)]::complaint_status;
        
        INSERT INTO complaints (category, severity, status, description, latitude, longitude, created_at)
        VALUES (
            cat, 
            sev, 
            stat, 
            'Synthesized grievance report for ' || cat || ' at location ' || i, 
            lat, 
            lng,
            NOW() - (random() * interval '30 days')
        );
    END LOOP;
END $$;
