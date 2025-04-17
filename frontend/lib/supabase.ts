import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions based on your schema
export interface Project {
  project_id: string;
  name: string;
  description: string | null;
  sandbox: any;
  created_at: string;
  updated_at: string;
}

export interface Thread {
  thread_id: string;
  project_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  message_id: string;
  thread_id: string;
  type: string;
  is_llm_message: boolean;
  content: any;
  metadata: any;
  created_at: string;
  updated_at: string;
} 