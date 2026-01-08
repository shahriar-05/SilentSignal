-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  doctor_code TEXT,
  doctor_id UUID,
  emergency_contacts JSONB DEFAULT '[]'::jsonb,
  current_distress_level TEXT DEFAULT 'low' CHECK (current_distress_level IN ('low', 'moderate', 'elevated', 'high')),
  current_mode TEXT DEFAULT 'normal' CHECK (current_mode IN ('normal', 'grounding')),
  camera_status TEXT DEFAULT 'inactive' CHECK (camera_status IN ('active', 'inactive')),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create emotional_readings table for tracking patient emotional patterns over time
CREATE TABLE IF NOT EXISTS emotional_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  distress_level TEXT NOT NULL CHECK (distress_level IN ('low', 'moderate', 'elevated', 'high')),
  distress_score NUMERIC(3,2) CHECK (distress_score >= 0 AND distress_score <= 1),
  mode TEXT DEFAULT 'normal' CHECK (mode IN ('normal', 'grounding')),
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('elevated_distress', 'high_distress', 'grounding_activated', 'emergency')),
  message TEXT,
  notified_contacts JSONB DEFAULT '[]'::jsonb,
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_by UUID,
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create doctor_codes table for patient enrollment
CREATE TABLE IF NOT EXISTS doctor_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  doctor_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert some sample doctor codes
INSERT INTO doctor_codes (code, doctor_name) VALUES 
  ('123456', 'Dr. Sarah Chen'),
  ('789012', 'Dr. Michael Brooks'),
  ('345678', 'Dr. Emily Watson')
ON CONFLICT (code) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
CREATE INDEX IF NOT EXISTS idx_patients_doctor_id ON patients(doctor_id);
CREATE INDEX IF NOT EXISTS idx_emotional_readings_patient_id ON emotional_readings(patient_id);
CREATE INDEX IF NOT EXISTS idx_emotional_readings_recorded_at ON emotional_readings(recorded_at);
CREATE INDEX IF NOT EXISTS idx_alerts_patient_id ON alerts(patient_id);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at);

-- Enable Row Level Security
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotional_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for patients table
CREATE POLICY "Users can view their own patient record" ON patients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own patient record" ON patients
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own patient record" ON patients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for emotional_readings
CREATE POLICY "Users can view their own readings" ON emotional_readings
  FOR SELECT USING (
    patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert their own readings" ON emotional_readings
  FOR INSERT WITH CHECK (
    patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid())
  );

-- RLS Policies for alerts
CREATE POLICY "Users can view their own alerts" ON alerts
  FOR SELECT USING (
    patient_id IN (SELECT id FROM patients WHERE user_id = auth.uid())
  );

-- RLS Policy for doctor_codes (anyone can read active codes)
CREATE POLICY "Anyone can read active doctor codes" ON doctor_codes
  FOR SELECT USING (is_active = true);
