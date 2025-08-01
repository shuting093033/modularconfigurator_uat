// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://muvkxefmxzbofhvdhkzt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dmt4ZWZteHpib2ZodmRoa3p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NTgxNDgsImV4cCI6MjA2OTMzNDE0OH0.rqcpdmtV8Cez_3sOk_91r90d8rcEVexTYErdGug1FYU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});