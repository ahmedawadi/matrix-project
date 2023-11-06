'use client'

import MatrixFunctionalities from './components/functionalitiesList'
import MultiplicationMatricesDenses from './multpilcationMatricesDense'
import { useState } from 'react'
import MatrixInverse from './matrixInverse'

export default function Home(){

    const [matrixFunctionnality, setMatrixFunctionnality] = useState(0)//used to choose which matrix functionality will be displayed to the user
    return (
        <div className='pl-[150px]'>
            
            <div className='flex space-x-[10px] w-[80%]'>
                <div>
                    <MatrixFunctionalities selectedFunctionality={matrixFunctionnality} setMatrixFunctionnality={setMatrixFunctionnality} />
                </div>
                {
                    matrixFunctionnality === 0 ?
                        <MultiplicationMatricesDenses /> : matrixFunctionnality === 1 ? 
                            null : matrixFunctionnality === 2 ? 
                                < MatrixInverse /> : null
                }
                
            </div>
            
        </div>
    )
}