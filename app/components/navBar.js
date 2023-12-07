'use client'

import { faBars, faBurger, faClose, faHamburger } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navBarElements = ["Accueil", "À propos de nous", "Feedback"]
const pagePath = ["/", "/about", "/feedback"]

export function NavBar(){

    const currentPage = usePathname()

    return (
        <div className='w-full lg:px-[50px] px-[5px] flex justify-between items-center overflow-hidden'>
            <div className='lg:pl-0 pl-[5px] whitespace-nowrap text-[30px] lg:text-[75px] font-black titleSkew font-serif'>
               <Link href={'/'} className="w-fit opacity-80 hover:opacity-100 cursor-pointer">
                    <div className='calculTitle'>
                        Calcul des
                    </div>
                    <div className='lg:pl-[55px] pl-[20px] lg:mt-[-50px] mt-[-20px] calculSecondTitle'>
                        Matrices
                    </div>
               </Link>
            </div>
            <div id="barsOpenningButton" className="lg:hidden text-white absolute right-[15px]">
                <FontAwesomeIcon icon={faBars} size="xl" onClick={seeNavBarElements} />
            </div>

            <div id="navBarElements" className="flex lg:h-full lg:flex-row lg:space-x-[13px] lg:static lg:pt-0 lg:bg-transparent lg:mt-[15px] flex-col space-y-[7px] lg:translate-x-0 lg:bg-transparent bg-[#424143] justify-center items-center fixed z-50 h-screen right-0 left-0 top-0 right-0 translate-x-[120%] text-white duration-[1000ms]">
                <div id="barsClosingButton" className="lg:hidden hidden text-white absolute right-[20px] top-[10px] duration">
                    <FontAwesomeIcon icon={faClose} size="2xl" onClick={hideNavBarElements} />
                </div>
                {
                    navBarElements.map((navBarElement, index) => <Link onClick={hideNavBarElements} href={pagePath[index]} key={index} className={"lg:text-[30px] lg:text-[20px] text-[45px] lg:hover:shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)] lg:py-[5px] lg:px-[20px] hover:bg-[#424143] hover:rounded-[20px] lg:text-white font-serif font-exrabold cursor-pointer duration-[500ms]" + (currentPage == pagePath[index] ? ' navBarPageElement' : ' navBarElements')}>
                        {
                            navBarElement
                        }
                    </Link>)
                }
            </div>
        </div>
    )
}

//function used to open nav bar elements in the mobile version
function seeNavBarElements(){

    document.getElementById("navBarElements").classList.remove("translate-x-[120%]")
    document.getElementById("barsOpenningButton").classList.add("hidden")
    document.getElementById("barsClosingButton").classList.remove("hidden")
}

//function used to close nav bar elements in the mobile version
function hideNavBarElements(){

    document.getElementById("navBarElements").classList.add("translate-x-[120%]")
    document.getElementById("barsOpenningButton").classList.remove("hidden")
    document.getElementById("barsClosingButton").classList.add("hidden")
}

