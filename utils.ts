import { createClient } from '@supabase/supabase-js';

// Use import.meta.env for Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isDemoMode = !supabaseUrl || !supabaseAnonKey;

if (isDemoMode) {
  console.warn('Supabase credentials missing. Running in Demo Mode with local storage.');
}

// Create a dummy client if in demo mode to avoid crashes
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);

export type UserRole = 'citizen' | 'officer' | 'admin';
export type ComplaintStatus = 'DRAFT' | 'SUBMITTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
export type Severity = 'low' | 'medium' | 'high';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  department_id?: string;
}

export interface Complaint {
  id: string;
  citizen_id?: string;
  category: string;
  severity: Severity;
  status: ComplaintStatus;
  description: string;
  latitude: number;
  longitude: number;
  department_id?: string;
  rating?: number;
  feedback?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  image_url?: string;
}
