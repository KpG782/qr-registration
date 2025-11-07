// Database configuration - determines which database to use

export const isProduction = process.env.NODE_ENV === 'production';
export const isVercel = process.env.VERCEL === '1';

// Always use Supabase for consistency across local and production
// This ensures QR codes work from phones scanning production URLs
export const useSupabase = true;

export function getDbType(): 'sqlite' | 'supabase' {
  return 'supabase';
}
