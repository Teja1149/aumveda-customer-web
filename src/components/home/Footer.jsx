import {
    FaInstagram,
    FaFacebookF,
    FaYoutube,
    FaEnvelope,
} from "react-icons/fa";

import "../../styles/footer.css";


function Footer() {

    const quickLinks = [
        "About Us",
        "Products",
        "Wellness",
        "Journals",
        "Contact",
    ];


    const supportLinks = [
        "Privacy Policy",
        "Terms & Conditions",
        "Shipping Policy",
        "Returns",
    ];


    return (

        <footer className="footer">


            {/* ==================================================
                MAIN FOOTER
            ================================================== */}

            <div className="footer__container">


                {/* ==================================================
                    BRAND
                ================================================== */}

                <div className="footer__brand">


                    <div className="footer__logo">

                        <img
                            src="https://ihjbssbqwknyyzoewrik.supabase.co/storage/v1/object/public/site-assets/branding/logo%20without%20bg.webp"
                            alt="AUMVEDA Wellness LLP"
                        />

                    </div>


                    <p className="footer__tagline">

                        Rooted in Nature
                        <br />
                        Refined by Ayurveda

                    </p>


                    <p className="footer__description">

                        Authentic Ayurvedic products
                        crafted with traditional wisdom
                        for modern wellness.

                    </p>


                </div>


                {/* ==================================================
                    QUICK LINKS
                ================================================== */}

                <div className="footer__column">

                    <h3>
                        Quick Links
                    </h3>


                    {
                        quickLinks.map(
                            (
                                item,
                                index
                            ) => (

                                <a
                                    key={index}
                                    href="#"
                                >
                                    {item}
                                </a>

                            )
                        )
                    }

                </div>


                {/* ==================================================
                    CUSTOMER SUPPORT
                ================================================== */}

                <div className="footer__column">

                    <h3>
                        Customer Support
                    </h3>


                    {
                        supportLinks.map(
                            (
                                item,
                                index
                            ) => (

                                <a
                                    key={index}
                                    href="#"
                                >
                                    {item}
                                </a>

                            )
                        )
                    }

                </div>


                {/* ==================================================
                    CONNECT
                ================================================== */}

                <div className="footer__column footer__connect">

                    <h3>
                        Connect
                    </h3>


                    <div className="footer__icons">

                        <a
                            href="#"
                            aria-label="Instagram"
                        >
                            <FaInstagram />
                        </a>


                        <a
                            href="#"
                            aria-label="Facebook"
                        >
                            <FaFacebookF />
                        </a>


                        <a
                            href="#"
                            aria-label="YouTube"
                        >
                            <FaYoutube />
                        </a>


                        <a
                            href="#"
                            aria-label="Email"
                        >
                            <FaEnvelope />
                        </a>

                    </div>


                    <p className="footer__email">
                        support@aumveda.com
                    </p>


                    {/* ==================================================
                        NEWSLETTER
                    ================================================== */}

                    <div className="footer__newsletter">

                        <p>
                            Stay connected with Ayurveda insights.
                        </p>


                        <div className="footer__subscribe">

                            <input
                                type="email"
                                placeholder="Enter your email"
                                aria-label="Email address"
                            />


                            <button type="button">
                                Subscribe
                            </button>

                        </div>

                    </div>

                </div>


            </div>


            {/* ==================================================
                COPYRIGHT
            ================================================== */}

            <div className="footer__bottom">

                <p>
                    © 2026 AUMVEDA. All Rights Reserved.
                </p>

            </div>


        </footer>

    );

}


export default Footer;