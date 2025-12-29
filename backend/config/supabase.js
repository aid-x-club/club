import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Supabase credentials
// URL and Anon Key have fallback values, but Service Role Key must be in .env
const supabaseUrl = process.env.SUPABASE_URL || 'https://ityjmpbelnivrfekwevn.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_FqnfnYx6SYUirayun3k7qw_we6HLWfo';

if (!supabaseUrl) {
    console.error('❌ Missing SUPABASE_URL. Please set it in your .env file');
}

if (!supabaseServiceKey) {
    console.warn('⚠️  Missing SUPABASE_SERVICE_ROLE_KEY in backend/.env');
    console.warn('💡 Get it from: Supabase Dashboard → Settings → API → service_role key');
    console.warn('⚠️  Falling back to anon key - some admin operations may fail');
}

// Create Supabase client with service role key for backend operations
// Falls back to anon key if service role key is not available (for development)
export const supabase = createClient(
    supabaseUrl,
    supabaseServiceKey || supabaseAnonKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        },
        db: {
            schema: 'public'
        },
        global: {
            headers: {
                'X-Client-Info': 'aidx-club-backend'
            }
        }
    }
);

// Test connection
export const testConnection = async () => {
    try {
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error) {
            console.warn('⚠️  Supabase connection test failed:', error.message);
            console.warn('💡 Make sure you have run the supabase-schema.sql file in your Supabase SQL Editor');
            console.warn('💡 Check that tables exist in: Supabase Dashboard → Table Editor');
            return false;
        }
        console.log('✅ Supabase connected successfully');
        console.log(`📊 Using ${supabaseServiceKey ? 'Service Role' : 'Anon'} key`);
        return true;
    } catch (error) {
        console.error('❌ Supabase connection error:', error.message);
        return false;
    }
};

// Export the client
export { supabase };
export default supabase;
