'use client'

import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"

export default function Footer(){
    return (
        <div className="w-full h-full flex md:flex-row flex-col md:space-y-0 space-y-[25px] bg-[#424143] px-[20px] py-[20px] text-[#E4E7EA]">
            <div className="basis-[80%] h-full">
                <div className="flex md:flex-row flex-col md:space-x-[20px] space-x-0 md:space-y-0 space-y-[30px]">
                    <div className="basis-1/3">
                        <div className="flex flex-col space-y-[30px]">
                            <label className="flex flex-col space-y-[4px]">
                                <div className="font-semibold md:text-[16px] text-[20px] flex justify-between md:cursor-auto cursor-pointer" onClick={() => seeOrHideLink(0)}>
                                    Notre Front-End developer
                                    <div id="plusIcon0" className="md:hidden">+</div>
                                </div>
                                <div id="linkInfo0" className="md:flex space-x-[10px] items-center pl-[15px] hidden">
                                    <div className="text-[14px]">
                                        ahmed awadi
                                    </div>
                                    <div className="cursor-pointer flex space-x-[10px]">
                                        <a className="w-[20px] h-[20px]" target="_blank" href="https://www.linkedin.com/in/awedi-ahmed-020152245/">
                                            <FontAwesomeIcon icon={faLinkedin} size="lg" />
                                        </a>
                                        <a className="w-[20px] h-[20px]" target="_blank" href="https://github.com/ahmedawadi">
                                            <FontAwesomeIcon icon={faGithub} size="lg" />
                                        </a>
                                    </div>
                                    
                                </div>
                            </label>
                            <label className="flex flex-col space-y-[4px]">
                                <div className="font-semibold md:text-[16px] text-[20px] flex justify-between md:cursor-auto cursor-pointer" onClick={() => seeOrHideLink(1)}>
                                    Notre Back-End developer
                                    <div id="plusIcon1" className="md:hidden">+</div>
                                </div>
                                <div id="linkInfo1" className="md:flex space-x-[5px] items-center pl-[15px] md:inline-block hidden">
                                    <div className="text-[14px]">
                                        mohamed awadi
                                    </div>
                                    <div className="cursor-pointer flex space-x-[10px]">
                                        <a className="w-[20px] h-[20px]" href="https://www.linkedin.com/in/mmaouedi/" target="_blank" >
                                            <FontAwesomeIcon icon={faLinkedin} size="lg" />
                                        </a>
                                        <a className="w-[20px] h-[20px]" href="https://github.com/mawedi" target="_blank">
                                            <FontAwesomeIcon icon={faGithub} size="lg" />
                                        </a>
                                    </div>

                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="basis-1/3">
                        <div className="flex flex-col space-y-[30px]">
                            <label className="flex flex-col space-y-[4px]">
                                <div className="font-semibold md:text-[16px] text-[20px] flex justify-between md:cursor-auto cursor-pointer" onClick={() => seeOrHideLink(2)}>
                                    Notre UX/UI Designer
                                    <div id="plusIcon2" className="md:hidden">+</div>
                                </div>
                                <div id="linkInfo2" className="md:flex space-x-[5px] items-center pl-[15px] md:inline-block hidden">
                                    <div className="text-[14px]">
                                        soulaima bouhachem
                                    </div>
                                    <div className="cursor-pointer ">
                                        <a className="w-[20px] h-[20px]" href="https://www.linkedin.com/in/soulaima-bouhachem-76583420b/" target="_blank">
                                            <FontAwesomeIcon icon={faLinkedin} size="lg" />
                                        </a>
                                    </div>

                                </div>
                            </label>
                            <label className="flex flex-col space-y-[4px]">
                                <div className="font-semibold md:text-[16px] text-[20px] flex justify-between md:cursor-auto cursor-pointer" onClick={() => seeOrHideLink(3)}>
                                    Notre algorithm developer
                                    <div id="plusIcon3" className="md:hidden">+</div>
                                </div>
                                <div id="linkInfo3" className="md:flex space-x-[5px] items-center pl-[15px] md:inline-block hidden">
                                    <div className="text-[14px]">
                                        amal moussa
                                    </div>
                                    <div className="cursor-pointer ">
                                        <a className="w-[20px] h-[20px]" href="https://www.linkedin.com/in/amal-moussa-35b834252/" target="_blank">
                                            <FontAwesomeIcon icon={faLinkedin} size="lg" />
                                        </a>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="basis-1/3">
                        <div className="flex flex-col space-y-[30px]">
                            <label className="flex flex-col space-y-[4px] md:w-fit w-full">
                                <div className="font-semibold md:text-[16px] text-[20px] flex justify-between md:cursor-auto cursor-pointer" onClick={() => seeOrHideLink(4)}>
                                    Notre link Github Front-end
                                    <div id="plusIcon4" className="md:hidden">+</div>
                                </div>
                                <a id="linkInfo4" href="" target="_blank" className="md:flex space-x-[5px] items-center pl-[15px] md:inline-block hidden">
                                    <div className="w-[20px] h-[20px]">
                                        <FontAwesomeIcon icon={faGithub} size="lg" />
                                    </div>
                                    <div cldivssName="text-[14px]">
                                        Front-end Code
                                    </div>
                                </a>
                            </label>
                            <label className="flex flex-col space-y-[4px]">
                                <div className="font-semibold md:text-[16px] text-[20px] flex justify-between md:cursor-auto cursor-pointer" onClick={() => seeOrHideLink(5)}>
                                    Notre link Github Back-end
                                    <div id="plusIcon5" className="md:hidden">+</div>
                                </div>
                                <a id="linkInfo5" href="https://github.com/mawedi/matrixoperationsapi" target="_blank" className="md:flex space-x-[5px] items-center pl-[15px] md:inline-block hidden">
                                    <div className="w-[20px] h-[20px]">
                                        <FontAwesomeIcon icon={faGithub} size="lg" />
                                    </div>
                                    <div className="text-[14px]">
                                        Back-end Code
                                    </div>
                                </a>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div className='md:basis-[20%] lg:pl-0 pl-[5px] flex items-end md:justify-end justify-end [#E4E7EA]space-nowrap md:text-[40px] text-[30px] font-black  font-serif'>
                <div className="w-fit opacity-80 hover:opacity-100">
                    <div className='calculTitle'>
                        Calcul des
                    </div>
                    <div className='lg:pl-[55px] pl-[20px] lg:mt-[-30px] mt-[-10px] calculSecondTitle'>
                        Matrices
                    </div>
                </div>
            </div>
            
        </div>
    )
}

//this function is used to see or hide the info in the mobile version
function seeOrHideLink(linkId){
    const link = document.getElementById("linkInfo" + linkId)
    const icon = document.getElementById("plusIcon" + linkId)//it is the plus or - icon that we gonna change from + to - when the action is to hide and from - to + when the action is displaying

    if(link.classList.contains("hidden")){//user wanna see the info
        link.classList.remove("hidden")
        icon.innerHTML = '-'
    }
    else {//user wanna hide the info
        link.classList.add("hidden")
        icon.innerHTML = '+'
    }
}