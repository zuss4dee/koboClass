import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lqihcaogjtggxounrath.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaWhjYW9nanRnZ3hvdW5yYXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2ODMyOTcsImV4cCI6MjA3MTI1OTI5N30.b65s5frA1KLbYTBZ4gMBPVVhFNQ9Otl4ZmMKLsHN1mY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const isSupabaseConfigured = true;