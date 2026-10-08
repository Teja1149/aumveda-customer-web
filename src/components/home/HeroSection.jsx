import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    motion,
    useScroll,
    useTransform
} from "framer-motion";

import {
    ArrowRight,
    CheckCircle2,
    Leaf,
    ShieldCheck,
    Sparkles,
    Volume2,
    VolumeX
} from "lucide-react";

import {
    useNavigate
} from "react-router-dom";

import {
    fadeUp,
    fadeLeft
} from "../../animations/motion";

import {
    getHomeHero
} from "../../services/homeService";

import "../../styles/hero.css";


/* ============================================================
   HERO VISUAL CONTROLS
============================================================ */

/*
    VIDEO_INTENSITY

    Controls how strongly the background video is visible.

    Recommended values:

    0.40 = very soft
    0.60 = soft
    0.75 = balanced
    0.90 = strong
    1.00 = full video

    Change only this number whenever required.
*/

const VIDEO_INTENSITY =
    0.92;


/*
    LEFT_OVERLAY_STRENGTH

    Controls how much cream/light overlay exists
    behind the hero text.

    Higher value = lighter background / less video
    Lower value = more visible video

    Recommended:

    0.80 = very light background
    0.70 = balanced
    0.60 = stronger video
    0.50 = very visible video
*/

const LEFT_OVERLAY_STRENGTH =
    0.68;


/* ============================================================
   DEFAULT HERO
============================================================ */

const DEFAULT_HERO = {

    eyebrow:
        "ANCIENT WISDOM FOR MODERN WELLNESS",

    title_line1:
        "Rooted in Nature",

    title_line2:
        "Refined by Ayurveda",

    description:
        "Discover thoughtfully crafted Ayurvedic wellness essentials inspired by time-honoured traditions and made for modern everyday living.",

    image_url:
        "https://ihjbssbqwknyyzoewrik.supabase.co/storage/v1/object/public/site-assets/hero/home/hero.webp",

    video_url:
        "",

    primary_cta_text:
        "Explore Products",

    primary_cta_path:
        "/products"

};


function HeroSection() {

    const navigate =
        useNavigate();


    /* ========================================================
       HERO DATA
    ======================================================== */

    const [
        hero,
        setHero
    ] = useState(
        DEFAULT_HERO
    );


    /* ========================================================
       VIDEO STATES
    ======================================================== */

    const [
        videoLoaded,
        setVideoLoaded
    ] = useState(false);


    const [
        videoError,
        setVideoError
    ] = useState(false);


    const [
        muted,
        setMuted
    ] = useState(true);


    const videoRef =
        useRef(null);


    /* ========================================================
       SCROLL ANIMATION
    ======================================================== */

    const {
        scrollY
    } = useScroll();


    const mediaScale =
        useTransform(
            scrollY,
            [
                0,
                700
            ],
            [
                1,
                1.045
            ]
        );


    const contentY =
        useTransform(
            scrollY,
            [
                0,
                650
            ],
            [
                0,
                28
            ]
        );


    const contentOpacity =
        useTransform(
            scrollY,
            [
                0,
                650
            ],
            [
                1,
                0.84
            ]
        );


    /* ========================================================
       LOAD HERO FROM API
    ======================================================== */

    useEffect(() => {

        let mounted =
            true;


        async function loadHero() {

            try {

                const data =
                    await getHomeHero();


                if (
                    !mounted ||
                    !data
                ) {

                    return;

                }


                setHero(
                    previous => ({
                        ...previous,
                        ...data
                    })
                );

            }
            catch (error) {

                console.error(
                    "Hero API failed:",
                    error
                );

            }

        }


        loadHero();


        return () => {

            mounted =
                false;

        };

    }, []);


    /* ========================================================
       AUDIO CONTROL
    ======================================================== */

    async function toggleAudio() {

        const video =
            videoRef.current;


        if (!video) {

            return;

        }


        try {

            if (
                video.muted
            ) {

                video.muted =
                    false;


                await video.play();


                setMuted(
                    false
                );

            }
            else {

                video.muted =
                    true;


                setMuted(
                    true
                );

            }

        }
        catch (error) {

            console.error(
                "Audio toggle failed:",
                error
            );

        }

    }


    /* ========================================================
       PRIMARY CTA
    ======================================================== */

    function handlePrimaryCTA() {

        const path =
            hero.primary_cta_path ||
            "/products";


        if (
            path.startsWith(
                "/"
            )
        ) {

            navigate(
                path
            );

        }
        else {

            window.location.href =
                path;

        }

    }


    /* ========================================================
       SECONDARY CTA
    ======================================================== */

    function handleStoryCTA() {

        navigate(
            "/about"
        );

    }


    /* ========================================================
       RENDER
    ======================================================== */

    return (

        <section

            className="hero"

            style={{

                "--hero-video-opacity":
                    VIDEO_INTENSITY,

                "--hero-left-overlay":
                    LEFT_OVERLAY_STRENGTH

            }}

        >

            {/* =================================================
                BACKGROUND MEDIA
            ================================================= */}

            <motion.div

                className="
                    hero__media
                "

                style={{

                    scale:
                        mediaScale,

                    backgroundImage:
                        `url(${hero.image_url})`

                }}

            >

                {
                    hero.video_url &&
                    !videoError && (

                        <video

                            ref={
                                videoRef
                            }

                            className={

                                videoLoaded

                                    ? "hero-video hero-video--visible"

                                    : "hero-video"

                            }

                            autoPlay

                            loop

                            playsInline

                            preload="auto"

                            muted

                            onCanPlay={() =>
                                setVideoLoaded(
                                    true
                                )
                            }

                            onError={() =>
                                setVideoError(
                                    true
                                )
                            }

                        >

                            <source

                                src={
                                    hero.video_url
                                }

                                type="
                                    video/mp4
                                "

                            />

                        </video>

                    )
                }

            </motion.div>


            {/* =================================================
                VIDEO OVERLAY
            ================================================= */}

            <div
                className="
                    hero__veil
                "
            />


            {/* =================================================
                VERY SUBTLE TEXTURE
            ================================================= */}

            <div
                className="
                    hero__grain
                "
            />


            {/* =================================================
                DECORATIVE AMBIENT LIGHT
            ================================================= */}

            <div
                className="
                    hero__ambient
                    hero__ambient--one
                "
            />


            <div
                className="
                    hero__ambient
                    hero__ambient--two
                "
            />


            {/* =================================================
                MAIN HERO
            ================================================= */}

            <div
                className="
                    hero__inner
                "
            >

                {/* =================================================
                    HERO CONTENT
                ================================================= */}

                <motion.div

                    className="
                        hero__content
                    "

                    style={{

                        opacity:
                            contentOpacity,

                        y:
                            contentY

                    }}

                    variants={
                        fadeLeft
                    }

                    initial="
                        hidden
                    "

                    animate="
                        visible
                    "

                >

                    {/* EYEBROW */}

                    <motion.div

                        className="
                            hero__eyebrow
                        "

                        variants={
                            fadeUp
                        }

                    >

                        <span
                            className="
                                hero__eyebrow-line
                            "
                        />


                        <span>

                            {
                                hero.eyebrow
                            }

                        </span>

                    </motion.div>


                    {/* MAIN TITLE */}

                    <motion.h1

                        variants={
                            fadeUp
                        }

                    >

                        {
                            hero.title_line1
                        }


                        <span>

                            {
                                hero.title_line2
                            }

                        </span>

                    </motion.h1>


                    {/* DESCRIPTION */}

                    <motion.p

                        className="
                            hero__description
                        "

                        variants={
                            fadeUp
                        }

                    >

                        {
                            hero.description
                        }

                    </motion.p>


                    {/* =================================================
                        CTA BUTTONS
                    ================================================= */}

                    <motion.div

                        className="
                            hero__buttons
                        "

                        variants={
                            fadeUp
                        }

                    >

                        <button

                            className="
                                hero__primary
                            "

                            type="
                                button
                            "

                            onClick={
                                handlePrimaryCTA
                            }

                        >

                            <span>

                                {
                                    hero.primary_cta_text
                                }

                            </span>


                            <ArrowRight
                                size={17}
                            />

                        </button>


                        <button

                            className="
                                hero__secondary
                            "

                            type="
                                button
                            "

                            onClick={
                                handleStoryCTA
                            }

                        >

                            <span>

                                Our Story

                            </span>


                            <span
                                className="
                                    hero__secondary-arrow
                                "
                            >

                                ↗

                            </span>

                        </button>

                    </motion.div>


                    {/* =================================================
                        ASSURANCE
                    ================================================= */}

                    <motion.div

                        className="
                            hero__assurance
                        "

                        variants={
                            fadeUp
                        }

                    >

                        <span>

                            <CheckCircle2
                                size={14}
                            />

                            Thoughtfully sourced

                        </span>


                        <span>

                            <CheckCircle2
                                size={14}
                            />

                            Ayurveda inspired

                        </span>

                    </motion.div>

                </motion.div>


                {/* =================================================
                    PHILOSOPHY CARD
                ================================================= */}

                <motion.aside

                    className="
                        hero__signature
                    "

                    initial={{
                        opacity:
                            0,

                        x:
                            22
                    }}

                    animate={{
                        opacity:
                            1,

                        x:
                            0
                    }}

                    transition={{
                        duration:
                            0.75,

                        delay:
                            0.25
                    }}

                >

                    <span
                        className="
                            hero__signature-label
                        "
                    >

                        AUMVEDA PHILOSOPHY

                    </span>


                    <p>

                        Wellness should feel natural,
                        considered and beautifully simple.

                    </p>


                    <span
                        className="
                            hero__signature-mark
                        "
                    >

                        <Leaf
                            size={17}
                        />

                        Ancient wisdom • Modern ritual

                    </span>

                </motion.aside>

            </div>


            {/* =================================================
                TRUST STRIP
            ================================================= */}

            <motion.div

                className="
                    hero__trust
                "

                variants={
                    fadeUp
                }

                initial="
                    hidden
                "

                animate="
                    visible
                "

            >

                <div
                    className="
                        hero-trust-card
                    "
                >

                    <span
                        className="
                            hero-trust-card__icon
                        "
                    >

                        <Leaf
                            size={18}
                        />

                    </span>


                    <div>

                        <strong>

                            Nature First

                        </strong>


                        <small>

                            Botanical wellness

                        </small>

                    </div>

                </div>


                <div
                    className="
                        hero-trust-card
                    "
                >

                    <span
                        className="
                            hero-trust-card__icon
                        "
                    >

                        <ShieldCheck
                            size={18}
                        />

                    </span>


                    <div>

                        <strong>

                            Trusted Quality

                        </strong>


                        <small>

                            Carefully considered

                        </small>

                    </div>

                </div>


                <div
                    className="
                        hero-trust-card
                    "
                >

                    <span
                        className="
                            hero-trust-card__icon
                        "
                    >

                        <Sparkles
                            size={18}
                        />

                    </span>


                    <div>

                        <strong>

                            Modern Rituals

                        </strong>


                        <small>

                            Made for everyday life

                        </small>

                    </div>

                </div>

            </motion.div>


            {/* =================================================
                VIDEO AUDIO CONTROL
            ================================================= */}

            {
                hero.video_url &&
                !videoError && (

                    <button

                        type="
                            button
                        "

                        className="
                            hero-audio-toggle
                        "

                        onClick={
                            toggleAudio
                        }

                        aria-label={

                            muted

                                ? "Unmute video"

                                : "Mute video"

                        }

                    >

                        {
                            muted

                                ? (
                                    <VolumeX
                                        size={15}
                                    />
                                )

                                : (
                                    <Volume2
                                        size={15}
                                    />
                                )
                        }

                    </button>

                )
            }

        </section>

    );

}


export default HeroSection;