import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Leaf,
    Check,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import "../styles/auth.css";


function SignupPage() {

    const navigate = useNavigate();

    const {
        signup,
    } = useAuth();


    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });


    const [showPassword, setShowPassword] =
        useState(false);


    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);


    const [loading, setLoading] =
        useState(false);


    const [error, setError] =
        useState("");


    const [success, setSuccess] =
        useState("");


    // ========================================================
    // INPUT
    // ========================================================

    function handleChange(event) {

        const {
            name,
            value,
        } = event.target;


        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));


        if (error) {
            setError("");
        }

    }


    // ========================================================
    // SIGNUP
    // ========================================================

    async function handleSubmit(event) {

        event.preventDefault();


        setError("");

        setSuccess("");


        if (!form.fullName.trim()) {

            setError(
                "Please enter your full name."
            );

            return;
        }


        if (!form.email.trim()) {

            setError(
                "Please enter your email address."
            );

            return;
        }


        if (!form.password) {

            setError(
                "Please create a password."
            );

            return;
        }


        if (form.password.length < 6) {

            setError(
                "Password must contain at least 6 characters."
            );

            return;
        }


        if (
            form.password !==
            form.confirmPassword
        ) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        try {

            setLoading(true);


            const data = await signup({

                fullName:
                    form.fullName,

                email:
                    form.email,

                password:
                    form.password,

            });


            /*
             * Supabase can require email confirmation.
             *
             * When email confirmation is enabled,
             * data.session will be null.
             */

            if (!data.session) {

                setSuccess(
                    "Account created successfully. Please check your email to verify your account."
                );


                setTimeout(() => {

                    navigate(
                        "/login",
                        {
                            replace: true,
                        }
                    );

                }, 1800);


                return;

            }


            setSuccess(
                "Account created successfully. Welcome to AUMVEDA."
            );


            setTimeout(() => {

                navigate(
                    "/",
                    {
                        replace: true,
                    }
                );

            }, 500);

        }

        catch (signupError) {

            console.error(
                "AUMVEDA signup failed:",
                signupError
            );


            setError(
                signupError.message ||
                "Unable to create your account."
            );

        }

        finally {

            setLoading(false);

        }

    }


    return (

        <div className="auth-page">

            <div className="auth-container">


                {/* =================================================
                    BRAND PANEL
                ================================================= */}

                <section className="auth-brand-panel">

                    <div className="auth-brand-content">

                        <div className="auth-brand-mark">

                            <Leaf
                                size={28}
                                strokeWidth={1.6}
                            />

                        </div>


                        <p className="auth-eyebrow">
                            BEGIN YOUR JOURNEY
                        </p>


                        <h1>
                            Wellness starts
                            <span>
                                with nature.
                            </span>
                        </h1>


                        <p className="auth-brand-description">

                            Create your AUMVEDA account
                            and explore a more natural approach
                            to everyday wellness.

                        </p>


                        <div className="auth-brand-points">

                            <div>
                                <span>
                                    <Check size={13} />
                                </span>
                                Ayurvedic Products
                            </div>

                            <div>
                                <span>
                                    <Check size={13} />
                                </span>
                                Personalized Wellness
                            </div>

                            <div>
                                <span>
                                    <Check size={13} />
                                </span>
                                One Account Everywhere
                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    SIGNUP PANEL
                ================================================= */}

                <section className="auth-form-panel">

                    <div className="auth-form-wrapper">


                        <div className="auth-heading">

                            <p>
                                CREATE ACCOUNT
                            </p>

                            <h2>
                                Join AUMVEDA
                            </h2>

                            <span>
                                Your personalized wellness journey
                                begins here.
                            </span>

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="auth-message auth-message--error">

                                {error}

                            </div>

                        )}


                        {/* SUCCESS */}

                        {success && (

                            <div className="auth-message auth-message--success">

                                {success}

                            </div>

                        )}


                        <form
                            className="auth-form"
                            onSubmit={handleSubmit}
                        >


                            {/* FULL NAME */}

                            <div className="auth-field">

                                <label htmlFor="signup-name">
                                    Full Name
                                </label>


                                <div className="auth-input">

                                    <User
                                        size={18}
                                    />

                                    <input
                                        id="signup-name"
                                        name="fullName"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        autoComplete="name"
                                    />

                                </div>

                            </div>


                            {/* EMAIL */}

                            <div className="auth-field">

                                <label htmlFor="signup-email">
                                    Email Address
                                </label>


                                <div className="auth-input">

                                    <Mail
                                        size={18}
                                    />

                                    <input
                                        id="signup-email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={form.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                    />

                                </div>

                            </div>


                            {/* PASSWORD */}

                            <div className="auth-field">

                                <label htmlFor="signup-password">
                                    Password
                                </label>


                                <div className="auth-input">

                                    <Lock
                                        size={18}
                                    />

                                    <input
                                        id="signup-password"
                                        name="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Create a password"
                                        value={form.password}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                    />


                                    <button
                                        type="button"
                                        className="auth-password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                (previous) =>
                                                    !previous
                                            )
                                        }
                                    >

                                        {
                                            showPassword
                                                ? (
                                                    <EyeOff
                                                        size={18}
                                                    />
                                                )
                                                : (
                                                    <Eye
                                                        size={18}
                                                    />
                                                )
                                        }

                                    </button>

                                </div>

                            </div>


                            {/* CONFIRM PASSWORD */}

                            <div className="auth-field">

                                <label htmlFor="signup-confirm-password">
                                    Confirm Password
                                </label>


                                <div className="auth-input">

                                    <Lock
                                        size={18}
                                    />

                                    <input
                                        id="signup-confirm-password"
                                        name="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Confirm your password"
                                        value={
                                            form.confirmPassword
                                        }
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                    />


                                    <button
                                        type="button"
                                        className="auth-password-toggle"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (previous) =>
                                                    !previous
                                            )
                                        }
                                    >

                                        {
                                            showConfirmPassword
                                                ? (
                                                    <EyeOff
                                                        size={18}
                                                    />
                                                )
                                                : (
                                                    <Eye
                                                        size={18}
                                                    />
                                                )
                                        }

                                    </button>

                                </div>

                            </div>


                            {/* SUBMIT */}

                            <button
                                type="submit"
                                className="auth-submit"
                                disabled={loading}
                            >

                                {loading ? (

                                    <>
                                        <span className="auth-spinner" />
                                        Creating account...
                                    </>

                                ) : (

                                    <>
                                        Create Account

                                        <ArrowRight
                                            size={18}
                                        />
                                    </>

                                )}

                            </button>


                        </form>


                        {/* LOGIN */}

                        <div className="auth-switch">

                            <span>
                                Already have an account?
                            </span>


                            <Link
                                to="/login"
                            >
                                Sign In
                            </Link>

                        </div>


                        <div className="auth-footer-note">

                            <Leaf
                                size={14}
                            />

                            <span>
                                Ancient wisdom • Modern wellness
                            </span>

                        </div>

                    </div>

                </section>

            </div>

        </div>

    );

}


export default SignupPage;