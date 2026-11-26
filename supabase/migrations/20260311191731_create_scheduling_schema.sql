/*
  # Scheduling Platform Schema
  
  1. New Tables
    - `event_types`
      - `id` (uuid, primary key)
      - `title` (text) - Name of the event type
      - `description` (text) - Description of the event
      - `duration` (integer) - Duration in minutes
      - `slug` (text, unique) - URL-friendly identifier
      - `color` (text) - Color for the event type
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `availability`
      - `id` (uuid, primary key)
      - `day_of_week` (integer) - 0-6 (Sunday-Saturday)
      - `start_time` (time) - Start time for availability
      - `end_time` (time) - End time for availability
      - `timezone` (text) - Timezone identifier
      - `created_at` (timestamptz)
    
    - `bookings`
      - `id` (uuid, primary key)
      - `event_type_id` (uuid, foreign key)
      - `booking_date` (date) - Date of the booking
      - `start_time` (time) - Start time of the booking
      - `end_time` (time) - End time of the booking
      - `booker_name` (text) - Name of person booking
      - `booker_email` (text) - Email of person booking
      - `status` (text) - 'confirmed' or 'cancelled'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated and public access as needed
*/

CREATE TABLE IF NOT EXISTS event_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  duration integer NOT NULL DEFAULT 30,
  slug text UNIQUE NOT NULL,
  color text DEFAULT '#3b82f6',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  timezone text DEFAULT 'UTC',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type_id uuid NOT NULL REFERENCES event_types(id) ON DELETE CASCADE,
  booking_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  booker_name text NOT NULL,
  booker_email text NOT NULL,
  status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_event_type ON bookings(event_type_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_availability_day ON availability(day_of_week);

ALTER TABLE event_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event types are viewable by everyone"
  ON event_types FOR SELECT
  USING (true);

CREATE POLICY "Event types can be inserted by everyone"
  ON event_types FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Event types can be updated by everyone"
  ON event_types FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Event types can be deleted by everyone"
  ON event_types FOR DELETE
  USING (true);

CREATE POLICY "Availability is viewable by everyone"
  ON availability FOR SELECT
  USING (true);

CREATE POLICY "Availability can be inserted by everyone"
  ON availability FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Availability can be updated by everyone"
  ON availability FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Availability can be deleted by everyone"
  ON availability FOR DELETE
  USING (true);

CREATE POLICY "Bookings are viewable by everyone"
  ON bookings FOR SELECT
  USING (true);

CREATE POLICY "Bookings can be inserted by everyone"
  ON bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Bookings can be updated by everyone"
  ON bookings FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Bookings can be deleted by everyone"
  ON bookings FOR DELETE
  USING (true);