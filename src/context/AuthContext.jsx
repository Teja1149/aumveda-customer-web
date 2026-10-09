/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    supabase
} from "../services/supabase";


/* ============================================================
   AUTH CONTEXT
============================================================ */

const AuthContext =
    createContext(
        null
    );


/* ============================================================
   PHONE NORMALIZATION
============================================================ */

function normalizePhoneNumber(
    value
) {

    const raw =
        String(
            value || ""
        ).trim();


    if (!raw) {

        throw new Error(
            "Please enter your phone number."
        );

    }


    /*
     * Keep only numbers and optional leading +
     */

    let cleaned =
        raw.replace(
            /[^\d+]/g,
            ""
        );


    /*
     * Indian 10-digit mobile number:
     * automatically add +91.
     */

    if (
        /^\d{10}$/.test(
            cleaned
        )
    ) {

        cleaned =
            `+91${cleaned}`;

    }


    /*
     * Number entered as 91XXXXXXXXXX
     */

    if (
        /^91\d{10}$/.test(
            cleaned
        )
    ) {

        cleaned =
            `+${cleaned}`;

    }


    if (
        !cleaned.startsWith(
            "+"
        )
    ) {

        throw new Error(
            "Please include your country code. Example: +91 9876543210."
        );

    }


    return cleaned;

}


/* ============================================================
   AUTH PROVIDER
============================================================ */

export function AuthProvider({
    children
}) {

    const [
        user,
        setUser
    ] =
        useState(
            null
        );


    const [
        session,
        setSession
    ] =
        useState(
            null
        );


    const [
        loading,
        setLoading
    ] =
        useState(
            true
        );


    /* ========================================================
       INITIAL SESSION + AUTH LISTENER
    ======================================================== */

    useEffect(() => {

        let mounted =
            true;


        async function loadSession() {

            try {

                const {
                    data,
                    error
                } =
                    await supabase.auth.getSession();


                if (error) {

                    throw error;

                }


                if (!mounted) {

                    return;

                }


                setSession(
                    data?.session ||
                    null
                );


                setUser(
                    data?.session?.user ||
                    null
                );

            }
            catch (sessionError) {

                console.error(
                    "AUMVEDA auth initialization failed:",
                    sessionError
                );


                if (mounted) {

                    setSession(
                        null
                    );


                    setUser(
                        null
                    );

                }

            }
            finally {

                if (mounted) {

                    setLoading(
                        false
                    );

                }

            }

        }


        loadSession();


        const {
            data: authListener
        } =
            supabase.auth.onAuthStateChange(
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
                        nextSession ||
                        null
                    );


                    setUser(
                        nextSession?.user ||
                        null
                    );


                    setLoading(
                        false
                    );

                }
            );


        return () => {

            mounted =
                false;


            authListener
                ?.subscription
                ?.unsubscribe();

        };

    }, []);


    /* ========================================================
       EMAIL + PASSWORD LOGIN
    ======================================================== */

    async function login(
        email,
        password
    ) {

        const cleanEmail =
            String(
                email || ""
            )
                .trim()
                .toLowerCase();


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
            error
        } =
            await supabase.auth
                .signInWithPassword({
                    email:
                        cleanEmail,

                    password
                });


        if (error) {

            throw new Error(
                error.message
            );

        }


        setSession(
            data?.session ||
            null
        );


        setUser(
            data?.user ||
            null
        );


        return data;

    }


    /* ========================================================
       EMAIL + PASSWORD SIGNUP
    ======================================================== */

    async function signup({
        fullName,
        email,
        phone,
        password
    }) {

        const cleanName =
            String(
                fullName || ""
            ).trim();


        const cleanEmail =
            String(
                email || ""
            )
                .trim()
                .toLowerCase();


        const cleanPhone =
            phone
                ? normalizePhoneNumber(
                    phone
                )
                : "";


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


        if (
            password.length <
            6
        ) {

            throw new Error(
                "Password must contain at least 6 characters."
            );

        }


        const {
            data,
            error
        } =
            await supabase.auth
                .signUp({
                    email:
                        cleanEmail,

                    password,

                    options: {

                        data: {

                            full_name:
                                cleanName,

                            phone:
                                cleanPhone

                        }

                    }

                });


        if (error) {

            throw new Error(
                error.message
            );

        }


        setSession(
            data?.session ||
            null
        );


        setUser(
            data?.user ||
            null
        );


        return data;

    }


    /* ========================================================
       SEND PHONE OTP
    ======================================================== */

    async function sendPhoneOtp({
        phone,
        shouldCreateUser = false,
        fullName = ""
    }) {

        const cleanPhone =
            normalizePhoneNumber(
                phone
            );


        const options = {

            shouldCreateUser:
                Boolean(
                    shouldCreateUser
                )

        };


        if (
            shouldCreateUser &&
            fullName?.trim()
        ) {

            options.data = {

                full_name:
                    fullName.trim()

            };

        }


        const {
            data,
            error
        } =
            await supabase.auth
                .signInWithOtp({
                    phone:
                        cleanPhone,

                    options
                });


        if (error) {

            throw new Error(
                error.message
            );

        }


        return {
            data,
            phone:
                cleanPhone
        };

    }


    /* ========================================================
       VERIFY PHONE OTP
    ======================================================== */

    async function verifyPhoneOtp({
        phone,
        token
    }) {

        const cleanPhone =
            normalizePhoneNumber(
                phone
            );


        const cleanToken =
            String(
                token || ""
            )
                .replace(
                    /\D/g,
                    ""
                )
                .trim();


        if (
            cleanToken.length <
            6
        ) {

            throw new Error(
                "Please enter the complete OTP."
            );

        }


        const {
            data,
            error
        } =
            await supabase.auth
                .verifyOtp({
                    phone:
                        cleanPhone,

                    token:
                        cleanToken,

                    type:
                        "sms"
                });


        if (error) {

            throw new Error(
                error.message
            );

        }


        setSession(
            data?.session ||
            null
        );


        setUser(
            data?.user ||
            null
        );


        return data;

    }


    /* ========================================================
       GOOGLE LOGIN / SIGNUP
    ======================================================== */

    async function continueWithGoogle({
        redirectTo
    } = {}) {

        const finalRedirect =
            redirectTo ||
            `${window.location.origin}/login`;


        const {
            data,
            error
        } =
            await supabase.auth
                .signInWithOAuth({

                    provider:
                        "google",

                    options: {

                        redirectTo:
                            finalRedirect,

                        queryParams: {

                            access_type:
                                "offline",

                            prompt:
                                "consent"

                        }

                    }

                });


        if (error) {

            throw new Error(
                error.message
            );

        }


        return data;

    }


    /* ========================================================
       LOGOUT
    ======================================================== */

    async function logout() {

        const {
            error
        } =
            await supabase.auth
                .signOut();


        if (error) {

            throw new Error(
                error.message
            );

        }


        setSession(
            null
        );


        setUser(
            null
        );

    }


    /* ========================================================
       AUTH STATE
    ======================================================== */

    const isAuthenticated =
        Boolean(
            session &&
            user
        );


    /* ========================================================
       DISPLAY NAME
    ======================================================== */

    const displayName =
        user
            ?.user_metadata
            ?.full_name ||

        user
            ?.user_metadata
            ?.name ||

        user
            ?.email
            ?.split(
                "@"
            )[0] ||

        user
            ?.phone ||

        "AUMVEDA Customer";


    /* ========================================================
       CONTEXT VALUE
    ======================================================== */

    const value = {

        user,

        session,

        loading,

        isAuthenticated,

        displayName,

        login,

        signup,

        sendPhoneOtp,

        verifyPhoneOtp,

        continueWithGoogle,

        logout

    };


    return (

        <AuthContext.Provider
            value={
                value
            }
        >

            {children}

        </AuthContext.Provider>

    );

}


/* ============================================================
   USE AUTH
============================================================ */

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