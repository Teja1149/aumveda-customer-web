import {
    ArrowRight,
    Check,
    Globe2,
    HandHeart,
    Leaf,
    ShieldCheck,
    Sparkles,
    Sprout,
    Users,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import "../styles/about.css";


const ABOUT_HERO_IMAGE =
    "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1600&q=85";


const ABOUT_STORY_IMAGE =
    "https://images.unsplash.com/photo-1515586000433-45406d8e6662?auto=format&fit=crop&w=1200&q=85";


const ABOUT_WELLNESS_IMAGE =
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85";


const ABOUT_HERBS_IMAGE =
    "https://images.unsplash.com/photo-1515586000433-45406d8e6662?auto=format&fit=crop&w=1200&q=85";


function About() {

    return (

        <main className="aumveda-about-page">

            {/* =====================================================
                HERO
            ===================================================== */}

            <section className="aumveda-about-hero">

                <div className="aumveda-about-hero__background-orb" />

                <div className="aumveda-about-hero__grain" />

                <div className="aumveda-about-hero__content">

                    <div className="aumveda-about-hero__copy">

                        <span className="aumveda-about-eyebrow">

                            OUR STORY

                        </span>


                        <h1>

                            Rooted in nature.

                            <span>
                                Guided by Ayurveda.
                            </span>

                        </h1>


                        <p>

                            AUMVEDA Wellness brings authentic Ayurvedic
                            and natural products closer to everyday life —
                            thoughtfully sourced, transparently presented,
                            and designed for conscious living.

                        </p>


                        <div className="aumveda-about-hero__actions">

                            <Link
                                to="/products"
                                className="aumveda-about-primary-button"
                            >

                                Explore Wellness

                                <ArrowRight
                                    size={17}
                                />

                            </Link>


                            <a
                                href="#our-story"
                                className="aumveda-about-secondary-button"
                            >

                                Discover Our Story

                            </a>

                        </div>

                    </div>


                    {/* =================================================
                        3D VISUAL
                    ================================================= */}

                    <div className="aumveda-about-hero__visual">

                        <div className="aumveda-about-hero__halo halo-one" />

                        <div className="aumveda-about-hero__halo halo-two" />


                        <div className="aumveda-about-floating-card card-top">

                            <Leaf
                                size={17}
                            />

                            <div>

                                <strong>
                                    Nature First
                                </strong>

                                <span>
                                    Conscious choices
                                </span>

                            </div>

                        </div>


                        <div className="aumveda-about-image-frame">

                            <img
                                src={ABOUT_HERO_IMAGE}
                                alt="Natural botanical wellness"
                            />

                            <div className="aumveda-about-image-overlay" />

                            <div className="aumveda-about-image-label">

                                <span>
                                    AUMVEDA
                                </span>

                                <small>
                                    Rooted in tradition
                                </small>

                            </div>

                        </div>


                        <div className="aumveda-about-floating-card card-bottom">

                            <Sprout
                                size={18}
                            />

                            <div>

                                <strong>
                                    Ayurvedic Wisdom
                                </strong>

                                <span>
                                    Refined for modern living
                                </span>

                            </div>

                        </div>


                        <div className="aumveda-about-orbit orbit-one" />

                        <div className="aumveda-about-orbit orbit-two" />

                        <div className="aumveda-about-orbit-dot dot-one" />

                        <div className="aumveda-about-orbit-dot dot-two" />

                    </div>

                </div>


                <div className="aumveda-about-hero__bottom">

                    <div>

                        <span>
                            PURE
                        </span>

                        <small>
                            Carefully selected
                        </small>

                    </div>


                    <div>

                        <span>
                            TRUSTED
                        </span>

                        <small>
                            Transparent sourcing
                        </small>

                    </div>


                    <div>

                        <span>
                            SUSTAINABLE
                        </span>

                        <small>
                            Conscious living
                        </small>

                    </div>

                </div>

            </section>


            {/* =====================================================
                INTRO
            ===================================================== */}

            <section
                id="our-story"
                className="aumveda-about-story"
            >

                <div className="aumveda-about-container">

                    <div className="aumveda-about-section-heading">

                        <span className="aumveda-about-eyebrow">
                            WHY AUMVEDA
                        </span>

                        <h2>

                            Making natural wellness
                            <span>
                                easier to trust.
                            </span>

                        </h2>

                        <p>

                            AUMVEDA was created with a simple belief:
                            natural wellness should feel clear, honest
                            and accessible.

                        </p>

                    </div>


                    <div className="aumveda-about-story-grid">

                        <div className="aumveda-about-story-image">

                            <img
                                src={ABOUT_STORY_IMAGE}
                                alt="Botanical ingredients"
                            />

                            <div className="aumveda-about-story-badge">

                                <Leaf
                                    size={19}
                                />

                                <span>

                                    Nature Led

                                </span>

                            </div>

                        </div>


                        <div className="aumveda-about-story-content">

                            <span className="aumveda-about-small-label">
                                OUR BEGINNING
                            </span>

                            <h3>
                                Tradition deserves a place
                                in modern life.
                            </h3>


                            <p>

                                AUMVEDA Wellness was founded to make
                                authentic, natural wellness more accessible
                                in today's world.

                            </p>


                            <p>

                                In a space filled with uncertainty,
                                AUMVEDA brings clarity through carefully
                                selected Ayurvedic, organic and natural
                                products.

                            </p>


                            <p>

                                By working closely with traditional
                                producers, farmers and artisans, the
                                platform aims to preserve valuable
                                knowledge while making it easier for
                                modern consumers to discover.

                            </p>


                            <div className="aumveda-about-story-points">

                                <div>

                                    <div className="story-point-icon">

                                        <Check
                                            size={15}
                                        />

                                    </div>

                                    <div>

                                        <strong>
                                            Authentic sourcing
                                        </strong>

                                        <span>
                                            Direct relationships with
                                            trusted producers.
                                        </span>

                                    </div>

                                </div>


                                <div>

                                    <div className="story-point-icon">

                                        <Check
                                            size={15}
                                        />

                                    </div>

                                    <div>

                                        <strong>
                                            Conscious living
                                        </strong>

                                        <span>
                                            Products selected for
                                            mindful lifestyles.
                                        </span>

                                    </div>

                                </div>


                                <div>

                                    <div className="story-point-icon">

                                        <Check
                                            size={15}
                                        />

                                    </div>

                                    <div>

                                        <strong>
                                            Transparent choices
                                        </strong>

                                        <span>
                                            Clear information for
                                            better decisions.
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                VALUES
            ===================================================== */}

            <section className="aumveda-about-values">

                <div className="aumveda-about-container">

                    <div className="aumveda-about-section-heading centered">

                        <span className="aumveda-about-eyebrow">
                            OUR PRINCIPLES
                        </span>

                        <h2>

                            Three ideas behind
                            <span>
                                every choice.
                            </span>

                        </h2>

                    </div>


                    <div className="aumveda-about-values-grid">

                        <article className="aumveda-about-value-card">

                            <div className="value-number">
                                01
                            </div>

                            <div className="value-icon">

                                <Leaf
                                    size={25}
                                />

                            </div>

                            <h3>
                                Authentic Sourcing
                            </h3>

                            <p>

                                Working with trusted producers and
                                traditional artisans to preserve the
                                authenticity behind natural wellness.

                            </p>

                            <span className="value-line" />

                        </article>


                        <article className="aumveda-about-value-card featured">

                            <div className="value-number">
                                02
                            </div>

                            <div className="value-icon">

                                <ShieldCheck
                                    size={25}
                                />

                            </div>

                            <h3>
                                Transparency & Trust
                            </h3>

                            <p>

                                Clear product information and thoughtful
                                selection help people make informed
                                wellness choices.

                            </p>

                            <span className="value-line" />

                        </article>


                        <article className="aumveda-about-value-card">

                            <div className="value-number">
                                03
                            </div>

                            <div className="value-icon">

                                <HandHeart
                                    size={25}
                                />

                            </div>

                            <h3>
                                Empowering Producers
                            </h3>

                            <p>

                                Creating digital opportunities for
                                skilled creators, farmers and traditional
                                producers.

                            </p>

                            <span className="value-line" />

                        </article>

                    </div>

                </div>

            </section>


            {/* =====================================================
                MISSION / VISION
            ===================================================== */}

            <section className="aumveda-about-purpose">

                <div className="aumveda-about-container">

                    <div className="aumveda-about-purpose-grid">

                        <div className="aumveda-about-purpose-visual">

                            <img
                                src={ABOUT_WELLNESS_IMAGE}
                                alt="Wellness and mindful living"
                            />

                            <div className="purpose-floating-card">

                                <Sparkles
                                    size={18}
                                />

                                <span>
                                    Built on trust,
                                    transparency & tradition
                                </span>

                            </div>

                        </div>


                        <div className="aumveda-about-purpose-content">

                            <span className="aumveda-about-eyebrow">
                                OUR PURPOSE
                            </span>

                            <h2>

                                Wellness that
                                <span>
                                    reaches beyond products.
                                </span>

                            </h2>


                            <div className="purpose-block">

                                <div className="purpose-icon">

                                    <Sprout
                                        size={20}
                                    />

                                </div>

                                <div>

                                    <span>
                                        OUR MISSION
                                    </span>

                                    <h3>
                                        Make authentic natural
                                        wellness accessible.
                                    </h3>

                                    <p>

                                        AUMVEDA aims to simplify conscious
                                        living through carefully curated
                                        organic, herbal and eco-friendly
                                        products delivered through a
                                        seamless digital experience.

                                    </p>

                                </div>

                            </div>


                            <div className="purpose-block">

                                <div className="purpose-icon">

                                    <Globe2
                                        size={20}
                                    />

                                </div>

                                <div>

                                    <span>
                                        OUR VISION
                                    </span>

                                    <h3>
                                        Build a global ecosystem
                                        for natural living.
                                    </h3>

                                    <p>

                                        The long-term vision is a world
                                        where sustainable choices become
                                        effortless and traditional
                                        producers gain meaningful digital
                                        access and fair opportunities.

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                IMPACT
            ===================================================== */}

            <section className="aumveda-about-impact">

                <div className="aumveda-about-impact-glow" />

                <div className="aumveda-about-container">

                    <div className="aumveda-about-impact-header">

                        <div>

                            <span className="aumveda-about-eyebrow light">
                                OUR IMPACT
                            </span>

                            <h2>

                                Creating impact
                                <span>
                                    beyond products.
                                </span>

                            </h2>

                        </div>


                        <p>

                            Every wellness choice can contribute to
                            something larger — communities, sustainable
                            practices and a more conscious way of living.

                        </p>

                    </div>


                    <div className="aumveda-about-impact-grid">

                        <div className="impact-item">

                            <div className="impact-icon">

                                <Users
                                    size={23}
                                />

                            </div>

                            <strong>
                                Rural Communities
                            </strong>

                            <span>
                                Supporting small producers and local
                                livelihoods.
                            </span>

                        </div>


                        <div className="impact-item">

                            <div className="impact-icon">

                                <Leaf
                                    size={23}
                                />

                            </div>

                            <strong>
                                Sustainable Production
                            </strong>

                            <span>
                                Encouraging responsible and ethical
                                production.
                            </span>

                        </div>


                        <div className="impact-item">

                            <div className="impact-icon">

                                <Sparkles
                                    size={23}
                                />

                            </div>

                            <strong>
                                Natural Awareness
                            </strong>

                            <span>
                                Making conscious living easier to
                                understand.
                            </span>

                        </div>


                        <div className="impact-item">

                            <div className="impact-icon">

                                <Globe2
                                    size={23}
                                />

                            </div>

                            <strong>
                                Connected Ecosystem
                            </strong>

                            <span>
                                Bringing consumers and producers
                                closer together.
                            </span>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                FUTURE
            ===================================================== */}

            <section className="aumveda-about-future">

                <div className="aumveda-about-container">

                    <div className="aumveda-about-section-heading centered">

                        <span className="aumveda-about-eyebrow">
                            LOOKING AHEAD
                        </span>

                        <h2>

                            Growing a more conscious
                            <span>
                                wellness ecosystem.
                            </span>

                        </h2>

                        <p>

                            AUMVEDA's journey continues beyond today's
                            marketplace.

                        </p>

                    </div>


                    <div className="aumveda-about-future-grid">

                        <article>

                            <span>
                                01
                            </span>

                            <h3>
                                Expanding Horizons
                            </h3>

                            <p>
                                Bringing more natural products and trusted
                                partners into the ecosystem.
                            </p>

                        </article>


                        <article>

                            <span>
                                02
                            </span>

                            <h3>
                                Personalized Wellness
                            </h3>

                            <p>
                                Moving towards wellness recommendations
                                designed around individual lifestyles.
                            </p>

                        </article>


                        <article>

                            <span>
                                03
                            </span>

                            <h3>
                                Global Vision
                            </h3>

                            <p>
                                Taking authentic Indian Ayurveda and
                                natural wellness to audiences around
                                the world.
                            </p>

                        </article>


                        <article>

                            <span>
                                04
                            </span>

                            <h3>
                                Conscious Ecosystem
                            </h3>

                            <p>
                                Building a connected platform that
                                supports mindful and sustainable living.
                            </p>

                        </article>

                    </div>

                </div>

            </section>


            {/* =====================================================
                FINAL CTA
            ===================================================== */}

            <section className="aumveda-about-cta">

                <div className="aumveda-about-cta__leaf leaf-a">
                    <Leaf size={45} />
                </div>

                <div className="aumveda-about-cta__leaf leaf-b">
                    <Sprout size={34} />
                </div>


                <div className="aumveda-about-cta__content">

                    <span className="aumveda-about-eyebrow">
                        THE AUMVEDA JOURNEY
                    </span>

                    <h2>

                        Reconnect with
                        <span>
                            nature's wisdom.
                        </span>

                    </h2>

                    <p>

                        Discover a more thoughtful way to bring
                        Ayurveda and natural living into everyday life.

                    </p>


                    <Link
                        to="/products"
                        className="aumveda-about-primary-button"
                    >

                        Explore AUMVEDA

                        <ArrowRight
                            size={17}
                        />

                    </Link>

                </div>

            </section>

        </main>

    );

}


export default About;