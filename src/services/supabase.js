import { createClient } from "@supabase/supabase-js";


// ============================================================
// AUMVEDA SUPABASE CLIENT
// ============================================================

const supabaseUrl =
    import.meta.env.VITE_SUPABASE_URL;

const supabaseAnonKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY;


// ============================================================
// ENVIRONMENT VALIDATION
// ============================================================

if (!supabaseUrl) {

    throw new Error(
        "VITE_SUPABASE_URL is missing from the Customer Web .env file."
    );

}


if (!supabaseAnonKey) {

    throw new Error(
        "VITE_SUPABASE_ANON_KEY is missing from the Customer Web .env file."
    );

}


// ============================================================
// SUPABASE CLIENT
// ============================================================

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
        auth: {

            // Keep the customer logged in
            // after refreshing the browser.
            persistSession: true,

            // Automatically refresh expired
            // Supabase access tokens.
            autoRefreshToken: true,

            // Required for OAuth redirect handling.
            detectSessionInUrl: true,

        },
    }
);


export default supabase;