'use client'
import { faCheck, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"

const validator = require("validator")

export default function Page(){

    const [submitionIsLoading, setSubmitionIsLoading] = useState(false)
    const [submitionDone, setSubmitionDone] = useState(false)
    const router = useRouter()

    const submitFeedBack = () => {
        
        const firstName = document.getElementById("firstName")
        const firstNameWarning = document.getElementById("firstNameWarning")
        const lastName = document.getElementById("lastName")
        const lastNameWarning = document.getElementById("lastNameWarning")
        const email = document.getElementById("email")
        const emailWarning = document.getElementById("emailWarning")
        const feedback = document.getElementById("feedback")
        const feedbackWarning = document.getElementById("feedbackWarning")
        const submitionWarning = document.getElementById("submitionWarning")
        const submitionButton = document.getElementById("submitionButton")//used to disable the submition button
        let validFormData = true

        setSubmitionIsLoading(true)
        submitionButton.disabled = true
        submitionButton.classList.add("opacity-60")

        if(submitionWarning.innerText != '')
            submitionWarning.innerHTML = ''

        if(firstName.value.trim() == '' ){
            validFormData = false
            firstNameWarning.innerHTML = 'le champs prénom est vide!'
        }
        else if (firstNameWarning.innerText != '')
            firstNameWarning.innerHTML = ''

        if(lastName.value.trim() == '' ){
            validFormData = false
            lastNameWarning.innerHTML = 'le champs nom est vide!'
        }
        else if (lastNameWarning.innerText != '')
            lastNameWarning.innerHTML = ''

        if(email.value.trim() == '' ){
            validFormData = false
            emailWarning.innerHTML = 'le champs email est vide!'
        }
        else if(!validator.isEmail(email.value)){
            validFormData = false
            emailWarning.innerHTML = "Le format de l'e-mail est incorrect!"
        }
        else if (emailWarning.innerText != '')
            emailWarning.innerHTML = ''

        if(feedback.value.trim() == '' ){
            validFormData = false
            feedbackWarning.innerHTML = 'le champs feedback est vide!'
        }
        else if (feedbackWarning.innerText != '')
            feedbackWarning.innerHTML = ''

        if(!validFormData){
            //stop the loading
            setSubmitionIsLoading(false)
            submitionButton.disabled = false
            submitionButton.classList.remove("opacity-60")
        }
        else {
            //send the data
            const feedbackInfo = {
                fisrt_name: firstName.value,
                last_name: lastName.value,
                email: email.value,
                message: feedback.value
            }

            axios.post("https://web-production-e015.up.railway.app/matrix/send-email/", feedbackInfo).then(res => {
                //remove data from inputs
                firstName.value = ''
                lastName.value = ''
                email.value = ''
                feedback.value = ''

                setSubmitionIsLoading(false)

                //display the check icon as a confirmation
                setSubmitionDone(true)
                setTimeout(() => {
                    setSubmitionDone(false)
                    router.push('/')
                }, 900);
                
            }).catch(error => {
                //display the failure of submition
                
                if(error?.response?.status == 400 && error?.response?.data?.message)
                    emailWarning.innerHTML = error?.response?.data?.message
                else   
                    submitionWarning.innerHTML = 'Réssayer une autre fois'

                setSubmitionIsLoading(false)
                submitionButton.disabled = false
                submitionButton.classList.remove("opacity-60")
            })

        }
        
    }

    return (
        <div className="flex justify-center">
            <div className='md:w-[70%] w-[95%] bg-[#424143] py-[16px] xl:px-[50px] px-[15px]  flex flex-col'>
                <div className='w-full flex justify-end font-semibold text-[28px] text-white pb-[16px] border-b-[0.5px] border-[#4a4a4a] font-serif shadow-[0_1px_0_rgba(10,10,10,0.5)]'>
                    Feedback
                </div>
                <div className="flex flex-col space-y-[30px] text-[#E4E7EA]">
                    <div className="flex flex-col space-y-[5px]">
                        <div className='xl:text-[22px] pt-[16px] px-[20px] flex flex-col items-center space-y-[16px]'>
                            <div className="md:w-[70%] w-[95%] flex space-x-[10px]">
                                <div className="flex flex-col basis-[50%] overflow-hidden">
                                    <input id="firstName" className=" p-[5px] bg-transparent border-[3px] border-[#E4E7EA] outline-none" placeholder="nom" />
                                    <div id="firstNameWarning" className="text-[#c70024] text-[15px]"></div>
                                </div>
                                <div className="flex flex-col basis-[50%] overflow-hidden">
                                    <input id="lastName" className=" h-fit p-[5px] bg-transparent border-[3px] border-[#E4E7EA] outline-none" placeholder="prénom" />
                                    <div id="lastNameWarning" className="text-[#c70024] text-[15px]"></div>
                                </div>
                            </div>
                            <div className="md:w-[70%] w-[95%] flex flex-col">
                                <input id="email" className="w-full p-[5px] bg-transparent border-[3px] border-[#E4E7EA] outline-none" placeholder="Email" />
                                <div id="emailWarning" className="text-[#c70024] text-[15px]"></div>
                            </div>
                            <div className="flex flex-col md:w-[70%] w-[95%]">
                                <textarea id="feedback" className="w-full p-[5px] bg-transparent border-[3px] border-[#E4E7EA] min-h-[70px] outline-none" placeholder="Vos commmentaires/questions"></textarea>
                                <div id="feedbackWarning" className="text-[#c70024] text-[15px]"></div>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <p className="md:w-[70%] w-[95%] pl-[20px]">Tous les champs sont obligatoires*</p>
                        </div>
                    </div>
                    <div className="w-full flex flex-col space-y-[10px] items-center">
                        <div id="submitionWarning" className="text-[#c70024] text-[20px]"></div>
                        <button id="submitionButton" className="px-[80px]  w-fit bg-[url('../public/titleFont.png')] text-white font-bold text-[25px] flex space-x-[10px]" onClick={submitFeedBack}>
                            <div>
                                Envoyer
                            </div>
                            {
                                submitionIsLoading ? <div className="w-[25px] h-[25px] rounded-full">
                                    <FontAwesomeIcon icon={faSpinner} spin size="sm" />
                                </div>: submitionDone ? <div className="w-[25px] h-[25px] rounded-full">
                                    <FontAwesomeIcon icon={faCheck}  size="sm" />
                                </div> : null
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}