import { motion, useScroll, useTransform } from "framer-motion";

import { useRef } from "react";

import "../../styles/section-doodle.css";



function SectionDoodle({

    image,

    position="right",

    size=220,

    top="20%",

    left,

    right,

    bottom,

    delay=0,

    scrollSpeed=80,

}) {


    const ref = useRef(null);



    const { scrollYProgress } = useScroll({

        target: ref,

        offset:[
            "start end",
            "end start"
        ]

    });



    const yScroll = useTransform(

        scrollYProgress,

        [0,1],

        [
            scrollSpeed,
            -scrollSpeed
        ]

    );



    const opacity = useTransform(

        scrollYProgress,

        [0,0.2,0.8,1],

        [
            0.2,
            0.55,
            0.55,
            0.2
        ]

    );





    return (

        <motion.img


            ref={ref}


            src={image}


            alt="Ayurveda botanical decoration"



            className={`section-doodle section-doodle--${position}`}



            style={{

                width:`${size}px`,

                top,

                left,

                right,

                bottom,

                y:yScroll,

                opacity

            }}





            animate={{


                x:[
                    0,
                    25,
                    -20,
                    0
                ],


                rotate:[
                    -4,
                    5,
                    -3,
                    0
                ]


            }}




            transition={{


                duration:18,


                delay,


                repeat:Infinity,


                ease:"easeInOut"



            }}



        />


    );

}


export default SectionDoodle;