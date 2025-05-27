import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dcdlnozbxejqgkiiubhx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjZGxub3pieGVqcWdraWl1Ymh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0ODg1NTksImV4cCI6MjA2MjA2NDU1OX0.sUHw2Qti6OixQEsyQHCX6JP4BPORHMv0bsa7Erqwofc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);