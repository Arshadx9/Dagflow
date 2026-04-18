import Navbar from "@/components/Navbar";
import Link from "next/link";


export default function Home() {
  return (
    <div className=" bg-zinc-50 h-screen min-w-screen">
     
<div>
<Navbar/>
</div>

<div className="flex flex-col justify-center items-start font-helvetica text-black text-7xl mt-32 mb p-4"  >
  <h1 className="tracking-tighter" >
    Most apps lose tasks.
  </h1>

<div className="text-3xl font-helvetica mt-4 tracking-tighter text-mist-700 " >
  A failed API call, a server restart, a network glitch and suddenly <br /> your user is stuck.

</div>


  <span className="mt-6 text-2xl  tracking-tighter font-helvetica text-mist-700 ">
    <span className="text-black">Dagflow</span>  ensures nothing gets lost.
  </span>




</div>

<div className="flex gap-4  items-start p-4  ">

  <button  className=" px-4 py-2 rounded-lg bg-gray-100 border text-black font-mono tracking-tighter " >
Start for free
  </button>
<Link href="/register" >
  <button  className=" px-4 py-2 rounded-lg bg-gray-100 border text-black font-mono tracking-tighter " >
Register
  </button>
</Link>
 
</div>

    </div>
  );
}
