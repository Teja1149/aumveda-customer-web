import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    ArrowRight,
    Leaf,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import "../styles/auth.css";


function LoginPage() {

    const navigate = useNavigate();

    const location = useLocation();

    const {
        login,
    } = useAuth();


    const [form, setForm] = useState({
        email: "",
        password: "",
    });


    const [showPassword, setShowPassword] =
        useState(false);


    const [loading, setLoading] =
        useState(false);


    const [error, setError] =
        useState("");


    const [success, setSuccess] =
        useState("");


    // ========================================================
    // INPUT CHANGE
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
    // LOGIN
    // ========================================================

    async function handleSubmit(event) {

        event.preventDefault();


        setError("");

        setSuccess("");


        if (!form.email.trim()) {

            setError(
                "Please enter your email address."
            );

            return;
        }


        if (!form.password) {

            setError(
                "Please enter your password."
            );

            return;
        }


        try {

            setLoading(true);


            await login(
                form.email,
                form.password
            );


            setSuccess(
                "Login successful. Welcome back to AUMVEDA."
            );


            /*
             * If the user was redirected to login
             * from another page, return there.
             *
             * Otherwise go to Home.
             */

            const destination =
                location.state?.from?.pathname ||
                "/";


            setTimeout(() => {

                navigate(
                    destination,
                    {
                        replace: true,
                    }
                );

            }, 300);

        }

        catch (loginError) {

            console.error(
                "AUMVEDA login failed:",
                loginError
            );


            setError(
                loginError.message ||
                "Unable to login. Please check your credentials."
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
                    LEFT BRAND PANEL
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
                            AUMVEDA WELLNESS
                        </p>


                        <h1>
                            Rooted in Nature.
                            <span>
                                Refined by Ayurveda.
                            </span>
                        </h1>


                        <p className="auth-brand-description">

                            Discover authentic Ayurvedic
                            wellness rooted in ancient wisdom
                            and created for modern living.

                        </p>


                        <div className="auth-brand-points">

                            <div>
                                <span>01</span>
                                Natural Wellness
                            </div>

                            <div>
                                <span>02</span>
                                Ayurvedic Wisdom
                            </div>

                            <div>
                                <span>03</span>
                                Modern Care
                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    LOGIN PANEL
                ================================================= */}

                <section className="auth-form-panel">

                    <div className="auth-form-wrapper">


                        <div className="auth-heading">

                            <p>
                                WELCOME BACK
                            </p>

                            <h2>
                                Sign in to AUMVEDA
                            </h2>

                            <span>
                                Continue your wellness journey.
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


                            {/* EMAIL */}

                            <div className="auth-field">

                                <label htmlFor="login-email">
                                    Email Address
                                </label>


                                <div className="auth-input">

                                    <Mail
                                        size={18}
                                    />


                                    <input
                                        id="login-email"
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

                                <div className="auth-label-row">

                                    <label htmlFor="login-password">
                                        Password
                                    </label>

                                    <button
                                        type="button"
                                        className="auth-forgot"
                                        onClick={() => {
                                            setError(
                                                "Password reset will be added next."
                                            );
                                        }}
                                    >
                                        Forgot password?
                                    </button>

                                </div>


                                <div className="auth-input">

                                    <Lock
                                        size={18}
                                    />


                                    <input
                                        id="login-password"
                                        name="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter your password"
                                        value={form.password}
                                        onChange={handleChange}
                                        autoComplete="current-password"
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
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
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


                            {/* SUBMIT */}

                            <button
                                type="submit"
                                className="auth-submit"
                                disabled={loading}
                            >

                                {loading ? (

                                    <>
                                        <span className="auth-spinner" />
                                        Signing in...
                                    </>

                                ) : (

                                    <>
                                        Sign In

                                        <ArrowRight
                                            size={18}
                                        />
                                    </>

                                )}

                            </button>


                        </form>


                        {/* SIGNUP */}

                        <div className="auth-switch">

                            <span>
                                Don't have an account?
                            </span>


                            <Link
                                to="/signup"
                            >
                                Create Account
                            </Link>

                        </div>


                        <div className="auth-footer-note">

                            <Leaf
                                size={14}
                            />

                            <span>
                                Wellness rooted in nature
                            </span>

                        </div>

                    </div>

                </section>

            </div>

        </div>

    );

}


export default LoginPage;