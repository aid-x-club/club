import { createClient } from '@supabase/supabase-js';

// Supabase credentials  
// URL and Anon Key are safe to expose in frontend
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ityjmpbelnivrfekwevn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_FqnfnYx6SYUirayun3k7qw_we6HLWfo';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
}

// Create Supabase client for frontend (using anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: window.localStorage
    },
    db: {
        schema: 'public'
    },
    global: {
        headers: {
            'X-Client-Info': 'aidx-club-portal'
        }
    }
});

// Helper function to check if Supabase is connected
export const checkSupabaseConnection = async () => {
    try {
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error) {
            console.error('Supabase connection error:', error);
            return false;
        }
        console.log('✅ Supabase connected successfully');
        return true;
    } catch (error) {
        console.error('❌ Failed to connect to Supabase:', error);
        return false;
    }
};

export default supabase;
