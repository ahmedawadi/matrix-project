'use client'

import { useState } from "react"
import ReactModal from "react-modal"
import MatrixInput from "./matrixInput"
import { checkMatrixSize } from "./matrixInverse"
import axios from 'axios'

let matrixSize = 1

export default function Determinant(){

    const [matrixInputIsOpen, setMatrixInputIsOpen] = useState(false)

    //this function is used to get the values of a matrix with a specific size
    const getMatrixInput = () => {

        matrixSize = document.getElementById('matrixSize').value

        if(matrixSize == '')
            return 

        //get the matrix values
        setMatrixInputIsOpen(true)
    }

    const calculate = () => {
        const matrix = getMatrixWithSpecificSize('A', matrixSize)

        if(!matrix)
            return

        const dataToSend = {
            matrix : matrix
        }
        
        axios.post('http://192.168.1.16:8000/matrix/determinant/', dataToSend).then(res => {
            window.open('/determinantCaclucation?matrixId=' + res.data._id, '_blank')
            setMatrixInputIsOpen(false)
        }).catch(error => {
            console.log(error)
        })

    }

    return (
        <div className='xl:basis-[80%] bg-[#424143] py-[20px] xl:px-[50px] px-[15px]  flex flex-col'>
            <div className='w-full flex justify-end font-semibold text-[28px] text-white pb-[20px] border-b-[0.5px] border-[#4a4a4a] font-serif shadow-[0_1px_0_rgba(10,10,10,0.5)]'>
                Déterminant d'une matrice
            </div>
            <div className='xl:pt-[80px] xl:text-[22px] pt-[30px] flex flex-col space-y-[30px] text-[#b5b5b5] text-[18px]'>
                <div>
                    Ici, vous pouvez calculer un déterminant d'une matrice avec des nombres réelles avec une solution très détaillée. Le déterminant est calculé en réduisant la matrice en forme échelonnée et en multipliant les éléments de sa diagonale principale.
                </div>
                <div className='xl:px-[30px] xl:py-[0px] py-[5px] px-[10px] border-[1px] border-[#4a4a4a] shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)] flex xl:flex-row flex-col space-y-[15px] xl:space-y-[0px] justify-between items-center w-full xl:h-[200px]'>
                    
                    <div className='flex md:flex-row flex-col space-y-[5px] md:space-x-[15px] text-[20px]'>
                        <div>
                            Dimension de la matrice:
                        </div>
                        <input type='number' id="matrixSize" defaultValue={'1'} className='w-[50px] h-[30px] p-[5px] text-[18px] text-black hover:bg-[url("../public/titleFont.png")] focus:bg-[url("../public/titleFont.png")]' onChange={(event) => checkMatrixSize(event)} />
                    </div>
                    
                    <div className="h-full flex items-center">
                        <button className="font-semibold border-2 border-[#4a4a4a] text-white px-[10px] py-[5px] shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)]" onClick={getMatrixInput}>
                            Ajouter matrice
                        </button>
                    </div>
                </div>
            </div>
            <ReactModal ariaHideApp={false} isOpen={matrixInputIsOpen} overlayClassName={'fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-60' } className={'flex overflow-auto'}>
                <div className="flex justify-center items-center">
                    <MatrixInput matrixLines={matrixSize} matrixColumns={matrixSize} matrixName={'A'} closeMatrix={() => setMatrixInputIsOpen(false)} catlucate={calculate}  />
                </div>
            </ReactModal>
        </div>
    )
}

//getting the matrix values for a matrix with a specific name and a specific size
export function getMatrixWithSpecificSize(matrixName, matrixSize){

    const matrix = []

    for(let i=0; i<matrixSize; i++){
        const matrixLine = []
        
        for(let j=0; j<matrixSize; j++){

            const matrixElement = document.getElementById(matrixName + i + j).value

            if(matrixElement === '')
                return null

            matrixLine.push(Number(matrixElement))
        }

        matrix.push(matrixLine)
    }

    return matrix
}