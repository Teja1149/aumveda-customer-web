import { motion } from "framer-motion";

import "../../styles/botanical-doodles.css";


const doodles = [

{
id:1,
image:
"https://ihjbssbqwknyyzoewrik.supabase.co/storage/v1/object/public/site-assets/decorations/leaf-branch-1.webp",
top:"8%",
left:"5%",
size:90,
duration:9
},

{
id:2,
image:
"https://ihjbssbqwknyyzoewrik.supabase.co/storage/v1/object/public/site-assets/decorations/herbal-branch-1.webp",
top:"30%",
right:"4%",
size:120,
duration:12
},


{
id:3,
image:
"https://ihjbssbqwknyyzoewrik.supabase.co/storage/v1/object/public/site-assets/decorations/leaf-branch-1.webp",
bottom:"10%",
left:"8%",
size:100,
duration:10
},


{
id:4,
image:
"https://ihjbssbqwknyyzoewrik.supabase.co/storage/v1/object/public/site-assets/decorations/lotus-branch-1.webp",
bottom:"15%",
right:"6%",
size:110,
duration:14
}

];



function BotanicalDoodles(){


return (

<div className="botanical-doodles">


{
doodles.map(item=>(


<motion.img

key={item.id}

src={item.image}

className="botanical-doodle"


style={{

top:item.top,

left:item.left,

right:item.right,

bottom:item.bottom,

width:item.size

}}


animate={{

y:[0,-15,0],

rotate:[0,5,-5,0]

}}


transition={{

duration:item.duration,

repeat:Infinity,

ease:"easeInOut"

}}


/>


))

}


</div>

);


}


export default BotanicalDoodles;