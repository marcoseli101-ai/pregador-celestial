// Supabase Client with environment variables and fallback for production builds
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 
  "https://aqwynoeebuimxguxltre.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = 
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxd3lub2VlYnVpbXhndXhsdHJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNDYyNDIsImV4cCI6MjA5NTgyMjI0Mn0.TxlvlMsaK2VyWON0F0g-3phjU_ue8D2vTDW0chvW6So";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});