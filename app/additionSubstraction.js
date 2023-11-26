'use client'

import { useState } from "react"
import ReactModal from "react-modal"
import MatrixInput from "./matrixInput"
import MatrixAdditionSubstractionInput from './components/matrixAdditionSubstractionInput'
import axios from 'axios'

let matrixLines = 1
let matrixColumns = 1

export default function AdditionSubstraction(){

    const [matrixInputIsOpen, setMatrixInputIsOpen] = useState(false)
    const [additionOrSubstraction, setAdditionOrSubstraction] = useState(0)//0 is addition and 1 is substraction

    //this function is used to get the values of a matrix with a specific size
    const getMatrixInput = () => {

        matrixLines = document.getElementById('matrixLines').value
        matrixColumns = document.getElementById('matrixColumns').value

        if(matrixColumns == '' || matrixLines == '' )
            return

        //get the matrix values
        setMatrixInputIsOpen(true)
    }

    const calculate = () => {

        const matrixA = getMatrix('A')
        const matrixB = getMatrix('B')

        if(!matrixA || !matrixB)
            return

        const dataToSend = {
            first_matrix: matrixA,
            second_matrix: matrixB
        }
        
        axios.post('http://192.168.1.16:8000/matrix/' + (additionOrSubstraction == 0 ? 'add/' : 'substract/') , dataToSend).then(res => {
            window.open(`/${(additionOrSubstraction == 0 ? 'additionCalculation' : 'substractionCalculation' )}?matrixId=${res.data._id}`, '_blank')
        }).catch(error => {
            console.log(error)
        })

        setMatrixInputIsOpen(false)

    }

    return (
        <div className='xl:basis-[80%] bg-[#424143] py-[20px] xl:px-[50px] px-[15px]  flex flex-col'>
            <div className='w-full flex justify-end font-semibold text-[28px] text-white pb-[20px] border-b-[0.5px] border-[#4a4a4a] font-serif shadow-[0_1px_0_rgba(10,10,10,0.5)]'>
                Addition et Soustraction matricielle
            </div>
            <div className='xl:pt-[80px] xl:text-[22px] pt-[30px] flex flex-col space-y-[30px] text-[#b5b5b5] text-[18px]'>
                <div>
                    Ici, vous pouvez additionner et soustraire des matrices avec des nombres réeeles.
                </div>
                <MatrixAdditionSubstractionInput setAdditionOrSubstraction={setAdditionOrSubstraction} additionOrSubstraction={additionOrSubstraction} getMatrix={getMatrixInput} />
            </div>
            <ReactModal ariaHideApp={false} isOpen={matrixInputIsOpen} overlayClassName={'xl:justify-center xl:items-center fixed top-0 left-0 right-0 bottom-0 flex bg-black bg-opacity-60 overflow-auto' + (matrixColumns > 7 ? '' : ' xl:justify-center xl:items-center')} className={'flex space-x-[20px] outline-none'}>
                <div className="flex justify-center items-center">
                    <MatrixInput matrixLines={matrixLines} matrixColumns={matrixColumns} matrixName={'A'} />
                </div>
                <div className="flex justify-center items-center">
                    <MatrixInput matrixLines={matrixLines} matrixColumns={matrixColumns} matrixName={'B'} closeMatrix={() => setMatrixInputIsOpen(false)} catlucate={calculate} />
                </div>
            </ReactModal>
        </div>
    )
}

//getting the new matrix added if there's addition or substraction or multiplication for that matrix
export function getMatrix(matrixName){

    const matrixLines = document.getElementById( 'matrixLines').value
    const matrixColumns = document.getElementById( 'matrixColumns').value

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

