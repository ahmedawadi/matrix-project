'use client'

import { useState } from "react"
import ReactModal from "react-modal"
import MatrixInput from "./matrixInput"
import {multplicateDenseMatrices} from './matrixFunctionalitites/multiplication'
import { usePathname, useRouter } from "next/navigation"

let matrixALines = 1
let matrixAColumns = 1
let matrixBLines = 1
let matrixBColumns = 1

export default function MultiplicationMatricesDenses(){

    const [matrixInputIsOpen, setMatrixInputIsOpen] = useState(false)
    const pathName = usePathname()

    const openMatrixMultiplication = () => {

        //getting matrices size
        matrixALines = document.getElementById('matrixALines').value
        matrixAColumns = document.getElementById('matrixAColumns').value
        matrixBLines = document.getElementById('matrixBLines').value
        matrixBColumns = document.getElementById('matrixBColumns').value

        //get the matrices values
        setMatrixInputIsOpen(true)
    }

    const calculate = () => {

        const matrixA = getMatrix('A')
        const matrixB = getMatrix('B')

        if(!matrixA || !matrixB)
            return

        //putting the matix in the localstorage to get it from the displaying page 
        localStorage.setItem('matrix', JSON.stringify(multplicateDenseMatrices(matrixA, matrixB)))
        window.open('/calculationResult', '_blank')

        setMatrixInputIsOpen(false)

    }


    return (
        <div className='basis-[70%] bg-[#424143] py-[20px] px-[50px] w-full flex flex-col'>
            <div className='w-full flex justify-end font-semibold text-[28px] text-white pb-[20px] border-b-[0.5px] border-[#4a4a4a] font-serif shadow-[0_1px_0_rgba(10,10,10,0.5)]'>
                Multiplication Matricielles
            </div>
            <div className='pt-[80px] flex flex-col space-y-[30px] text-[#b5b5b5] text-[18px]'>
                <div>
                    La multiplication de deux matrices carre denses : après la multiplication de la matrice, il est possible d'ajouter des instructions supplémentaires sur la matrice qui en résulte, telles que le calcul d'inverse ou la multiplication par une matrice...
                </div>
                <div className='px-[30px] border-[1px] border-[#4a4a4a] shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)] flex justify-between items-center w-full h-[200px]'>
                    <div className="flex flex-col space-y-[25px]">
                        <div className='flex space-x-[15px] text-[20px]'>
                            <div>
                                Dimension de la matrice A:
                            </div>
                            <input type='number' id="matrixALines" defaultValue={'1'} className='w-[50px] h-[30px] p-[5px] text-[18px] text-black hover:bg-[url("../public/titleFont.png")] focus:bg-[url("../public/titleFont.png")]' onChange={(event) => checkMatrixLength(event)} />
                            <div>
                                X
                            </div>
                            <input type='number' id="matrixAColumns" defaultValue={'1'} className='w-[50px] h-[30px] p-[5px] text-[18px] text-black hover:bg-[url("../public/titleFont.png")] focus:bg-[url("../public/titleFont.png")]' onChange={(event) => changeMatrixBLines(event) } />
                        </div>
                        <div className='flex space-x-[15px] text-[20px]'>
                            <div>
                                Dimension de la matrice B:
                            </div>
                            <input type='number' id="matrixBLines" defaultValue={'1'} className='w-[50px] h-[30px] p-[5px] text-[18px] text-black hover:bg-[url("../public/titleFont.png")] focus:bg-[url("../public/titleFont.png")]' onChange={(event) => changeMatrixAColumns(event)}/>
                            <div>
                                X
                            </div>
                            <input type='number' id="matrixBColumns" defaultValue={'1'} className='w-[50px] h-[30px] p-[5px] text-[18px] text-black hover:bg-[url("../public/titleFont.png")] focus:bg-[url("../public/titleFont.png")]' onChange={(event) => checkMatrixLength(event)} />
                        </div>
                    </div>
                    <div className="h-full flex items-center">
                        <button className="font-semibold border-2 border-[#4a4a4a] text-white px-[10px] py-[5px] shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)]" onClick={openMatrixMultiplication}>
                            Ajouter matrices
                        </button>
                    </div>
                </div>
            </div>
            <ReactModal isOpen={matrixInputIsOpen} overlayClassName={'fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-60'} className={'flex space-x-[20px] overflow-auto outline-none'}>
                <div className="flex justify-center items-center">
                    <MatrixInput matrixLines={matrixALines} matrixColumns={matrixAColumns} matrixName={'A'} />
                </div>
                <div className="">
                    <MatrixInput matrixLines={matrixBLines} matrixColumns={matrixBColumns} matrixName={'B'} closeMatrix={() => setMatrixInputIsOpen(false)} catlucate={calculate} />
                </div>
            </ReactModal>
        </div>

    )

}

function changeMatrixBLines(matrixAColumns){

    checkMatrixLength(matrixAColumns)
    document.getElementById('matrixBLines').value = matrixAColumns.target.value 
}

function changeMatrixAColumns(matrixBLines){

    checkMatrixLength(matrixBLines)
    document.getElementById('matrixAColumns').value = matrixBLines.target.value 
}

function checkMatrixLength(event){

    if(event.target.value < 1)
        event.target.value = 1
    
}

function getMatrix(matrixName){

    const matrixLines = (matrixName === 'A' ? matrixALines : matrixBLines)
    const matrixColumns = (matrixName === 'A' ? matrixAColumns : matrixBColumns)

    const matrix = []

    for(let i=0; i<matrixLines; i++){
        const matrixLine = []
        
        for(let j=0; j<matrixColumns; j++){

            const matrixElement = document.getElementById(matrixName + i + j).value

            if(matrixElement === '')
                return null

            matrixLine.push(matrixElement)
        }

        matrix.push(matrixLine)
    }

    return matrix


}