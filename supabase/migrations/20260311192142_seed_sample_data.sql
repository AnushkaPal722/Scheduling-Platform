/*
  # Seed Sample Data
  
  1. Sample Event Types
    - 30 Minute Meeting
    - 1 Hour Consultation
    - Quick Chat
  
  2. Sample Availability
    - Monday-Friday: 9:00 AM - 5:00 PM
  
  3. Sample Bookings
    - A few upcoming and past bookings for testing
*/

INSERT INTO event_types (title, description, duration, slug, color)
VALUES 
  ('30 Minute Meeting', 'A standard 30-minute meeting to discuss your needs and goals.', 30, '30-min', '#3b82f6'),
  ('1 Hour Consultation', 'In-depth consultation to explore your project requirements and plan next steps.', 60, '1-hour-consultation', '#10b981'),
  ('Quick 15min Chat', 'A quick 15-minute chat to answer your questions.', 15, '15-min-chat', '#f59e0b')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO availability (day_of_week, start_time, end_time, timezone)
VALUES 
  (1, '09:00:00', '17:00:00', 'America/New_York'),
  (2, '09:00:00', '17:00:00', 'America/New_York'),
  (3, '09:00:00', '17:00:00', 'America/New_York'),
  (4, '09:00:00', '17:00:00', 'America/New_York'),
  (5, '09:00:00', '17:00:00', 'America/New_York');

DO $$
DECLARE
  event_id uuid;
  tomorrow_date date;
  yesterday_date date;
BEGIN
  SELECT id INTO event_id FROM event_types WHERE slug = '30-min' LIMIT 1;
  tomorrow_date := CURRENT_DATE + INTERVAL '1 day';
  yesterday_date := CURRENT_DATE - INTERVAL '1 day';
  
  IF event_id IS NOT NULL THEN
    INSERT INTO bookings (event_type_id, booking_date, start_time, end_time, booker_name, booker_email, status)
    VALUES 
      (event_id, tomorrow_date, '10:00:00', '10:30:00', 'John Doe', 'john@example.com', 'confirmed'),
      (event_id, tomorrow_date, '14:00:00', '14:30:00', 'Jane Smith', 'jane@example.com', 'confirmed'),
      (event_id, yesterday_date, '11:00:00', '11:30:00', 'Bob Johnson', 'bob@example.com', 'confirmed');
  END IF;
END $$;