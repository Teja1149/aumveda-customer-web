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
    Eye,
    EyeOff,
    Leaf,
    Lock,
    Mail,
    Phone,
    ShieldCheck
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
   LOGIN PAGE
============================================================ */

function LoginPage() {

    const navigate =
        useNavigate();


    const location =
        useLocation();


    const {

        login,

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

            email:
                "",

            password:
                "",

            phone:
                "",

            otp:
                ""

        });


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
        showPassword,
        setShowPassword
    ] =
        useState(
            false
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
       HANDLE OAUTH RETURN / ALREADY AUTHENTICATED
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
       INPUT CHANGE
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
       METHOD CHANGE
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
       EMAIL LOGIN
    ======================================================== */

    async function handleEmailLogin(
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


            await login(
                form.email,
                form.password
            );


            setSuccess(
                "Login successful. Welcome back to AUMVEDA."
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
        catch (loginError) {

            console.error(
                "AUMVEDA email login failed:",
                loginError
            );


            setError(
                loginError.message ||
                "Unable to login. Please check your credentials."
            );

        }
        finally {

            setLoading(
                false
            );

        }

    }


    /* ========================================================
       SEND LOGIN OTP
    ======================================================== */

    async function handleSendOtp(
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


            const result =
                await sendPhoneOtp({

                    phone:
                        form.phone,

                    shouldCreateUser:
                        false

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
                "AUMVEDA phone login OTP failed:",
                otpError
            );


            setError(
                otpError.message ||
                "Unable to send OTP. If you do not have an account, create one first."
            );

        }
        finally {

            setLoading(
                false
            );

        }

    }


    /* ========================================================
       VERIFY LOGIN OTP
    ======================================================== */

    async function handleVerifyOtp(
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
                "Phone verified successfully."
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
                "AUMVEDA phone OTP verification failed:",
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
       GOOGLE LOGIN
    ======================================================== */

    async function handleGoogleLogin() {

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
                    `${window.location.origin}/login`

            });

        }
        catch (googleError) {

            console.error(
                "AUMVEDA Google login failed:",
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
       SIGNUP STATE
    ======================================================== */

    const signupState = {

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
                className="auth-container"
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
                            AUMVEDA WELLNESS
                        </p>


                        <h1>

                            Rooted in Nature.

                            <span>
                                Refined by Ayurveda.
                            </span>

                        </h1>


                        <p
                            className="auth-brand-description"
                        >
                            Sign in securely and continue
                            shopping for authentic wellness
                            products without interrupting
                            your journey.
                        </p>


                        <div
                            className="auth-brand-points"
                        >

                            <div>

                                <span>
                                    01
                                </span>

                                Shop securely

                            </div>


                            <div>

                                <span>
                                    02
                                </span>

                                Save delivery addresses

                            </div>


                            <div>

                                <span>
                                    03
                                </span>

                                Faster checkout

                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    LOGIN
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
                                WELCOME BACK
                            </p>


                            <h2>
                                Sign in to AUMVEDA
                            </h2>


                            <span>
                                Continue your wellness journey.
                            </span>

                        </div>


                        {/* =================================================
                            GOOGLE
                        ================================================= */}

                        <button
                            type="button"
                            className="auth-google-button"
                            onClick={
                                handleGoogleLogin
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
                                or continue with
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


                        {/* ERROR */}

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


                        {/* SUCCESS */}

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
                            EMAIL LOGIN
                        ================================================= */}

                        {
                            authMethod ===
                            "email" && (

                                <form
                                    className="auth-form"
                                    onSubmit={
                                        handleEmailLogin
                                    }
                                >

                                    <div
                                        className="auth-field"
                                    >

                                        <label
                                            htmlFor="login-email"
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
                                                id="login-email"
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

                                        <div
                                            className="auth-label-row"
                                        >

                                            <label
                                                htmlFor="login-password"
                                            >
                                                Password
                                            </label>


                                            <button
                                                type="button"
                                                className="auth-forgot"
                                                onClick={() =>
                                                    setError(
                                                        "Password recovery will be connected in the next authentication step."
                                                    )
                                                }
                                            >
                                                Forgot password?
                                            </button>

                                        </div>


                                        <div
                                            className="auth-input"
                                        >

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
                                                value={
                                                    form.password
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                autoComplete="current-password"
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

                                                        Signing in...
                                                    </>
                                                )
                                                : (
                                                    <>
                                                        Sign In

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
                            PHONE LOGIN
                        ================================================= */}

                        {
                            authMethod ===
                            "phone" && (

                                <form
                                    className="auth-form"
                                    onSubmit={
                                        otpSent
                                            ? handleVerifyOtp
                                            : handleSendOtp
                                    }
                                >

                                    <div
                                        className="auth-field"
                                    >

                                        <label
                                            htmlFor="login-phone"
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
                                                id="login-phone"
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
                                                disabled={
                                                    otpSent
                                                }
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
                                                    htmlFor="login-otp"
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
                                                        id="login-otp"
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
                                                                ? "Verify & Sign In"
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
                                                Change phone number
                                            </button>

                                        )
                                    }

                                </form>

                            )
                        }


                        {/* =================================================
                            CREATE ACCOUNT
                        ================================================= */}

                        <div
                            className="auth-switch"
                        >

                            <span>
                                Don&apos;t have an account?
                            </span>


                            <Link
                                to="/signup"
                                state={
                                    signupState
                                }
                            >
                                Create Account
                            </Link>

                        </div>


                        <div
                            className="auth-footer-note"
                        >

                            <Leaf
                                size={14}
                            />

                            <span>
                                Secure access to your AUMVEDA account
                            </span>

                        </div>

                    </div>

                </section>

            </div>

        </div>

    );

}


export default LoginPage;