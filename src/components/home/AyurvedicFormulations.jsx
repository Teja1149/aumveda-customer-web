import {
    motion,
} from "framer-motion";


import BotanicalDoodles
    from "../common/BotanicalDoodles";


import "../../styles/ayurvedic-formulations.css";


function AyurvedicFormulations() {


    const formulations = [

        {
            title:
                "Classical Formulations",

            description:
                "Inspired by traditional Ayurvedic principles passed through generations.",

            image:
                "https://ihjbssbqwknyyzoewrik.supabase.co/storage/v1/object/public/site-assets/formulations/classical-formulations.webp",
        },


        {
            title:
                "Herbal Extracts",

            description:
                "Carefully selected natural herbs crafted for everyday wellness.",

            image:
                "https://ihjbssbqwknyyzoewrik.supabase.co/storage/v1/object/public/site-assets/formulations/herbal-extracts.webp",
        },


        {
            title:
                "Daily Wellness",

            description:
                "Balanced Ayurvedic solutions designed for modern lifestyles.",

            image:
                "https://ihjbssbqwknyyzoewrik.supabase.co/storage/v1/object/public/site-assets/formulations/daily-wellness.webp",
        },

    ];


    return (

        <section
            className="ayurvedic-formulations"
            aria-labelledby="ayurvedic-formulations-title"
        >

            {/* ==================================================
                DECORATIONS
                Positioned outside normal document flow
            ================================================== */}

            <div
                className="ayurvedic-formulations__decorations"
                aria-hidden="true"
            >

                <BotanicalDoodles
                    variant="formulations"
                />

            </div>


            {/* ==================================================
                INNER
            ================================================== */}

            <div
                className="ayurvedic-formulations__inner"
            >


                {/* ==================================================
                    HEADING
                ================================================== */}

                <motion.div
                    className="ayurvedic-formulations__heading"

                    initial={{
                        opacity: 0,
                        y: 18,
                    }}

                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}

                    viewport={{
                        once: true,
                        amount: 0.25,
                    }}

                    transition={{
                        duration: 0.45,
                    }}
                >

                    <p>
                        TRADITIONAL AYURVEDIC WISDOM
                    </p>


                    <h2
                        id="ayurvedic-formulations-title"
                    >
                        Our Ayurvedic Formulations
                    </h2>

                </motion.div>


                {/* ==================================================
                    FORMULATION GRID
                ================================================== */}

                <div
                    className="ayurvedic-formulations__grid"
                >

                    {
                        formulations.map(
                            (
                                item,
                                index
                            ) => (

                                <motion.article

                                    key={
                                        item.title
                                    }

                                    className="formulation-card"

                                    initial={{
                                        opacity: 0,
                                        y: 22,
                                    }}

                                    whileInView={{
                                        opacity: 1,
                                        y: 0,
                                    }}

                                    viewport={{
                                        once: true,
                                        amount: 0.2,
                                    }}

                                    transition={{
                                        duration: 0.45,
                                        delay:
                                            index * 0.09,
                                    }}

                                    whileHover={{
                                        y: -5,
                                    }}
                                >


                                    {/* IMAGE */}

                                    <div
                                        className="formulation-card__image"
                                    >

                                        <img

                                            src={
                                                item.image
                                            }

                                            alt={
                                                item.title
                                            }

                                            loading="lazy"

                                            onError={(
                                                event
                                            ) => {

                                                event
                                                    .currentTarget
                                                    .style
                                                    .display =
                                                    "none";

                                            }}

                                        />


                                        <div
                                            className="formulation-card__overlay"
                                        >

                                            <span>
                                                Explore
                                            </span>

                                        </div>

                                    </div>


                                    {/* CONTENT */}

                                    <div
                                        className="formulation-card__content"
                                    >

                                        <h3>
                                            {
                                                item.title
                                            }
                                        </h3>


                                        <p>
                                            {
                                                item.description
                                            }
                                        </p>

                                    </div>


                                </motion.article>

                            )
                        )
                    }

                </div>

            </div>

        </section>

    );

}


export default AyurvedicFormulations;