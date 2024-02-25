'use client'

import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"

export default function Footer(){
    return (
        <div className="w-full flex flex-col bg-[#424143]">
            <div className="w-full h-full flex lg:flex-row flex-col lg:space-y-0 space-y-[25px]  xl:px-[30px] px-[20px] py-[20px] text-[#E4E7EA]">
                <div className="basis-[85%] h-full">
                    <div className="flex lg:flex-row flex-col lg:space-x-[20px] space-x-0 lg:space-y-0 space-y-[30px]">
                        <div className="basis-1/3">
                            <div className="flex flex-col space-y-[30px]">
                                <label className="flex flex-col space-y-[4px]">
                                    <div className="font-semibold lg:text-[16px] text-[20px] flex justify-between lg:cursor-auto cursor-pointer" onClick={() => seeOrHideLink(0)}>
                                        Notre Front-End developer
                                        <div id="plusIcon0" className="lg:hidden">+</div>
                                    </div>
                                    <div id="linkInfo0" className="lg:flex space-x-[10px] items-center pl-[15px] hidden">
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
                                    <div className="font-semibold lg:text-[16px] text-[20px] flex justify-between lg:cursor-auto cursor-pointer" onClick={() => seeOrHideLink(1)}>
                                        Notre Back-End developer
                                        <div id="plusIcon1" className="lg:hidden">+</div>
                                    </div>
                                    <div id="linkInfo1" className="lg:flex space-x-[5px] items-center pl-[15px] lg:inline-block hidden">
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
                                    <div className="font-semibold lg:text-[16px] text-[20px] flex justify-between lg:cursor-auto cursor-pointer" onClick={() => seeOrHideLink(2)}>
                                        Notre UX/UI Designer
                                        <div id="plusIcon2" className="lg:hidden">+</div>
                                    </div>
                                    <div id="linkInfo2" className="lg:flex space-x-[5px] items-center pl-[15px] lg:inline-block hidden">
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
                                    <div className="font-semibold lg:text-[16px] text-[20px] flex justify-between lg:cursor-auto cursor-pointer" onClick={() => seeOrHideLink(3)}>
                                        Notre algorithm developer
                                        <div id="plusIcon3" className="lg:hidden">+</div>
                                    </div>
                                    <div id="linkInfo3" className="lg:flex space-x-[5px] items-center pl-[15px] lg:inline-block hidden">
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
                                <label className="flex flex-col space-y-[4px] lg:w-fit w-full">
                                    <div className="font-semibold lg:text-[16px] text-[20px] flex justify-between lg:cursor-auto cursor-pointer" onClick={() => seeOrHideLink(4)}>
                                        Notre link Github
                                        <div id="plusIcon4" className="lg:hidden">+</div>
                                    </div>
                                    <a id="linkInfo4" href="https://github.com/ahmedawadi/matrix-project" target="_blank" className="lg:flex space-x-[5px] items-center pl-[15px] lg:inline-block hidden">
                                        <div cldivssName="text-[14px]">
                                            Website code
                                        </div>
                                        <div className="w-[20px] h-[20px]">
                                            <FontAwesomeIcon icon={faGithub} size="lg" />
                                        </div>
                                    </a>
                                </label>
                                <label className="flex flex-col space-y-[4px]">
                                    <div className="font-semibold lg:text-[16px] text-[20px] flex justify-between lg:cursor-auto cursor-pointer" onClick={() => seeOrHideLink(3)}>
                                        Notre superviseur
                                        <div id="plusIcon3" className="lg:hidden">+</div>
                                    </div>
                                    <div id="linkInfo3" className="lg:flex space-x-[5px] items-center pl-[15px] lg:inline-block hidden">
                                        <div className="text-[14px]">
                                            Dr. Sirirne Marrakchi
                                        </div>
                                        <div className="cursor-pointer ">
                                            <a className="w-[20px] h-[20px]" href="https://www.linkedin.com/in/sirine-marrakchi-5a691a66/" target="_blank">
                                                <FontAwesomeIcon icon={faLinkedin} size="lg" />
                                            </a>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className='lg:basis-[15%] lg:pl-0 pl-[5px] flex items-end lg:justify-end justify-end [#E4E7EA]space-nowrap lg:text-[40px] text-[30px] font-black  font-serif'>
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
            <div className="w-full h-[1px] bg-[#b5b5b5]"></div>
            <div className="bg-[#383838] w-full h-full flex justify-center px-[30px] py-[5px] text-white md:text-[15px] text-[10px]">
                <a href="https://fss.rnu.tn/" className="flex ">
                    <img src="facultyLogo.png" className="w-[40px] h-[25px]"/>
                    <div className="font-thin text-[14px]">
                        Faculté des Sciences de Sfax 2023-2024
                    </div>
                </a>                
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