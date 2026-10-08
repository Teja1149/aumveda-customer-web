import {
    motion
} from "framer-motion";


import BotanicalDoodles from "../common/BotanicalDoodles";


import "../../styles/journals.css";




function JournalsSection() {



    const journals = [


        {
            title:
            "Ayurveda Basics",

            description:
            "Explore the foundations of Ayurveda and understand natural wellness principles.",

            image:
            "https://ihjbssbqwknyyzoewrik.supabase.co/storage/v1/object/public/site-assets/journals/Ayurveda%20Basics.webp"
        },


        {
            title:
            "Healthy Lifestyle",

            description:
            "Discover simple Ayurvedic habits for a balanced and healthier lifestyle.",

            image:
            "https://ihjbssbqwknyyzoewrik.supabase.co/storage/v1/object/public/site-assets/journals/Healthy%20Lifestyle.webp"
        },


        {
            title:
            "Skin & Hair Care",

            description:
            "Learn natural approaches for maintaining healthy skin and beautiful hair.",

            image:
            "https://ihjbssbqwknyyzoewrik.supabase.co/storage/v1/object/public/site-assets/journals/Skin%20%26%20Hair%20Care.webp"
        },


        {
            title:
            "Nutrition",

            description:
            "Understand mindful nutrition practices inspired by Ayurvedic wisdom.",

            image:
            "https://ihjbssbqwknyyzoewrik.supabase.co/storage/v1/object/public/site-assets/journals/Nutrition.webp"
        },


        {
            title:
            "Mind Wellness",

            description:
            "Explore Ayurveda-inspired practices for mental peace and inner balance.",

            image:
            "https://ihjbssbqwknyyzoewrik.supabase.co/storage/v1/object/public/site-assets/journals/Mind%20Wellness.webp"
        }


    ];







    return (


        <section className="journals-section">



            <BotanicalDoodles variant="journals" />






            <div className="journals-section__heading">


                <p>
                    AYURVEDA INSIGHTS
                </p>


                <h2>
                    Wellness Journals
                </h2>


                <span>
                    Knowledge for a healthier and balanced life
                </span>


            </div>









            <div className="journals-section__grid">



                {
                    journals.map(
                        (item,index)=>(


                            <motion.article


                                key={index}


                                className="journal-card"



                                initial={{
                                    opacity:0,
                                    y:40
                                }}



                                whileInView={{
                                    opacity:1,
                                    y:0
                                }}



                                viewport={{
                                    once:true
                                }}



                                transition={{
                                    duration:0.5,
                                    delay:index * 0.1
                                }}



                            >




                                <div className="journal-card__image">


                                    <img

                                        src={item.image}

                                        alt={item.title}

                                        loading="lazy"

                                    />


                                </div>







                                <div className="journal-card__content">


                                    <h3>
                                        {item.title}
                                    </h3>



                                    <p>
                                        {item.description}
                                    </p>




                                    <button>

                                        Read More →

                                    </button>



                                </div>





                            </motion.article>


                        )
                    )
                }



            </div>





        </section>


    );

}



export default JournalsSection;