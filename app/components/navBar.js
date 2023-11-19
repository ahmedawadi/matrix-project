import Link from "next/link"

export function NavBar(){

    return (
        <div className='md:w-[70%] w-full'>
            <div className='md:pl-[30px] pl-[5px] mt-[-15px] whitespace-nowrap md:mt-[-50px] text-[45px] md:text-[75px] font-black titleSkew font-serif'>
               <Link href={'/'} className="w-fit opacity-80 hover:opacity-100 cursor-pointer">
                    <div className='calculTitle'>
                        Calcul des
                    </div>
                    <div className='md:pl-[55px] pl-[20px] md:mt-[-50px] mt-[-20px] calculSecondTitle'>
                        Matrices
                    </div>
               </Link>
            </div>
        </div>
    )
}

