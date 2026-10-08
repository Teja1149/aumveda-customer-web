import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { supabase } from "../services/supabase";


// ============================================================
// AUTH CONTEXT
// ============================================================

const AuthContext = createContext(null);


// ============================================================
// AUTH PROVIDER
// ============================================================

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [session, setSession] = useState(null);

    const [loading, setLoading] = useState(true);


    // ========================================================
    // INITIAL SESSION
    // ========================================================

    useEffect(() => {

        let mounted = true;


        async function loadSession() {

            try {

                const {
                    data,
                    error,
                } = await supabase.auth.getSession();


                if (error) {

                    console.error(
                        "Failed to get Supabase session:",
                        error
                    );

                    if (mounted) {

                        setSession(null);
                        setUser(null);

                    }

                    return;
                }


                if (!mounted) {
                    return;
                }


                setSession(
                    data?.session || null
                );

                setUser(
                    data?.session?.user || null
                );

            }

            catch (error) {

                console.error(
                    "Auth session initialization failed:",
                    error
                );


                if (mounted) {

                    setSession(null);
                    setUser(null);

                }

            }

            finally {

                if (mounted) {

                    setLoading(false);

                }

            }

        }


        loadSession();


        // ====================================================
        // AUTH STATE LISTENER
        // ====================================================

        const {
            data: authListener,
        } = supabase.auth.onAuthStateChange(
            (
                event,
                nextSession
            ) => {

                if (!mounted) {
                    return;
                }


                console.log(
                    "AUMVEDA Auth Event:",
                    event
                );


                setSession(
                    nextSession || null
                );

                setUser(
                    nextSession?.user || null
                );

            }
        );


        return () => {

            mounted = false;

            authListener?.subscription?.unsubscribe();

        };

    }, []);


    // ========================================================
    // LOGIN
    // ========================================================

    async function login(
        email,
        password
    ) {

        const cleanEmail =
            email?.trim();


        if (!cleanEmail) {

            throw new Error(
                "Please enter your email address."
            );

        }


        if (!password) {

            throw new Error(
                "Please enter your password."
            );

        }


        const {
            data,
            error,
        } = await supabase.auth.signInWithPassword({

            email: cleanEmail,

            password,

        });


        if (error) {

            throw new Error(
                error.message
            );

        }


        setSession(
            data?.session || null
        );

        setUser(
            data?.user || null
        );


        return data;

    }


    // ========================================================
    // SIGNUP
    // ========================================================

    async function signup({
        fullName,
        email,
        password,
    }) {

        const cleanName =
            fullName?.trim();

        const cleanEmail =
            email?.trim();


        if (!cleanName) {

            throw new Error(
                "Please enter your full name."
            );

        }


        if (!cleanEmail) {

            throw new Error(
                "Please enter your email address."
            );

        }


        if (!password) {

            throw new Error(
                "Please enter a password."
            );

        }


        if (password.length < 6) {

            throw new Error(
                "Password must contain at least 6 characters."
            );

        }


        // ====================================================
        // SUPABASE SIGNUP
        // ====================================================

        const {
            data,
            error,
        } = await supabase.auth.signUp({

            email: cleanEmail,

            password,

            options: {

                data: {

                    full_name:
                        cleanName,

                },

            },

        });


        if (error) {

            throw new Error(
                error.message
            );

        }


        /*
         * DATABASE TRIGGER
         *
         * auth.users
         *      ↓
         * handle_new_customer()
         *      ↓
         * profiles
         *      ↓
         * customer_profiles
         *
         * full_name is received from:
         *
         * NEW.raw_user_meta_data ->> 'full_name'
         */


        setSession(
            data?.session || null
        );

        setUser(
            data?.user || null
        );


        return data;

    }


    // ========================================================
    // LOGOUT
    // ========================================================

    async function logout() {

        const {
            error,
        } = await supabase.auth.signOut();


        if (error) {

            throw new Error(
                error.message
            );

        }


        setSession(null);

        setUser(null);

    }


    // ========================================================
    // AUTHENTICATION STATE
    // ========================================================

    const isAuthenticated =
        Boolean(
            session &&
            user
        );


    // ========================================================
    // USER DISPLAY NAME
    // ========================================================

    const displayName =
        user?.user_metadata?.full_name ||
        user?.email?.split("@")[0] ||
        "AUMVEDA Customer";


    // ========================================================
    // CONTEXT VALUE
    // ========================================================

    const value = {

        user,

        session,

        loading,

        isAuthenticated,

        displayName,

        login,

        signup,

        logout,

    };


    return (

        <AuthContext.Provider
            value={value}
        >

            {children}

        </AuthContext.Provider>

    );

}


// ============================================================
// USE AUTH HOOK
// ============================================================

export function useAuth() {

    const context =
        useContext(
            AuthContext
        );


    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider."
        );

    }


    return context;

}


export default AuthContext;