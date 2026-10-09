import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    ArrowRight,
    Check,
    Eye,
    EyeOff,
    Leaf,
    Lock,
    Mail,
    Phone,
    ShieldCheck,
    User
} from "lucide-react";

import {
    useAuth
} from "../context/AuthContext";

import "../styles/auth.css";


const AUTH_REDIRECT_KEY =
    "aumveda_auth_redirect";


/* ============================================================
   DESTINATION
============================================================ */

function getDestination(
    location
) {

    const from =
        location.state?.from;


    if (
        typeof from ===
        "string"
    ) {

        return from;

    }


    if (
        from?.pathname
    ) {

        return `${from.pathname}${from.search || ""}`;

    }


    const saved =
        sessionStorage.getItem(
            AUTH_REDIRECT_KEY
        );


    return (
        saved ||
        "/"
    );

}


/* ============================================================
   SIGNUP PAGE
============================================================ */

function SignupPage() {

    const navigate =
        useNavigate();


    const location =
        useLocation();


    const {

        signup,

        sendPhoneOtp,

        verifyPhoneOtp,

        continueWithGoogle,

        isAuthenticated,

        loading:
            authLoading

    } =
        useAuth();


    const [
        authMethod,
        setAuthMethod
    ] =
        useState(
            "email"
        );


    const [
        form,
        setForm
    ] =
        useState({

            fullName:
                "",

            email:
                "",

            phone:
                "",

            password:
                "",

            confirmPassword:
                "",

            otp:
                ""

        });


    const [
        showPassword,
        setShowPassword
    ] =
        useState(
            false
        );


    const [
        showConfirmPassword,
        setShowConfirmPassword
    ] =
        useState(
            false
        );


    const [
        otpSent,
        setOtpSent
    ] =
        useState(
            false
        );


    const [
        verifiedPhone,
        setVerifiedPhone
    ] =
        useState(
            ""
        );


    const [
        loading,
        setLoading
    ] =
        useState(
            false
        );


    const [
        error,
        setError
    ] =
        useState(
            ""
        );


    const [
        success,
        setSuccess
    ] =
        useState(
            ""
        );


    const destination =
        getDestination(
            location
        );


    /* ========================================================
       OAUTH RETURN
    ======================================================== */

    useEffect(() => {

        if (
            authLoading ||
            !isAuthenticated
        ) {

            return;

        }


        const finalDestination =
            sessionStorage.getItem(
                AUTH_REDIRECT_KEY
            ) ||
            destination ||
            "/";


        sessionStorage.removeItem(
            AUTH_REDIRECT_KEY
        );


        navigate(
            finalDestination,
            {
                replace:
                    true
            }
        );

    }, [
        authLoading,
        isAuthenticated,
        navigate,
        destination
    ]);


    /* ========================================================
       CHANGE
    ======================================================== */

    function handleChange(
        event
    ) {

        const {
            name,
            value
        } =
            event.target;


        setForm(
            previous => ({
                ...previous,
                [name]:
                    value
            })
        );


        if (error) {

            setError(
                ""
            );

        }


        if (success) {

            setSuccess(
                ""
            );

        }

    }


    /* ========================================================
       AUTH METHOD
    ======================================================== */

    function changeAuthMethod(
        method
    ) {

        setAuthMethod(
            method
        );


        setError(
            ""
        );


        setSuccess(
            ""
        );


        setOtpSent(
            false
        );


        setVerifiedPhone(
            ""
        );


        setForm(
            previous => ({
                ...previous,
                otp:
                    ""
            })
        );

    }


    /* ========================================================
       EMAIL SIGNUP
    ======================================================== */

    async function handleEmailSignup(
        event
    ) {

        event.preventDefault();


        setError(
            ""
        );


        setSuccess(
            ""
        );


        if (
            !form.fullName.trim()
        ) {

            setError(
                "Please enter your full name."
            );


            return;

        }


        if (
            !form.email.trim()
        ) {

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


        if (
            form.password.length <
            6
        ) {

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

            setLoading(
                true
            );


            const data =
                await signup({

                    fullName:
                        form.fullName,

                    email:
                        form.email,

                    phone:
                        form.phone,

                    password:
                        form.password

                });


            /*
             * Email confirmation enabled.
             */

            if (!data.session) {

                setSuccess(
                    "Account created successfully. Please verify your email, then sign in."
                );


                setTimeout(
                    () => {

                        navigate(
                            "/login",
                            {
                                replace:
                                    true,

                                state: {
                                    from:
                                        location.state?.from || {
                                            pathname:
                                                destination
                                        }
                                }
                            }
                        );

                    },
                    1600
                );


                return;

            }


            setSuccess(
                "Account created successfully. Welcome to AUMVEDA."
            );


            navigate(
                destination,
                {
                    replace:
                        true
                }
            );

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

            setLoading(
                false
            );

        }

    }


    /* ========================================================
       SEND PHONE SIGNUP OTP
    ======================================================== */

    async function handleSendSignupOtp(
        event
    ) {

        event.preventDefault();


        setError(
            ""
        );


        setSuccess(
            ""
        );


        if (
            !form.fullName.trim()
        ) {

            setError(
                "Please enter your full name."
            );


            return;

        }


        try {

            setLoading(
                true
            );


            const result =
                await sendPhoneOtp({

                    phone:
                        form.phone,

                    shouldCreateUser:
                        true,

                    fullName:
                        form.fullName

                });


            setVerifiedPhone(
                result.phone
            );


            setOtpSent(
                true
            );


            setSuccess(
                `OTP sent to ${result.phone}.`
            );

        }
        catch (otpError) {

            console.error(
                "AUMVEDA phone signup OTP failed:",
                otpError
            );


            setError(
                otpError.message ||
                "Unable to send OTP."
            );

        }
        finally {

            setLoading(
                false
            );

        }

    }


    /* ========================================================
       VERIFY PHONE SIGNUP OTP
    ======================================================== */

    async function handleVerifySignupOtp(
        event
    ) {

        event.preventDefault();


        setError(
            ""
        );


        setSuccess(
            ""
        );


        try {

            setLoading(
                true
            );


            await verifyPhoneOtp({

                phone:
                    verifiedPhone ||
                    form.phone,

                token:
                    form.otp

            });


            setSuccess(
                "Account created successfully. Welcome to AUMVEDA."
            );


            sessionStorage.removeItem(
                AUTH_REDIRECT_KEY
            );


            navigate(
                destination,
                {
                    replace:
                        true
                }
            );

        }
        catch (verifyError) {

            console.error(
                "AUMVEDA phone signup verification failed:",
                verifyError
            );


            setError(
                verifyError.message ||
                "The OTP could not be verified."
            );

        }
        finally {

            setLoading(
                false
            );

        }

    }


    /* ========================================================
       GOOGLE
    ======================================================== */

    async function handleGoogleSignup() {

        setError(
            ""
        );


        setSuccess(
            ""
        );


        try {

            setLoading(
                true
            );


            sessionStorage.setItem(
                AUTH_REDIRECT_KEY,
                destination
            );


            await continueWithGoogle({

                redirectTo:
                    `${window.location.origin}/signup`

            });

        }
        catch (googleError) {

            console.error(
                "AUMVEDA Google signup failed:",
                googleError
            );


            sessionStorage.removeItem(
                AUTH_REDIRECT_KEY
            );


            setError(
                googleError.message ||
                "Unable to continue with Google."
            );


            setLoading(
                false
            );

        }

    }


    /* ========================================================
       LOGIN STATE
    ======================================================== */

    const loginState = {

        from:
            location.state?.from || {
                pathname:
                    destination
            }

    };


    /* ========================================================
       RENDER
    ======================================================== */

    return (

        <div
            className="auth-page"
        >

            <div
                className="
                    auth-container
                    auth-container--signup
                "
            >

                {/* =================================================
                    BRAND
                ================================================= */}

                <section
                    className="auth-brand-panel"
                >

                    <div
                        className="auth-brand-content"
                    >

                        <div
                            className="auth-brand-mark"
                        >

                            <Leaf
                                size={28}
                                strokeWidth={1.6}
                            />

                        </div>


                        <p
                            className="auth-eyebrow"
                        >
                            BEGIN YOUR JOURNEY
                        </p>


                        <h1>

                            Wellness starts

                            <span>
                                with nature.
                            </span>

                        </h1>


                        <p
                            className="auth-brand-description"
                        >
                            Create one AUMVEDA account
                            for shopping, checkout,
                            saved addresses and your
                            future wellness journey.
                        </p>


                        <div
                            className="auth-brand-points"
                        >

                            <div>

                                <span>
                                    <Check
                                        size={13}
                                    />
                                </span>

                                Authentic products

                            </div>


                            <div>

                                <span>
                                    <Check
                                        size={13}
                                    />
                                </span>

                                Saved delivery details

                            </div>


                            <div>

                                <span>
                                    <Check
                                        size={13}
                                    />
                                </span>

                                Faster future checkout

                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    SIGNUP
                ================================================= */}

                <section
                    className="auth-form-panel"
                >

                    <div
                        className="auth-form-wrapper"
                    >

                        <div
                            className="auth-heading"
                        >

                            <p>
                                CREATE ACCOUNT
                            </p>


                            <h2>
                                Join AUMVEDA
                            </h2>


                            <span>
                                Choose how you would like to create your account.
                            </span>

                        </div>


                        {/* =================================================
                            GOOGLE
                        ================================================= */}

                        <button
                            type="button"
                            className="auth-google-button"
                            onClick={
                                handleGoogleSignup
                            }
                            disabled={
                                loading
                            }
                        >

                            <span
                                className="auth-google-mark"
                            >
                                G
                            </span>

                            Continue with Google

                        </button>


                        <div
                            className="auth-divider"
                        >

                            <span>
                                or create account with
                            </span>

                        </div>


                        {/* =================================================
                            AUTH METHOD
                        ================================================= */}

                        <div
                            className="auth-method-tabs"
                        >

                            <button
                                type="button"
                                className={
                                    authMethod ===
                                    "email"
                                        ? "is-active"
                                        : ""
                                }
                                onClick={() =>
                                    changeAuthMethod(
                                        "email"
                                    )
                                }
                            >

                                <Mail
                                    size={16}
                                />

                                Email

                            </button>


                            <button
                                type="button"
                                className={
                                    authMethod ===
                                    "phone"
                                        ? "is-active"
                                        : ""
                                }
                                onClick={() =>
                                    changeAuthMethod(
                                        "phone"
                                    )
                                }
                            >

                                <Phone
                                    size={16}
                                />

                                Phone OTP

                            </button>

                        </div>


                        {/* =================================================
                            MESSAGES
                        ================================================= */}

                        {
                            error && (

                                <div
                                    className="
                                        auth-message
                                        auth-message--error
                                    "
                                >
                                    {error}
                                </div>

                            )
                        }


                        {
                            success && (

                                <div
                                    className="
                                        auth-message
                                        auth-message--success
                                    "
                                >
                                    {success}
                                </div>

                            )
                        }


                        {/* =================================================
                            EMAIL SIGNUP
                        ================================================= */}

                        {
                            authMethod ===
                            "email" && (

                                <form
                                    className="auth-form"
                                    onSubmit={
                                        handleEmailSignup
                                    }
                                >

                                    <div
                                        className="auth-field"
                                    >

                                        <label
                                            htmlFor="signup-name"
                                        >
                                            Full Name
                                        </label>


                                        <div
                                            className="auth-input"
                                        >

                                            <User
                                                size={18}
                                            />


                                            <input
                                                id="signup-name"
                                                name="fullName"
                                                type="text"
                                                placeholder="Enter your full name"
                                                value={
                                                    form.fullName
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                autoComplete="name"
                                                required
                                            />

                                        </div>

                                    </div>


                                    <div
                                        className="auth-field"
                                    >

                                        <label
                                            htmlFor="signup-email"
                                        >
                                            Email Address
                                        </label>


                                        <div
                                            className="auth-input"
                                        >

                                            <Mail
                                                size={18}
                                            />


                                            <input
                                                id="signup-email"
                                                name="email"
                                                type="email"
                                                placeholder="Enter your email"
                                                value={
                                                    form.email
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                autoComplete="email"
                                                required
                                            />

                                        </div>

                                    </div>


                                    <div
                                        className="auth-field"
                                    >

                                        <label
                                            htmlFor="signup-phone"
                                        >
                                            Phone Number
                                            <small>
                                                Optional
                                            </small>
                                        </label>


                                        <div
                                            className="auth-input"
                                        >

                                            <Phone
                                                size={18}
                                            />


                                            <input
                                                id="signup-phone"
                                                name="phone"
                                                type="tel"
                                                placeholder="+91 9876543210"
                                                value={
                                                    form.phone
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                autoComplete="tel"
                                            />

                                        </div>

                                    </div>


                                    <div
                                        className="auth-password-grid"
                                    >

                                        <div
                                            className="auth-field"
                                        >

                                            <label
                                                htmlFor="signup-password"
                                            >
                                                Password
                                            </label>


                                            <div
                                                className="auth-input"
                                            >

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
                                                    placeholder="Create password"
                                                    value={
                                                        form.password
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    autoComplete="new-password"
                                                    required
                                                />


                                                <button
                                                    type="button"
                                                    className="auth-password-toggle"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            previous =>
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


                                        <div
                                            className="auth-field"
                                        >

                                            <label
                                                htmlFor="signup-confirm-password"
                                            >
                                                Confirm Password
                                            </label>


                                            <div
                                                className="auth-input"
                                            >

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
                                                    placeholder="Confirm password"
                                                    value={
                                                        form.confirmPassword
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    autoComplete="new-password"
                                                    required
                                                />


                                                <button
                                                    type="button"
                                                    className="auth-password-toggle"
                                                    onClick={() =>
                                                        setShowConfirmPassword(
                                                            previous =>
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

                                    </div>


                                    <button
                                        type="submit"
                                        className="auth-submit"
                                        disabled={
                                            loading
                                        }
                                    >

                                        {
                                            loading
                                                ? (
                                                    <>
                                                        <span
                                                            className="auth-spinner"
                                                        />

                                                        Creating account...
                                                    </>
                                                )
                                                : (
                                                    <>
                                                        Create Account

                                                        <ArrowRight
                                                            size={18}
                                                        />
                                                    </>
                                                )
                                        }

                                    </button>

                                </form>

                            )
                        }


                        {/* =================================================
                            PHONE SIGNUP
                        ================================================= */}

                        {
                            authMethod ===
                            "phone" && (

                                <form
                                    className="auth-form"
                                    onSubmit={
                                        otpSent
                                            ? handleVerifySignupOtp
                                            : handleSendSignupOtp
                                    }
                                >

                                    <div
                                        className="auth-field"
                                    >

                                        <label
                                            htmlFor="phone-signup-name"
                                        >
                                            Full Name
                                        </label>


                                        <div
                                            className="auth-input"
                                        >

                                            <User
                                                size={18}
                                            />


                                            <input
                                                id="phone-signup-name"
                                                name="fullName"
                                                type="text"
                                                placeholder="Enter your full name"
                                                value={
                                                    form.fullName
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                disabled={
                                                    otpSent
                                                }
                                                autoComplete="name"
                                                required
                                            />

                                        </div>

                                    </div>


                                    <div
                                        className="auth-field"
                                    >

                                        <label
                                            htmlFor="phone-signup-phone"
                                        >
                                            Phone Number
                                        </label>


                                        <div
                                            className="auth-input"
                                        >

                                            <Phone
                                                size={18}
                                            />


                                            <input
                                                id="phone-signup-phone"
                                                name="phone"
                                                type="tel"
                                                placeholder="+91 9876543210"
                                                value={
                                                    form.phone
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                disabled={
                                                    otpSent
                                                }
                                                autoComplete="tel"
                                                required
                                            />

                                        </div>

                                    </div>


                                    {
                                        otpSent && (

                                            <div
                                                className="auth-field"
                                            >

                                                <label
                                                    htmlFor="signup-otp"
                                                >
                                                    Enter OTP
                                                </label>


                                                <div
                                                    className="auth-input"
                                                >

                                                    <ShieldCheck
                                                        size={18}
                                                    />


                                                    <input
                                                        id="signup-otp"
                                                        name="otp"
                                                        type="text"
                                                        inputMode="numeric"
                                                        autoComplete="one-time-code"
                                                        placeholder="6-digit OTP"
                                                        value={
                                                            form.otp
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        maxLength={8}
                                                        required
                                                    />

                                                </div>

                                            </div>

                                        )
                                    }


                                    <button
                                        type="submit"
                                        className="auth-submit"
                                        disabled={
                                            loading
                                        }
                                    >

                                        {
                                            loading
                                                ? (
                                                    <>
                                                        <span
                                                            className="auth-spinner"
                                                        />

                                                        {
                                                            otpSent
                                                                ? "Verifying..."
                                                                : "Sending OTP..."
                                                        }
                                                    </>
                                                )
                                                : (
                                                    <>

                                                        {
                                                            otpSent
                                                                ? "Verify & Create Account"
                                                                : "Send OTP"
                                                        }

                                                        <ArrowRight
                                                            size={18}
                                                        />

                                                    </>
                                                )
                                        }

                                    </button>


                                    {
                                        otpSent && (

                                            <button
                                                type="button"
                                                className="auth-secondary-action"
                                                onClick={() => {

                                                    setOtpSent(
                                                        false
                                                    );


                                                    setVerifiedPhone(
                                                        ""
                                                    );


                                                    setForm(
                                                        previous => ({
                                                            ...previous,
                                                            otp:
                                                                ""
                                                        })
                                                    );


                                                    setError(
                                                        ""
                                                    );


                                                    setSuccess(
                                                        ""
                                                    );

                                                }}
                                            >
                                                Change details
                                            </button>

                                        )
                                    }

                                </form>

                            )
                        }


                        {/* =================================================
                            LOGIN
                        ================================================= */}

                        <div
                            className="auth-switch"
                        >

                            <span>
                                Already have an account?
                            </span>


                            <Link
                                to="/login"
                                state={
                                    loginState
                                }
                            >
                                Sign In
                            </Link>

                        </div>


                        <div
                            className="auth-footer-note"
                        >

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