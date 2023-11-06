'use client'

import { useState } from "react"
import ReactModal from "react-modal"
import MatrixInput from "./matrixInput"

let matrixSize = 1

export default function MatrixInverse(){

    const [matrixInputIsOpen, setMatrixInputIsOpen] = useState(false)

    //this function is used to get the values of a matrix with a specific size
    const getMatrix = () => {

        matrixSize = document.getElementById('matrixSize').value

        //get the matrix values
        setMatrixInputIsOpen(true)
    }

    return (
        <div className='basis-[70%] bg-[#424143] py-[20px] px-[50px] w-full flex flex-col'>
            <div className='w-full flex justify-end font-semibold text-[28px] text-white pb-[20px] border-b-[0.5px] border-[#4a4a4a] font-serif shadow-[0_1px_0_rgba(10,10,10,0.5)]'>
                Matrice inverse
            </div>
            <div className='pt-[80px] flex flex-col space-y-[30px] text-[#b5b5b5] text-[18px]'>
                <div>
                    Ici, vous pouvez calculer une matrice inverse contenant des nombres complexes en ligne gratuitement avec une solution très détaillée. L'inverse est calculée en utilisant l'élimination de Gauss-Jordan.                </div>
                <div className='px-[30px] border-[1px] border-[#4a4a4a] shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)] flex justify-between items-center w-full h-[200px]'>
                    
                    <div className='flex space-x-[15px] text-[20px]'>
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
            <ReactModal isOpen={matrixInputIsOpen} overlayClassName={'fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-60'} className={'flex overflow-auto'}>
                <div className="flex justify-center items-center">
                    <MatrixInput matrixLines={matrixSize} matrixColumns={matrixSize} matrixName={'A'} closeMatrix={() => setMatrixInputIsOpen(false)}  />
                </div>
            </ReactModal>
        </div>
    )
}

//this function is used to prevent the addition of negative matrix size
function checkMatrixSize(event){
    
    if(event.target.value < 1)
        event.target.value = 1
}

