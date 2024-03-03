'use client'

import MatrixFunctionalities from '../components/functionalitiesList'
import MultiplicationMatrices from '../multpilcationMatrices'
import SystemSolving from '../systemSolving'
import { useState } from 'react'
import MatrixInverse from '../matrixInverse'
import MatrixTranspose from '../matrixTranspose'
import Determinant from '../determinant'
import AdditionSubstraction from '../additionSubstraction'
import MatrixRank from '../rank'

export default function MatrixOperations({functionnalities, multiplicationPageData}){

    const [matrixFunctionnality, setMatrixFunctionnality] = useState(0)//used to choose which matrix functionality will be displayed to the user

    return (
        <div className='flex flex-col md:flex-row md:space-x-[10px]  md:space-y-[0px] space-y-[10px] md:w-[80%] w-full'>
                <div>
                    <MatrixFunctionalities functionalities={functionnalities} selectedFunctionality={matrixFunctionnality} setMatrixFunctionnality={setMatrixFunctionnality} />
                </div>
                {
                    matrixFunctionnality === 0 ?
                        <MultiplicationMatrices multiplicationPageData={multiplicationPageData}/> : matrixFunctionnality === 1 ? 
                            <SystemSolving /> : matrixFunctionnality === 2 ? 
                                < MatrixInverse /> : matrixFunctionnality === 3 ? 
                                    < MatrixTranspose /> : matrixFunctionnality === 4 ? 
                                        < Determinant /> : matrixFunctionnality === 5 ? 
                                            < AdditionSubstraction /> : matrixFunctionnality === 6 ?
                                                <MatrixRank /> : null
                }
                
            </div>
    )
}