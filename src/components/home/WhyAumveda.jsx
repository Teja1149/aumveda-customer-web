import {
    Leaf,
    Sprout,
    ShieldCheck,
    Globe,
} from "lucide-react";

import {
    motion,
} from "framer-motion";

import BotanicalDoodles
    from "../common/BotanicalDoodles";

import "../../styles/why-aumveda.css";


function WhyAumveda() {


    const features = [

        {
            icon: Leaf,

            title:
                "Natural Ingredients",

            description:
                "Carefully selected herbs and natural ingredients.",
        },


        {
            icon: Sprout,

            title:
                "Ayurvedic Knowledge",

            description:
                "Inspired by traditional Ayurvedic wisdom.",
        },


        {
            icon: ShieldCheck,

            title:
                "Trusted Wellness",

            description:
                "Quality products designed for everyday wellness.",
        },


        {
            icon: Globe,

            title:
                "Sustainable & Eco-friendly",

            description:
                "Responsible choices for a healthier planet.",
        },

    ];


    return (

        <section
            className="why-aumveda"
            aria-labelledby="why-aumveda-title"
        >

            {/* ==================================================
                DECORATION
                Kept outside normal layout flow
            ================================================== */}

            <div
                className="why-aumveda__decorations"
                aria-hidden="true"
            >

                <BotanicalDoodles
                    variant="why"
                />

            </div>


            {/* ==================================================
                CONTENT
            ================================================== */}

            <div
                className="why-aumveda__inner"
            >


                {/* ==================================================
                    HEADER
                ================================================== */}

                <motion.div
                    className="why-aumveda__header"

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

                    <p className="why-aumveda__eyebrow">
                        OUR VALUES
                    </p>


                    <h2
                        id="why-aumveda-title"
                    >
                        Why AUMVEDA?
                    </h2>


                    <span>
                        Pure. Natural. Trustworthy.
                    </span>

                </motion.div>


                {/* ==================================================
                    FEATURE GRID
                ================================================== */}

                <div
                    className="why-aumveda__grid"
                >

                    {
                        features.map(
                            (
                                item,
                                index
                            ) => {

                                const Icon =
                                    item.icon;


                                return (

                                    <motion.article

                                        key={
                                            item.title
                                        }

                                        className="why-aumveda__card"

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
                                            duration: 0.42,
                                            delay:
                                                index * 0.08,
                                        }}

                                        whileHover={{
                                            y: -5,
                                        }}

                                    >

                                        {/* ICON */}

                                        <div
                                            className="why-aumveda__icon"
                                        >

                                            <Icon
                                                size={22}
                                                strokeWidth={1.7}
                                            />

                                        </div>


                                        {/* TITLE */}

                                        <h3>
                                            {item.title}
                                        </h3>


                                        {/* DESCRIPTION */}

                                        <p>
                                            {
                                                item.description
                                            }
                                        </p>

                                    </motion.article>

                                );

                            }
                        )
                    }

                </div>

            </div>

        </section>

    );

}


export default WhyAumveda;