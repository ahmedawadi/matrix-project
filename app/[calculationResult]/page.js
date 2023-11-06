'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {NavBar} from '../components/navBar'

let matrixExistInLocalStorage = false//we use it due to the react strict mode
const cacluationReslt = ['Résultat de la produit matriciel', 'Résultat de la calculation du matrice inverse']
const functionalities = ["Rang d'une matrice", "Rang d'une matrice", "Produit matriciel", "Addition matricielle", "Soustraction matricielle"]

export default function page({params}){

    const [matrix, setMatrix] = useState(null)//matrix to display
    const router = useRouter()

    useEffect(() => {
        
        //getting the matrix from the localstorage
        if(typeof window !== 'undefined'){

            let matrixToDisplay
            
            if((matrixToDisplay = localStorage.getItem('matrix'))){

                setMatrix(JSON.parse(matrixToDisplay))
                localStorage.removeItem('matrix')
                matrixExistInLocalStorage = true
            }
            else if (!matrixExistInLocalStorage) //redirect the user to the home page
                router.push('/')
        }

    }, [])

    return (
        matrix && 
        <div className="flex justify-center w-full">
            <div className='w-[70%] bg-[#424143] py-[20px] px-[50px] flex flex-col h-screen'>
                <div className="relative">
                    <div className='w-full flex justify-end font-semibold text-[28px] text-white pb-[20px] border-b-[0.5px] border-[#4a4a4a] font-serif shadow-[0_1px_0_rgba(10,10,10,0.5)]'>
                        Affichage du matrice
                    </div>
                    <div className="absolute flex flex-col border-t-black border-2">
                        {
                            functionalities.map((functionality, index) => <div key={index} className="py-[10px] px-[20px] border-b-2 cursor-pointer border-black px-[15px] py-[10px] hover:text-white hover:bg-[url('../public/titleFont.png')]">
                                {
                                    functionality
                                }
                            </div>)
                        }
                    </div>
                </div>
                
                <div className='pt-[80px] flex flex-col space-y-[30px] text-[#b5b5b5] text-[18px]'>
                    <div className="w-full flex justify-center">
                        <button className="font-semibold border-2 border-[#575757] hover:border-[#4a4a4a] rounded-[5px] text-white px-[10px] py-[5px] hover:shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)]">
                            Continue calculation
                        </button>
                    </div>
                    <div className='px-[30px] py-[40px] w-full min-h-[200px] border-[1px] border-[#4a4a4a] shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)] flex flex-col justify-center space-y-[25px]'>
                        <div className="text-[25px] font-serif">
                            Result :
                        </div>
                        <div className="w-full flex justify-center">
                            <table className="border-collapse border border-[#c2c2c2]">
                                {
                                    Array.from({length : Number(matrix[0]?.length) + 1}).map((_, index) => index === 0 ? <th key={index} className="border border-[#c2c2c2] border-[2px]"></th> :
                                        <th key={index} className="font-extrabold text-[22px] text-[#c2c2c2] border border-[#c2c2c2] border-[2px]">
                                            <div className="flex justify-center w-full">
                                                C
                                                <div className="mt-[7px] ">
                                                    {
                                                        index
                                                    }
                                                </div>
                                            </div>
                                        </th>
                                    )
                                }
                                {
                                    Array.from({length : matrix?.length}).map((_, lineIndex) => <tr key={lineIndex} className="border border-[#c2c2c2] border-[2px]">
                                        <td className="font-extrabold text-[22px] text-[#c2c2c2] border border-[#c2c2c2] border-[2px] p-[5px]">
                                            {
                                                Number(lineIndex) + 1
                                            }
                                        </td>
                                        {
                                            Array.from({length : matrix[0]?.length}).map((_, columnIndex) => <td key={columnIndex} className="p-[5px] border border-[#c2c2c2] border-[2px]">
                                                <div className="p-[5px] w-[60px] h-[40px] flex justify-center items-center text-white">
                                                    {
                                                        matrix[lineIndex][columnIndex]
                                                    }
                                                </div>
                                            </td>)
                                        }
                                    </tr>)
                                }
                            </table>
                        </div>
    
                    </div>
                </div>
            </div>
        </div>

    )
}