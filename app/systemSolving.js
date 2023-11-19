'use client'

import { useState } from "react"
import ReactModal from "react-modal"
import MatrixInput from "./matrixInput"
import {checkMatrixSize} from "./matrixInverse"
import axios from "axios"

let matrixSize = 1
const algorthims = ["Méthode de Gauss", "Méthode de Gauss Jordan", "Méthode de décomposition LU", "Méthode de Cholesky"]//algorthims that will be choosed to sovle the system

export default function SystemSolving(){

    const [matrixInputIsOpen, setMatrixInputIsOpen] = useState(false)
    const [algorithm, setAlgorithm] = useState(0)//by default the Gauss algorithm will be used

    //this function is used to get the values of a matrix with a specific size
    const getMatrix = () => {

        matrixSize = document.getElementById('matrixSize').value

        //get the matrix values
        setMatrixInputIsOpen(true)

    }

    const calculate = () => {
        
        const systemData = getSystemToSolveData('X', 'b', matrixSize)

        //system data is on that form [matrix, vector]
        if(!(systemData[0] && systemData[1]))
            return

        const dataToSend = {
            matrix : systemData[0],
                vector : systemData[1]
        }
        console.log(dataToSend)
        axios.post('http://192.168.129.58:8000/matrix/solve/', dataToSend).then(res => {
            window.open('/systemSolvingCalculation?matrixId=' + res.data._id, '_blank')

            const matrixWarning = document.getElementById('matrixWarning')

            if(matrixWarning.innerText != '')
                matrixWarning.innerHTML = ''

            setMatrixInputIsOpen(false)
        }).catch(error => {
            console.log(error)


            if(error?.response?.status == 400){
                const matrixWarning = document.getElementById('matrixWarning')

                matrixWarning.innerHTML = "Impossible de résoudre cette matrice"
            }
        })

    }

    return (
        <div className='xl:basis-[80%] bg-[#424143] py-[20px] xl:px-[50px] px-[15px]  flex flex-col'>
            <div className='w-full flex justify-end font-semibold text-[28px] text-white pb-[20px] border-b-[0.5px] border-[#4a4a4a] font-serif shadow-[0_1px_0_rgba(10,10,10,0.5)]'>
                Résoudre d'un système 
            </div>
            <div className='xl:pt-[80px] xl:text-[22px] pt-[30px] flex flex-col space-y-[30px] text-[#b5b5b5] text-[18px]'>
                <div>
                    Ici vous pouvez résoudre le système d'équations linéaire simultanées utilisant Le calculateur de la méthode de Gauss avec nombres réelles en ligne librement avec une solution très détaillée. La clef de notre calculateur est que chaque déterminant peut être calculer individuellement et que vous pouvez aussi regarder le type exact de matrice si le déterminant de la Matrice principale est zéro.
                    <br/>
                    <div className="mt-[45px]">
                        Vous pouvez choisir quel type d'algorithmes vous voulez utiliser pour résoudre votre système : 
                    </div>
                    <ul className="list-disc pl-[25px] font-bold">
                        {
                            algorthims.map((algorithmName, index) => <li key={index} className="">
                                <label className="flex space-x-[15px]">
                                    <div>
                                        {
                                            algorithmName
                                        }
                                    </div>
                                    <input type="radio" checked={index == algorithm} className="accent-black w-[15px]" onClick={() => setAlgorithm(index)} /> 
                                </label>
                            </li>)
                        }
                        
                    </ul>
                </div>
                <div className='xl:px-[30px] xl:py-[0px] py-[5px] px-[10px] border-[1px] border-[#4a4a4a] shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)] flex xl:flex-row flex-col space-y-[15px] xl:space-y-[0px] justify-center space-x-[25px] items-center w-full xl:h-[200px]'>
                    
                    <div className='flex md:flex-row flex-col space-y-[5px] md:space-x-[15px] text-[20px]'>
                        <div>
                            Dimension de la matrice:
                        </div>
                        <input type='number' id="matrixSize" defaultValue={'1'} className='w-[50px] h-[30px] p-[5px] text-[18px] text-black hover:bg-[url("../public/titleFont.png")] focus:bg-[url("../public/titleFont.png")]' onChange={(event) => checkMatrixSize(event)} />
                    </div>
                    
                    <div className="h-full flex items-center">
                        <button className="font-semibold border-2 border-[#4a4a4a] text-white px-[10px] py-[5px] shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)]" onClick={getMatrix}>
                            Ajouter matrice
                        </button>
                    </div>
                </div>
            </div>
            <ReactModal ariaHideApp={false} isOpen={matrixInputIsOpen} overlayClassName={'fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-60' } className={'flex overflow-auto'}>
                <div className="flex justify-center items-center">
                    <MatrixInput matrixLines={matrixSize} matrixColumns={matrixSize} matrixName={'X'} closeMatrix={() => setMatrixInputIsOpen(false)} containsBVector={true} catlucate={calculate}  />
                </div>
            </ReactModal>
        </div>
    )
}

//getting system data with a specifc matrix name and specific vector name and specific size
function getSystemToSolveData(matrixName, vectorName, matrixSize){

    const matrix = []
    const vector = []

    for(let i=0; i<matrixSize; i++){
        const matrixLine = []
        const vectorElement = document.getElementById(vectorName + i).value

        if(vectorElement === '')
                return null

        vector.push([Number(vectorElement)])

        for(let j=0; j<matrixSize; j++){

            const matrixElement = document.getElementById(matrixName + i + j).value

            if(matrixElement === '')
                return null

            matrixLine.push(Number(matrixElement))
        }

        matrix.push(matrixLine)
    }

    return [matrix, vector]
}