// Database configuration - determines which database to use

export const isProduction = process.env.NODE_ENV === 'production';
export const isVercel = process.env.VERCEL === '1';

// Use Supabase in production/Vercel, SQLite locally
export const useSupabase = isProduction || isVercel;

export function getDbType(): 'sqlite' | 'supabase' {
  return useSupabase ? 'supabase' : 'sqlite';
}
