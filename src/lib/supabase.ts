import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface EventType {
  id: string;
  title: string;
  description: string;
  duration: number;
  slug: string;
  color: string;
  buffer_time: number;
  custom_questions: { label: string; required: boolean; type: string }[];
  created_at: string;
  updated_at: string;
}

export interface Availability {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  timezone: string;
  created_at: string;
}

export interface Booking {
  id: string;
  event_type_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  booker_name: string;
  booker_email: string;
  status: 'confirmed' | 'cancelled';
  custom_answers: Record<string, string>;
  rescheduled_from_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: string;
  name: string;
  timezone: string;
  is_default: boolean;
  created_at: string;
}

export interface ScheduleAvailability {
  id: string;
  schedule_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  created_at: string;
}

export interface DateOverride {
  id: string;
  schedule_id: string;
  override_date: string;
  start_time?: string;
  end_time?: string;
  is_unavailable: boolean;
  created_at: string;
}
