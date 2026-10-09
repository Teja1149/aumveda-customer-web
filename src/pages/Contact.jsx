import {
    ArrowRight,
    CheckCircle2,
    Mail,
    MessageCircle,
    Phone,
    Send,
    Sparkles
} from "lucide-react";

import {
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import "../styles/contact.css";


/* ============================================================
   CONTACT CONFIGURATION
============================================================ */

const CONTACT_EMAIL =
    "aumvedawellness@gmail.com";


const CONTACT_PHONE =
    "+919000006000";


const CONTACT_PHONE_DISPLAY =
    "+91 90000 06000";


const CONTACT_HERO_IMAGE =
    "https://images.unsplash.com/photo-1492552181161-62217fc3076d?auto=format&fit=crop&w=1500&q=85";


/* ============================================================
   CONTACT PAGE
============================================================ */

function Contact() {

    const [
        formData,
        setFormData
    ] =
        useState({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: ""
        });


    const [
        submitted,
        setSubmitted
    ] =
        useState(false);


    /* ========================================================
       FORM CHANGE
    ======================================================== */

    function handleChange(event) {

        const {
            name,
            value
        } =
            event.target;


        setFormData(
            previous => ({
                ...previous,
                [name]:
                    value
            })
        );


        if (submitted) {

            setSubmitted(
                false
            );

        }

    }


    /* ========================================================
       FORM SUBMIT
    ======================================================== */

    function handleSubmit(event) {

        event.preventDefault();


        const subject =
            formData.subject ||
            "AUMVEDA Website Enquiry";


        const body = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || "Not provided"}

Message:
${formData.message}
        `.trim();


        const mailto =
            `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                subject
            )}&body=${encodeURIComponent(
                body
            )}`;


        setSubmitted(
            true
        );


        window.location.href =
            mailto;

    }


    /* ========================================================
       RENDER
    ======================================================== */

    return (

        <main
            className="aumveda-contact-page"
        >

            {/* =================================================
                HERO
            ================================================= */}

            <section
                className="aumveda-contact-hero"
            >

                <div
                    className="
                        contact-hero-glow
                        glow-one
                    "
                />


                <div
                    className="
                        contact-hero-glow
                        glow-two
                    "
                />


                <div
                    className="aumveda-contact-container"
                >

                    <div
                        className="aumveda-contact-hero-grid"
                    >

                        {/* =========================================
                            HERO COPY
                        ========================================= */}

                        <div
                            className="aumveda-contact-hero-copy"
                        >

                            <span
                                className="aumveda-contact-eyebrow"
                            >
                                LET&apos;S CONNECT
                            </span>


                            <h1>

                                Good wellness

                                <span>
                                    begins with a conversation.
                                </span>

                            </h1>


                            <p>

                                Have a question about AUMVEDA,
                                our products, partnerships or the
                                journey we are building?

                                <br />

                                We would love to hear from you.

                            </p>


                            <div
                                className="contact-hero-actions"
                            >

                                <a
                                    href="#contact-form"
                                    className="contact-primary-button"
                                >

                                    Send an Enquiry

                                    <ArrowRight
                                        size={17}
                                    />

                                </a>


                                <a
                                    href={`mailto:${CONTACT_EMAIL}`}
                                    className="contact-text-link"
                                >

                                    Email AUMVEDA

                                    <Mail
                                        size={15}
                                    />

                                </a>

                            </div>

                        </div>


                        {/* =========================================
                            HERO VISUAL
                        ========================================= */}

                        <div
                            className="aumveda-contact-hero-visual"
                        >

                            <div
                                className="
                                    contact-orbit
                                    contact-orbit-one
                                "
                            />


                            <div
                                className="
                                    contact-orbit
                                    contact-orbit-two
                                "
                            />


                            <div
                                className="
                                    contact-floating-chip
                                    chip-top
                                "
                            >

                                <Sparkles
                                    size={15}
                                />

                                Thoughtful wellness

                            </div>


                            <div
                                className="contact-letter-card"
                            >

                                <div
                                    className="letter-card-top"
                                >

                                    <div
                                        className="letter-logo-mark"
                                    >
                                        A
                                    </div>


                                    <span>

                                        AUMVEDA

                                        <small>
                                            WELLNESS
                                        </small>

                                    </span>


                                    <Mail
                                        size={19}
                                    />

                                </div>


                                <div
                                    className="letter-card-lines"
                                >

                                    <span />

                                    <span />

                                    <span
                                        className="short"
                                    />

                                </div>


                                <div
                                    className="letter-card-message"
                                >

                                    <MessageCircle
                                        size={26}
                                    />


                                    <div>

                                        <strong>
                                            We&apos;re listening.
                                        </strong>


                                        <span>
                                            Let&apos;s create a more
                                            conscious wellness journey.
                                        </span>

                                    </div>

                                </div>


                                <div
                                    className="letter-card-footer"
                                >

                                    <span>
                                        ROOTED IN NATURE
                                    </span>


                                    <span>
                                        REFINED BY AYURVEDA
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                CONTACT CHANNELS
            ================================================= */}

            <section
                className="aumveda-contact-channels"
            >

                <div
                    className="aumveda-contact-container"
                >

                    <div
                        className="contact-channel-header"
                    >

                        <span
                            className="
                                aumveda-contact-eyebrow
                                dark
                            "
                        >
                            REACH US
                        </span>


                        <h2>

                            Choose the way

                            <span>
                                that feels right.
                            </span>

                        </h2>

                    </div>


                    <div
                        className="contact-channel-grid"
                    >

                        {/* =========================================
                            EMAIL
                        ========================================= */}

                        <a
                            href={`mailto:${CONTACT_EMAIL}`}
                            className="contact-channel-card"
                            aria-label="Email AUMVEDA"
                        >

                            <div
                                className="channel-icon"
                            >

                                <Mail
                                    size={21}
                                />

                            </div>


                            <span
                                className="channel-label"
                            >
                                EMAIL
                            </span>


                            <h3>
                                {CONTACT_EMAIL}
                            </h3>


                            <p>
                                For general enquiries,
                                partnerships and support.
                            </p>


                            <ArrowRight
                                size={17}
                                className="channel-arrow"
                            />

                        </a>


                        {/* =========================================
                            CALL
                        ========================================= */}

                        <a
                            href={`tel:${CONTACT_PHONE}`}
                            className="contact-channel-card"
                            aria-label="Call AUMVEDA"
                        >

                            <div
                                className="channel-icon"
                            >

                                <Phone
                                    size={21}
                                />

                            </div>


                            <span
                                className="channel-label"
                            >
                                CALL
                            </span>


                            <h3>
                                {CONTACT_PHONE_DISPLAY}
                            </h3>


                            <p>
                                Speak directly with
                                the AUMVEDA team.
                            </p>


                            <ArrowRight
                                size={17}
                                className="channel-arrow"
                            />

                        </a>

                    </div>

                </div>

            </section>


            {/* =================================================
                FORM + IMAGE
            ================================================= */}

            <section
                id="contact-form"
                className="aumveda-contact-form-section"
            >

                <div
                    className="aumveda-contact-container"
                >

                    <div
                        className="contact-form-grid"
                    >

                        {/* =========================================
                            IMAGE SIDE
                        ========================================= */}

                        <div
                            className="contact-form-visual"
                        >

                            <img
                                src={
                                    CONTACT_HERO_IMAGE
                                }
                                alt="Natural Ayurvedic wellness"
                            />


                            <div
                                className="contact-form-visual-overlay"
                            />


                            <div
                                className="contact-form-quote"
                            >

                                <span>
                                    “
                                </span>


                                <p>
                                    Rooted in tradition,
                                    refined for modern living.
                                </p>


                                <small>
                                    AUMVEDA WELLNESS
                                </small>

                            </div>


                            <div
                                className="contact-form-mini-card"
                            >

                                <CheckCircle2
                                    size={18}
                                />


                                <div>

                                    <strong>
                                        Thoughtful support
                                    </strong>


                                    <span>
                                        Every enquiry matters.
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* =========================================
                            FORM
                        ========================================= */}

                        <div
                            className="contact-form-wrapper"
                        >

                            <span
                                className="
                                    aumveda-contact-eyebrow
                                    dark
                                "
                            >
                                SEND A MESSAGE
                            </span>


                            <h2>

                                Tell us

                                <span>
                                    what you need.
                                </span>

                            </h2>


                            <p
                                className="contact-form-intro"
                            >
                                Whether you are exploring a product,
                                looking for a partnership, or simply
                                want to know more about AUMVEDA,
                                send us a message.
                            </p>


                            <form
                                onSubmit={
                                    handleSubmit
                                }
                                className="aumveda-contact-form"
                            >

                                <div
                                    className="contact-input-row"
                                >

                                    <label>

                                        Name

                                        <input
                                            type="text"
                                            name="name"
                                            value={
                                                formData.name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Your name"
                                            autoComplete="name"
                                            required
                                        />

                                    </label>


                                    <label>

                                        Email

                                        <input
                                            type="email"
                                            name="email"
                                            value={
                                                formData.email
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="you@example.com"
                                            autoComplete="email"
                                            required
                                        />

                                    </label>

                                </div>


                                <div
                                    className="contact-input-row"
                                >

                                    <label>

                                        Phone

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={
                                                formData.phone
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="+91"
                                            autoComplete="tel"
                                        />

                                    </label>


                                    <label>

                                        Subject

                                        <input
                                            type="text"
                                            name="subject"
                                            value={
                                                formData.subject
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="How can we help?"
                                        />

                                    </label>

                                </div>


                                <label>

                                    Message

                                    <textarea
                                        name="message"
                                        value={
                                            formData.message
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Write your message here..."
                                        rows="6"
                                        required
                                    />

                                </label>


                                <div
                                    className="contact-form-bottom"
                                >

                                    <button
                                        type="submit"
                                        className="contact-submit-button"
                                    >

                                        Send Message

                                        <Send
                                            size={16}
                                        />

                                    </button>


                                    {
                                        submitted && (

                                            <span
                                                className="contact-form-success"
                                            >

                                                <CheckCircle2
                                                    size={16}
                                                />

                                                Your email app should
                                                open shortly.

                                            </span>

                                        )
                                    }

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                TEAM CONTACTS
            ================================================= */}

            <section
                className="aumveda-contact-team"
            >

                <div
                    className="aumveda-contact-container"
                >

                    <div
                        className="contact-team-header"
                    >

                        <div>

                            <span
                                className="
                                    aumveda-contact-eyebrow
                                    dark
                                "
                            >
                                DIRECT CONTACT
                            </span>


                            <h2>

                                Connect with

                                <span>
                                    our team.
                                </span>

                            </h2>

                        </div>


                        <p>
                            For a direct conversation,
                            you can also reach the
                            AUMVEDA team through the
                            contacts below.
                        </p>

                    </div>


                    <div
                        className="contact-team-grid"
                    >

                        {/* =========================================
                            SUMANNTH
                        ========================================= */}

                        <a
                            href="tel:+919000006000"
                            className="contact-person-card"
                        >

                            <div
                                className="person-avatar"
                            >
                                S
                            </div>


                            <div>

                                <span>
                                    TEAM CONTACT
                                </span>


                                <h3>
                                    Sumannth
                                </h3>


                                <p>
                                    +91 90000 06000
                                </p>

                            </div>


                            <Phone
                                size={18}
                            />

                        </a>


                        {/* =========================================
                            SRISHA
                        ========================================= */}

                        <a
                            href="tel:+919704300006"
                            className="contact-person-card"
                        >

                            <div
                                className="person-avatar"
                            >
                                S
                            </div>


                            <div>

                                <span>
                                    TEAM CONTACT
                                </span>


                                <h3>
                                    Srisha
                                </h3>


                                <p>
                                    +91 97043 00006
                                </p>

                            </div>


                            <Phone
                                size={18}
                            />

                        </a>


                        {/* =========================================
                            SRIKANTH
                        ========================================= */}

                        <a
                            href="tel:+918501042547"
                            className="contact-person-card"
                        >

                            <div
                                className="person-avatar"
                            >
                                S
                            </div>


                            <div>

                                <span>
                                    TEAM CONTACT
                                </span>


                                <h3>
                                    Srikanth
                                </h3>


                                <p>
                                    +91 85010 42547
                                </p>

                            </div>


                            <Phone
                                size={18}
                            />

                        </a>

                    </div>

                </div>

            </section>


            {/* =================================================
                FINAL CTA
            ================================================= */}

            <section
                className="aumveda-contact-final"
            >

                <div
                    className="
                        contact-final-orb
                        orb-left
                    "
                />


                <div
                    className="
                        contact-final-orb
                        orb-right
                    "
                />


                <div
                    className="contact-final-content"
                >

                    <span
                        className="aumveda-contact-eyebrow"
                    >
                        STAY CONNECTED
                    </span>


                    <h2>

                        Let&apos;s build a more

                        <span>
                            conscious future.
                        </span>

                    </h2>


                    <p>
                        Discover authentic wellness,
                        support conscious choices,
                        and become part of the
                        AUMVEDA journey.
                    </p>


                    <div
                        className="contact-final-actions"
                    >

                        <a
                            href={`mailto:${CONTACT_EMAIL}`}
                            className="contact-primary-button"
                        >

                            Talk to AUMVEDA

                            <ArrowRight
                                size={17}
                            />

                        </a>


                        <Link
                            to="/products"
                            className="contact-final-link"
                        >
                            Browse Products
                        </Link>

                    </div>

                </div>

            </section>

        </main>

    );

}


export default Contact;