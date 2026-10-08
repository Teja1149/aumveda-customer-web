import {
    motion
} from "framer-motion";

import "../../styles/nature-doodles.css";


const doodles = [

    {
        id: 1,

        image:
            "https://ihjbssbqwknyyzoewrik.supabase.co/storage/v1/object/public/site-assets/decorations/leaf-branch-1.webp",

        className:
            "nature-doodle nature-doodle--one",

        duration:
            12
    },

    {
        id: 2,

        image:
            "https://ihjbssbqwknyyzoewrik.supabase.co/storage/v1/object/public/site-assets/decorations/herbal-branch-1.webp",

        className:
            "nature-doodle nature-doodle--two",

        duration:
            15
    },

    {
        id: 3,

        image:
            "https://ihjbssbqwknyyzoewrik.supabase.co/storage/v1/object/public/site-assets/decorations/lotus-branch-1.webp",

        className:
            "nature-doodle nature-doodle--three",

        duration:
            14
    },

    {
        id: 4,

        image:
            "https://ihjbssbqwknyyzoewrik.supabase.co/storage/v1/object/public/site-assets/decorations/herbal-branch-1.webp",

        className:
            "nature-doodle nature-doodle--four",

        duration:
            18
    }

];


function NatureDoodles() {

    return (

        <div
            className="nature-doodles"
            aria-hidden="true"
        >

            {
                doodles.map(
                    item => (

                        <motion.img

                            key={
                                item.id
                            }

                            src={
                                item.image
                            }

                            alt=""

                            className={
                                item.className
                            }

                            animate={{

                                rotate: [
                                    -3,
                                    3,
                                    -3
                                ],

                                y: [
                                    0,
                                    -8,
                                    0
                                ],

                                x: [
                                    0,
                                    5,
                                    -4,
                                    0
                                ],

                                scale: [
                                    1,
                                    1.015,
                                    1
                                ]

                            }}

                            transition={{

                                duration:
                                    item.duration,

                                repeat:
                                    Infinity,

                                ease:
                                    "easeInOut"

                            }}

                        />

                    )
                )
            }

        </div>

    );

}


export default NatureDoodles;