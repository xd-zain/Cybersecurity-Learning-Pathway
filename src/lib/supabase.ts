import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables or user-configured localStorage credentials
const getStoredConfig = () => {
  if (typeof window === 'undefined') return { url: '', anonKey: '' };
  const url = localStorage.getItem('sec_supabase_url') || import.meta.env.VITE_SUPABASE_URL || '';
  const anonKey = localStorage.getItem('sec_supabase_anon_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  return { url, anonKey };
};

const { url: initialUrl, anonKey: initialKey } = getStoredConfig();

export const isSupabaseConfigured = (): boolean => {
  const { url, anonKey } = getStoredConfig();
  return Boolean(url && anonKey && url.startsWith('http'));
};

export const getSupabaseConfig = () => getStoredConfig();

export const saveSupabaseConfig = (url: string, anonKey: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sec_supabase_url', url.trim());
    localStorage.setItem('sec_supabase_anon_key', anonKey.trim());
    window.location.reload();
  }
};

export const clearSupabaseConfig = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('sec_supabase_url');
    localStorage.removeItem('sec_supabase_anon_key');
    window.location.reload();
  }
};

// Initialize client if credentials present, otherwise fallback dummy client
export const supabase: SupabaseClient = (initialUrl && initialKey && initialUrl.startsWith('http'))
  ? createClient(initialUrl, initialKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : createClient(
      'https://placeholder-project.supabase.co',
      'placeholder-anon-key-1234567890abcdef',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      }
    );

export default supabase;
