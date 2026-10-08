import {
    motion
} from "framer-motion";


import {
    CheckCircle
} from "lucide-react";


import BotanicalDoodles from "../common/BotanicalDoodles";


import "../../styles/consultation.css";




function ConsultationSection() {



    const benefits = [

        "Certified Ayurvedic Practitioners",

        "Personalized Wellness Guidance",

        "Traditional Ayurveda Approach"

    ];






    return (



<section className="consultation-section">





<BotanicalDoodles variant="consultation"/>









<motion.div


className="consultation-section__image"



initial={{

opacity:0,

x:-50

}}



whileInView={{

opacity:1,

x:0

}}



viewport={{

once:true

}}



transition={{

duration:.7

}}



>





<img


src="https://ihjbssbqwknyyzoewrik.supabase.co/storage/v1/object/public/site-assets/consultation/consultation.webp"


alt="Ayurveda Consultation"


loading="lazy"


/>






</motion.div>













<motion.div


className="consultation-section__content"



initial={{

opacity:0,

x:50

}}



whileInView={{

opacity:1,

x:0

}}



viewport={{

once:true

}}



transition={{

duration:.7

}}



>







<p className="consultation-section__tag">

PERSONALIZED WELLNESS CARE

</p>









<h2>

Talk to Ayurveda Experts

</h2>









<p className="consultation-section__description">

Get personalized guidance from experienced
Ayurvedic practitioners and discover wellness
solutions designed according to your lifestyle.

</p>










<div className="consultation-section__benefits">



{

benefits.map(

(item,index)=>(


<div

key={index}

className="consultation-benefit"

>


<CheckCircle size={18}/>


<span>

{item}

</span>


</div>


)

)

}



</div>











<button className="consultation-section__button">


Schedule Consultation →


</button>








</motion.div>









</section>



);


}



export default ConsultationSection;