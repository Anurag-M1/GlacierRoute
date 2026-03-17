-- GlacierRoute Database Schema

-- 1. Destinations Table
CREATE TABLE IF NOT EXISTS destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    state TEXT,
    country TEXT DEFAULT 'India',
    region TEXT,
    category TEXT,
    description TEXT,
    best_months TEXT[], -- Array of months
    avg_budget_inr INTEGER,
    safety_score INTEGER,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Trips Table
CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    origin TEXT,
    destination TEXT,
    start_date DATE,
    end_date DATE,
    travellers INTEGER DEFAULT 1,
    budget_inr INTEGER,
    travel_style TEXT,
    status TEXT DEFAULT 'planning', -- planning, active, completed, cancelled
    confidence_score INTEGER,
    plan_json JSONB, -- Full generated itinerary
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    amount_inr INTEGER NOT NULL,
    description TEXT,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable RLS
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- 5. Policies
-- Destinations: Publicly readable
CREATE POLICY "Destinations are publicly readable" ON destinations FOR SELECT USING (true);

-- Trips: Users can only see/manage their own trips
CREATE POLICY "Users can view their own trips" ON trips 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trips" ON trips 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips" ON trips 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips" ON trips 
    FOR DELETE USING (auth.uid() = user_id);

-- Expenses: Users can only see/manage their own expenses
CREATE POLICY "Users can view their own expenses" ON expenses 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own expenses" ON expenses 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses" ON expenses 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses" ON expenses 
    FOR DELETE USING (auth.uid() = user_id);

-- 5. Seed Data for Destinations
INSERT INTO destinations (slug, name, state, country, region, category, description, best_months, avg_budget_inr, safety_score, lat, lng)
VALUES 
('goa', 'Goa', 'Goa', 'India', 'West', 'beach', 'India''s beach paradise', ARRAY['Oct','Nov','Dec','Jan','Feb','Mar'], 15000, 8, 15.2993, 74.124),
('manali', 'Manali', 'Himachal Pradesh', 'India', 'North', 'hill', 'Mountain adventure hub', ARRAY['Mar','Apr','May','Jun'], 12000, 7, 32.2396, 77.1887),
('jaipur', 'Jaipur', 'Rajasthan', 'India', 'North', 'heritage', 'The Pink City', ARRAY['Oct','Nov','Dec','Jan','Feb','Mar'], 10000, 8, 26.9124, 75.7873),
('kerala', 'Kerala Backwaters', 'Kerala', 'India', 'South', 'nature', 'God''s Own Country', ARRAY['Sep','Oct','Nov','Dec','Jan','Feb','Mar'], 18000, 9, 9.4981, 76.3388),
('udaipur', 'Udaipur', 'Rajasthan', 'India', 'North', 'heritage', 'City of Lakes', ARRAY['Sep','Oct','Nov','Dec','Jan','Feb','Mar'], 13000, 9, 24.5854, 73.7125),
('rishikesh', 'Rishikesh', 'Uttarakhand', 'India', 'North', 'adventure', 'Yoga capital of the world', ARRAY['Sep','Oct','Nov'], 9000, 7, 30.0869, 78.2676)
ON CONFLICT (slug) DO NOTHING;
