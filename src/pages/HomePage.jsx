import HeroSection
    from "../components/home/HeroSection";

import ExploreAyurveda
    from "../components/home/ExploreAyurveda";

import FeaturedProducts
    from "../components/home/FeaturedProducts";

import WhyAumveda
    from "../components/home/WhyAumveda";

import AyurvedicFormulations
    from "../components/home/AyurvedicFormulations";

import Footer
    from "../components/home/Footer";

import NatureDoodles
    from "../components/common/NatureDoodles";

import "../styles/home.css";


function HomePage() {

    return (

        <div
            className="home-wrapper"
        >

            <HeroSection />


            <div
                className="decorations-area"
                aria-hidden="true"
            >

                <NatureDoodles />

            </div>


            <main
                className="home-content"
            >

                {/* =================================================
                    EXPLORE AYURVEDA
                ================================================= */}

                <section
                    className="
                        home-section
                        home-section--explore
                    "
                >

                    <ExploreAyurveda />

                </section>


                {/* =================================================
                    FEATURED PRODUCTS
                ================================================= */}

                <section
                    className="
                        home-section
                        home-section--featured
                    "
                >

                    <FeaturedProducts />

                </section>


                {/* =================================================
                    WHY AUMVEDA
                ================================================= */}

                <section
                    className="
                        home-section
                        home-section--why
                    "
                >

                    <WhyAumveda />

                </section>


                {/* =================================================
                    FORMULATIONS
                ================================================= */}

                <section
                    className="
                        home-section
                        home-section--formulations
                    "
                >

                    <AyurvedicFormulations />

                </section>

            </main>


            <footer
                className="home-footer"
            >

                <Footer />

            </footer>

        </div>

    );

}


export default HomePage;