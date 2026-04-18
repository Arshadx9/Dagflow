
const Navbar = () => {

    return(
        <div className="bg-gray-200 px-8 py-2.5  flex justify-between items-center m-4 rounded-2xl "  >

<div className="font-helvetica text-black text-3xl font-extrabold " >
    Dagflow
</div>

<div className="text-black flex gap-7 text-xl tracking-tighter" >

<a href="#">Docs</a>
<a href="#">Use cases</a>

</div>


<div>
    <button className="px-4 py-2  text-white bg-black rounded-lg font-helvetica text-xl tracking-tighter " >
    Start for free
    </button>
</div>


        </div>
    )

}

export default Navbar