'use client'

import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function MatrixInput({matrixLines, matrixColumns, matrixName, closeMatrix, catlucate}){

    const fillEmptyCellsWithZeros = () => {
        
        for(let i=0; i<matrixLines; i++){
            for(let j=0; j<matrixColumns; j++){
                const matrixElement = document.getElementById(matrixName + i + j) 

                if(matrixElement.value === '')
                    matrixElement.value = 0
            }
        }
    }

    const clearMatrixValues = () => {
        
        for(let i=0; i<matrixLines; i++){
            for(let j=0; j<matrixColumns; j++){
                const matrixElement = document.getElementById(matrixName + i + j) 

                if(matrixElement.value !== '')
                    matrixElement.value = ''
            }
        }
    }

    return ( 
        matrixColumns && matrixLines && matrixName &&
        <div className=" p-[2px] bg-[url('../public/titleFont.png')]">
            <div className="flex flex-col w-full h-full">
                <div className="w-full basis-[10%] flex relative justify-center py-[3px] text-[25px] text-white font-serif font-bold">
                    <div>
                        Matrix input
                    </div>
                    {
                        closeMatrix ? <FontAwesomeIcon className="text-white absolute top-[5px] right-[5px] bg-[#424143] p-[5px] cursor-pointer rounded-[10px]" icon={faClose} onClick={closeMatrix}/> : null
                    }
                </div>
                <div className="w-full basis-[90%] bg-[#424143] flex flex-col space-y-[15px] justify-center items-center px-[70px] py-[50px]">
                    <table className="border-collapse border border-[#c2c2c2]">
                        {
                            Array.from({length : Number(matrixColumns) + 1}).map((_, index) => index === 0 ? <th  className="border border-[#c2c2c2] border-[2px]"></th> :
                                <th key={index} className="font-extrabold text-[22px] text-[#c2c2c2] border border-[#c2c2c2] border-[2px]">
                                    <div className="flex justify-center w-full">
                                        {
                                            matrixName
                                        }
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
                            Array.from({length : matrixLines}).map((_, lineIndex) => <tr key={lineIndex} className="border border-[#c2c2c2] border-[2px]">
                                <td className="font-extrabold text-[22px] text-[#c2c2c2] border border-[#c2c2c2] border-[2px] p-[5px]">
                                    {
                                        Number(lineIndex) + 1
                                    }
                                </td>
                                {
                                    Array.from({length : matrixColumns}).map((_, columnIndex) => <td key={columnIndex} className="p-[5px] border border-[#c2c2c2] border-[2px]">
                                        <input type="number" id={matrixName + lineIndex + columnIndex} className="p-[5px] w-[60px] h-[40px] hover:bg-[url('../public/titleFont.png')] focus:bg-[url('../public/titleFont.png')] text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                    </td>)
                                }
                            </tr>)
                        }
                    </table>
                    <div className="flex space-x-[40px]">
                        <button className="font-semibold border-2 hover:border-[#4a4a4a] rounded-[10px] border-[#737373] text-white px-[10px] py-[5px] hover:shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)] text-[22px]" onClick={clearMatrixValues}>
                            Clear
                        </button>
                        <button className="font-semibold border-2 hover:border-[#4a4a4a] rounded-[10px] border-[#737373] text-white px-[10px] py-[5px] hover:shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)] text-[22px]" onClick={fillEmptyCellsWithZeros}>
                            Fill empty cells with zeros
                        </button>
                    </div>
                    {
                        catlucate ? 
                        <button className="font-semibold border-2 hover:border-[#4a4a4a] rounded-[10px] border-[#737373] text-white px-[10px] py-[5px] hover:shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)] text-[22px]" onClick={catlucate}>
                            Calculate
                        </button> : null
                    }
                </div>
            </div>
        </div>
    )
}