
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ShortenedUrl = {
  id: string;
  original_url: string;
  short_code: string;
  created_at: string;
  clicks: number;
  custom_slug?: string;
};

export type ClickEvent = {
  id: string;
  url_id: string;
  created_at: string;
  browser: string;
  device: string;
  location: string;
};
