/*
  Bonus Features Schema Migration

  Adds:
  - Buffer time and custom questions to event_types
  - Custom answers and reschedule tracking to bookings
  - Multiple schedules and date overrides
*/

ALTER TABLE event_types ADD COLUMN IF NOT EXISTS buffer_time integer DEFAULT 0;
ALTER TABLE event_types ADD COLUMN IF NOT EXISTS custom_questions jsonb DEFAULT '[]'::jsonb;

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS custom_answers jsonb DEFAULT '{}'::jsonb;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS rescheduled_from_id uuid REFERENCES bookings(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  timezone text DEFAULT 'UTC',
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Copy existing availability into a default schedule
INSERT INTO schedules (id, name, timezone, is_default)
SELECT gen_random_uuid(), 'Default Schedule', max(timezone), true
FROM availability
HAVING count(*) > 0
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS schedule_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id uuid NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Migrate old availability data
INSERT INTO schedule_availability (schedule_id, day_of_week, start_time, end_time)
SELECT s.id, a.day_of_week, a.start_time, a.end_time
FROM availability a
CROSS JOIN schedules s
WHERE s.is_default = true
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS date_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id uuid NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
  override_date date NOT NULL,
  start_time time,
  end_time time,
  is_unavailable boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Update RLS policies
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE date_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Schedules viewable by everyone" ON schedules FOR SELECT USING (true);
CREATE POLICY "Schedules insertable by everyone" ON schedules FOR INSERT WITH CHECK (true);
CREATE POLICY "Schedules updatable by everyone" ON schedules FOR UPDATE USING (true);
CREATE POLICY "Schedules deletable by everyone" ON schedules FOR DELETE USING (true);

CREATE POLICY "Schedule availability viewable by everyone" ON schedule_availability FOR SELECT USING (true);
CREATE POLICY "Schedule availability insertable by everyone" ON schedule_availability FOR INSERT WITH CHECK (true);
CREATE POLICY "Schedule availability updatable by everyone" ON schedule_availability FOR UPDATE USING (true);
CREATE POLICY "Schedule availability deletable by everyone" ON schedule_availability FOR DELETE USING (true);

CREATE POLICY "Date overrides viewable by everyone" ON date_overrides FOR SELECT USING (true);
CREATE POLICY "Date overrides insertable by everyone" ON date_overrides FOR INSERT WITH CHECK (true);
CREATE POLICY "Date overrides updatable by everyone" ON date_overrides FOR UPDATE USING (true);
CREATE POLICY "Date overrides deletable by everyone" ON date_overrides FOR DELETE USING (true);
