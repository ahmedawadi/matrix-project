'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import MatrixAdditionSubstractionInput from '../components/matrixAdditionSubstractionInput'
import MatrixMultiplicationInput from "../components/matrixMultiplicationInput"
import CalculatedMatrices from "../components/calculatedMatrices"
import ReactModal from 'react-modal'
import MatrixInput from "../matrixInput"
import axios from 'axios'
import useSWR from 'swr'

const calcuationResult = ['Résultat de la calculation du déterminant', 'Résultat de la produit matriciel', "Résultat de l'addition matriciel", "Résultat de la soustraction matriciel", "Résultat de la résolution du système", 'Résultat de la calculation du matrice inverse', "Résultat de la transposition de la matrice", 'Résultat de la calculation du rang']
const functionalities = ["Déterminant d'une matrice", "Rang d'une matrice", "Produit matriciel provenant de la gauche", "Produit matriciel provenant de la droite", "Addition/Soustraction", "Inverse d'une matrice", "Transposée d'une matrice"]

//this variables are used for the matrix multiplication
let matrixALines = 1
let matrixAColumns = 1
let matrixBLines = 1
let matrixBColumns = 1
let matrixDeterminantResult = null//will be used if we have calculated the determinant of a matrix
let matrixRankResult = null//will be used if we have calculated the rank of a matrix
let firstCalculatedMatrix = null
let secondCalculatedMatrix = null
const fetcher = (url) => axios.get(url).then(res => res.data)

export function CalculationResult({params}){

    const [matrix, setMatrix] = useState(null)//matrix to display
    const [matrixInputIsOpen, setMatrixInputIsOpen] = useState(false)//used to get the matrix values from the user when the user want to continue calculation with his matrix
    const [actionToTake, setActionToTake] = useState(null)//used to stock the action that we gonna take from the functionnalities of the continuing the calculation
    const [additionOrSubstraction, setAdditionOrSubstraction] = useState(0)//used to choose addition or substraction when the user want to continue the calculation with his matrix
    const matrixId = useSearchParams().get('matrixId')
    const {data, error} = useSWR(getMatrixUrl(params.calculationResult, matrixId), fetcher)

    //this function is used to close the functionalities list when the user click outside of it and outside the button that open it 
    const closeFunctionnalitiesListInOutSideClick = useCallback((event) => {

        const functionnalitiesList = document.getElementById("functionnalitiesList")
        const functionnalitiesListButton = document.getElementById("functionnalitiesListButton")
    
        if(!(functionnalitiesList?.contains(event.target) || functionnalitiesListButton?.contains(event.target)))
            closeFunctionnalitiesList()
            
    })

    useEffect(() => {
        if(typeof window !== 'undefined')
            window.addEventListener('click', closeFunctionnalitiesListInOutSideClick)

        return () => window.removeEventListener('click', closeFunctionnalitiesListInOutSideClick)
    })

    useEffect(() => {
        
        if(data){

            //setting the matrix information data
            if(params.calculationResult == 'determinantCaclucation'){
                matrixDeterminantResult = data.determinant
                setMatrix(data.matrix)
            }
            else if(params.calculationResult == 'rankCalculation')    {      
                matrixRankResult = data.rank
                setMatrix(data.matrix)
            }
            else if(params.calculationResult == 'inverseCalculation')    {      
                firstCalculatedMatrix = data.matrix
                setMatrix(data.inverse)
            }
            else if(params.calculationResult == 'transposeCalculation')    {      
                firstCalculatedMatrix = data.matrix
                setMatrix(data.transpose)
            }
            else{
                firstCalculatedMatrix = data.first_matrix
                secondCalculatedMatrix = data.second_matrix
                setMatrix(data.result)
            }


        }
           

    }, [data])

    const continueCalculation = (functionality) => {

        const matrixCalculationWarning = document.getElementById("matrixCalculationWarning")

        if(matrixCalculationWarning.innerText != '')
            matrixCalculationWarning.innerHTML = ''

        if(functionality == 0){
                //calculation of the determinant of a matrix

                const dataToSend = {
                    matrix : matrix
                }
        
                axios.post('http://192.168.1.16:8000/matrix/determinant/', dataToSend).then(res => {
                    window.open('determinantCaclucation/?matrixId=' + res.data._id, '_blank')
                }).catch(error => {
                    console.log(error)
                })
        }
        else if (functionality == 1){
            //calculation of a rank of a matrix

            const dataToSend = {
                matrix : matrix
            }
    
            axios.post('http://192.168.1.16:8000/matrix/rank/', dataToSend).then(res => {
                window.open('/rankCalculation?matrixId=' + res.data._id, '_blank')
            }).catch(error => {
                console.log(error)
            })
        }
        else if (functionality == 5){
            const dataToSend = {
                matrix : matrix
            }

            axios.post('http://192.168.1.16:8000/matrix/inverse/', dataToSend).then(res => {
                window.open('inverseCalculation?matrixId=' + res.data._id, '_blank')
    
    
                setMatrixInputIsOpen(false)
            }).catch(error => {
                matrixCalculationWarning.innerHTML = "Impossible de calculer l'inverse de cette matrice!"
            })
        }
        else if (functionality == 6){
            const dataToSend = {
                matrix : matrix
            }

            axios.post('http://192.168.1.16:8000/matrix/transpose/', dataToSend).then(res => {
                window.open('transposeCalculation?matrixId=' + res.data._id, '_blank')
    
    
                setMatrixInputIsOpen(false)
            }).catch(error => {
                console.log(error)
            })
        }
        else 
            document.getElementById('functionnalitiesListButton').classList.add('hidden')

        //choosing the action for the displaying of the input and closing the functionnalities list
        setActionToTake(functionality)
        closeFunctionnalitiesList()
    }

    const calculate = () => {
        
        //if it is substractionor addition the matrix will putted on the left side matrix A 
        const newMatrixAdded = actionToTake == 2 ? getMatrix('A') : actionToTake == 3 || actionToTake == 4 ? getMatrix('B') : null
        const dataToSend = {}

        if(!newMatrixAdded)
            return 

        if(actionToTake == 2 || actionToTake == 3 || actionToTake == 4){
            dataToSend['first_matrix'] = actionToTake == 2 ? newMatrixAdded : actionToTake == 3 || actionToTake == 4 ? matrix : null
            dataToSend['second_matrix'] = actionToTake == 3 || actionToTake == 4 ? newMatrixAdded : actionToTake == 2 ? matrix : null

            if(actionToTake == 2 || actionToTake == 3){
                dataToSend['first_matrix_type'] = 'dense'
                dataToSend['second_matrix_type'] = 'dense'
            }
        }

        if(actionToTake == 0 || actionToTake == 1 || actionToTake == 5 || actionToTake == 6)
            dataToSend['matrix'] = matrix
        
        
        //adding the url based on the type of action choosed by the user
        const url = 'http://192.168.1.16:8000/matrix/' + (actionToTake == 2 || actionToTake == 3 ? 'multiply/' : actionToTake == 4 && additionOrSubstraction == 0 ? 'add/' : actionToTake == 4 && additionOrSubstraction ? 'substract/' : null)
        const urlToOpenOnDisplayedMatrix = '/' + (actionToTake == 2 || actionToTake == 3 ? 'multiplicationCalculation/'  : actionToTake == 4 && additionOrSubstraction == 0 ? 'additionCalculation/' : actionToTake == 4 && additionOrSubstraction ? 'substractionCalculation/' : null) + '?matrixId='

        axios.post(url, dataToSend).then(res => {
            window.open(urlToOpenOnDisplayedMatrix + res.data._id, '_blank')


            setMatrixInputIsOpen(false)
        }).catch(error => {
            console.log(error)
        })
    }

    const openMatrixMultiplicationGettingInputData = () => {

        //getting matrices size
        matrixALines = document.getElementById('matrixALines').value
        matrixAColumns = document.getElementById('matrixAColumns').value
        matrixBLines = document.getElementById('matrixBLines').value
        matrixBColumns = document.getElementById('matrixBColumns').value

        if(matrixAColumns == '' || matrixBColumns == '' || matrixALines == '' || matrixBLines == '')
            return

        //get the matrices values
        setMatrixInputIsOpen(true)
    }

    const openMatrixAdditionOrSubstractionInputData = () => {

        matrixALines = document.getElementById('matrixLines').value
        matrixAColumns = document.getElementById('matrixColumns').value
        matrixBLines = matrixALines
        matrixBColumns = matrixAColumns

        if(matrixAColumns == '' || matrixALines == '' )
            return

        //get the matrix values
        setMatrixInputIsOpen(true)
    }

    return (
        matrix && 
        <div className="xl:px-[0px] flex justify-center w-full px-[15px]">
            <div className='xl:px-[50px] xl:w-[70%] w-full bg-[#424143] py-[20px] flex flex-col min-h-screen'>
                <div className='xl:text-[28px] xl:pl-[0px] pl-[20px] w-full flex justify-end font-semibold text-[22px] text-white pb-[20px] border-b-[0.5px] border-[#4a4a4a] font-serif shadow-[0_1px_0_rgba(10,10,10,0.5)]'>
                    {
                        getResultTitle(params.calculationResult)
                    }
                </div>
                <div className="xl:pt-[40px] xl:text-[22px] pt-[30px] pl-[15px] text-[#b5b5b5] text-[18px]">
                    Ici, vous trouverez le résultat de votre calcul et vous pourrez l'utiliser pour continuer le calcul en fonction de celui-ci. Vous pouvez également voir ce que vous avez calculé.                </div>
                <div className='pt-[30px] flex flex-col space-y-[30px] text-[#b5b5b5] text-[18px] xl:pt-[50px]'>
                    <div className="w-full flex flex-col items-center justify-center">
                        <div id="calculatedMatrices" className="hidden flex flex-col space-y-[20px] w-full pb-[20px] mb-[30px] border-[1px] border-[#4a4a4a] shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)] ">
                            <div className="xl:text-[28px] pl-[20px] font-serif text-[22px] font-extrabold">
                                {
                                    params.calculationResult == 'inverseCalculation' || params.calculationResult == 'transposeCalculation' ? 'La matrice calculée' : 'Les matrice calculées'
                                }
                            </div>
                            <CalculatedMatrices calcultionType={params.calculationResult} firstMatrix={firstCalculatedMatrix} secondMatrix={secondCalculatedMatrix} />
                        </div>
                        <div className={"flex flex-col items-center w-full"}>
                            <div className="flex space-x-[10px]">
                                {
                                    params.calculationResult == 'determinantCaclucation' || params.calculationResult == 'rankCalculation' ? null :
                                    <button id="displayCalculatedMatricesButton" className="relative font-semibold border-2 border-[#575757] hover:border-[#4a4a4a] rounded-[5px] text-white px-[10px] py-[5px] hover:shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)]" onClick={seeCalculatedMatrices}>
                                        voir les matrices calculées     
                                    </button>
                                }
                                <div className="relative">
                                    <button id="functionnalitiesListButton" className="font-semibold border-2 border-[#575757] hover:border-[#4a4a4a] rounded-[5px] text-white px-[10px] py-[5px] hover:shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)]" onClick={openFunctionnalitiesList}>
                                        {
                                            params.calculationResult == 'determinantCaclucation' ? 'Recalculer' : 'Continuer le calcul'
                                        }
                                    </button>
                                    <div id="functionnalitiesList" className="hidden absolute right-0 w-[300px] flex flex-col border-y-[2px] border-[#4a4a4a] top-[45px] backgroundImage" >
                                        {
                                            functionalities.map((functionality, index) => (matrix && matrix?.length != matrix[0]?.length) && (index == 0 || index == 1 || index == 5) ? null : <div key={index} className="py-[10px] px-[20px] border-b-[0.5px] border-[#4a4a4a] cursor-pointer px-[15px] py-[10px] hover:text-white hover:bg-[url('../public/titleFont.png')]" onClick={() => continueCalculation(index)}>
                                                {
                                                    functionality
                                                }
                                            </div>)
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="w-full mt-[20px]">
                            {
                                actionToTake == 2 || actionToTake == 3 ? <MatrixMultiplicationInput openMatrixMultiplication={openMatrixMultiplicationGettingInputData} matrixLines={matrix?.length} matrixColumns={matrix[0]?.length} matrixName={actionToTake == 2 ? 'R' : actionToTake == 3 ? 'L' : ''}  /> : 
                                    actionToTake == 4 ? <MatrixAdditionSubstractionInput matrixLines={matrix.length} matrixColumns={matrix[0].length} setAdditionOrSubstraction={setAdditionOrSubstraction} additionOrSubstraction={additionOrSubstraction} getMatrix={openMatrixAdditionOrSubstractionInputData} /> : null

                            }
                            </div>

                        </div>            
                    </div>
                    <div className='xl:px-[30px] px-[10px] py-[40px] min-h-[200px] border-[1px] border-[#4a4a4a] shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)] flex flex-col justify-center space-y-[25px]'>
                        <div className="text-[25px] font-serif">
                            Résultat :
                        </div>
                        <div className="flex justify-center">
                            <div className="overflow-x-auto">
                                <table className="border-collapse border border-[#c2c2c2]">
                                    <thead>
                                        <tr>
                                            {
                                                Array.from({length : Number(matrix[0]?.length) + 1}).map((_, index) => index === 0 ? <th key={index} className="border border-[#c2c2c2] border-[2px]"></th> :
                                                    <th key={index} className="xl:text-[22px] text-[18px] font-extrabold text-[#c2c2c2] border border-[#c2c2c2] border-[2px]">
                                                        <div className="px-[3px] flex justify-center">
                                                            {
                                                                params.calculationResult == 'systemSolvingCalculation' ? 'X' : 'C'
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            Array.from({length : matrix?.length}).map((_, lineIndex) => <tr key={lineIndex} className="border border-[#c2c2c2] border-[2px]">
                                                <td className="xl:text-[22px] xl:p-[5px] p-[2px] text-[18px] font-extrabold text-[#c2c2c2] border border-[#c2c2c2] border-[2px]">
                                                    {
                                                        Number(lineIndex) + 1
                                                    }
                                                </td>
                                                {
                                                    Array.from({length : matrix[0]?.length}).map((_, columnIndex) => <td key={columnIndex} className="xl:text-[22px] text-[15px] border border-[#c2c2c2] border-[2px]">
                                                        <div className="flex justify-center items-center text-white">
                                                            {
                                                                matrix[lineIndex][columnIndex]
                                                            }
                                                        </div>
                                                    </td>)
                                                }
                                            </tr>)
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div id="matrixCalculationWarning" className="text-[#c92a1e] text-[18px]"></div>
                        {   
                            params.calculationResult == 'determinantCaclucation' ? <div>
                            {
                                'Déterminant de la matrice = ' + (Math.round(matrixDeterminantResult * 100) / 100)
                            }    
                            </div> : params.calculationResult == 'rankCalculation' ? <div>
                            {
                                'Rang de la matrice = ' + matrixRankResult
                            }    
                            </div> : null
                        }
                    </div>
                </div>
            </div>
            <ReactModal ariaHideApp={false} isOpen={matrixInputIsOpen} overlayClassName={'xl:justify-center xl:items-center fixed top-0 left-0 right-0 bottom-0 w-full flex bg-black bg-opacity-60 overflow-auto'} className={'flex space-x-[20px] outline-none'}>
                <div className="flex justify-center items-center">
                    <MatrixInput matrixLines={matrixALines} matrixColumns={matrixAColumns} matrixName={'A'} matrix={actionToTake == 3 || actionToTake == 4 ? matrix : null} />
                </div>
                <div className="">
                    <MatrixInput matrixLines={matrixBLines} matrixColumns={matrixBColumns} matrixName={'B'} closeMatrix={() => setMatrixInputIsOpen(false)} catlucate={calculate} matrix={actionToTake == 2 ? matrix : null} />
                </div>
            </ReactModal>
        </div>

    )
}

//this function is used to close the functionalities list 
function closeFunctionnalitiesList(){

    const functionnalitiesList = document.getElementById("functionnalitiesList")

    if(!functionnalitiesList?.classList?.contains('hidden'))
        functionnalitiesList?.classList?.add('hidden')
}

//this function is used to open the functionalities list 
function openFunctionnalitiesList(){
    
    const functionnalitiesList = document.getElementById("functionnalitiesList")

    if(functionnalitiesList.classList.contains('hidden'))
        functionnalitiesList.classList.remove('hidden')
}

//getting the new matrix added if there's addition or substraction or multiplication for that matrix
function getMatrix(matrixName){

    const matrixLines = matrixName == 'A' ? matrixALines : matrixBLines 
    const matrixColumns = matrixName == 'A' ? matrixAColumns : matrixBColumns 

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

//used to put the result title based on the dynamic page joining
function getResultTitle(joinedPage){

    const possibePages = ['determinantCaclucation', 'multiplicationCalculation', 'additionCalculation', 'substractionCalculation', 'systemSolvingCalculation', 'inverseCalculation', 'transposeCalculation', 'rankCalculation']

    if(joinedPage == possibePages[0])
        return calcuationResult[0]
    else if (joinedPage == possibePages[1])
        return calcuationResult[1]
    else if (joinedPage == possibePages[2])
        return calcuationResult[2]
    else if (joinedPage == possibePages[3])
        return calcuationResult[3]
    else if (joinedPage == possibePages[4])
        return calcuationResult[4]
    else if (joinedPage == possibePages[5])
        return calcuationResult[5]
    else if (joinedPage == possibePages[6])
        return calcuationResult[6]
    else if (joinedPage == possibePages[7])
        return calcuationResult[7]

}

//this function is used to return the url that we need to fetch on it 
function getMatrixUrl(typeCalculation, matrixId){

    if(typeCalculation == 'determinantCaclucation')
        return 'http://192.168.1.16:8000/matrix/determinant/' + matrixId + '/'

    else if(typeCalculation == 'rankCalculation')
        return 'http://192.168.1.16:8000/matrix/rank/' + matrixId + '/'
    
    else if(typeCalculation == 'systemSolvingCalculation')
        return 'http://192.168.1.16:8000/matrix/solve/' + matrixId + '/'

    else if(typeCalculation == 'multiplicationCalculation')
        return 'http://192.168.1.16:8000/matrix/multiply/' + matrixId + '/'
    
    else if(typeCalculation == 'additionCalculation')
        return 'http://192.168.1.16:8000/matrix/add/' + matrixId + '/'
    
    else if(typeCalculation == 'substractionCalculation')
        return 'http://192.168.1.16:8000/matrix/substract/' + matrixId + '/'
    
    else if(typeCalculation == 'inverseCalculation')
        return 'http://192.168.1.16:8000/matrix/inverse/' + matrixId + '/'

    else if(typeCalculation == 'transposeCalculation')
        return 'http://192.168.1.16:8000/matrix/transpose/' + matrixId + '/'

}

//this function is used to see the calculated matrices to get that result
function seeCalculatedMatrices(){

    const seeCalculatedMatricesButton = document.getElementById('displayCalculatedMatricesButton')
    const calculatedMatrices = document.getElementById('calculatedMatrices')

    if(calculatedMatrices.classList.contains('hidden')){
        calculatedMatrices.classList.remove('hidden')

        if(seeCalculatedMatricesButton.innerText.includes('la matrice'))
            seeCalculatedMatricesButton.innerHTML = 'masquer la matrices calculée'
        else 
            seeCalculatedMatricesButton.innerHTML = 'masquer les matrices calculées'
    }
    else {
        calculatedMatrices.classList.add('hidden')
        
        if(seeCalculatedMatricesButton.innerText.includes('la matrice'))
            seeCalculatedMatricesButton.innerHTML = 'voir la matrices calculée'
        else 
            seeCalculatedMatricesButton.innerHTML = 'voir les matrices calculées'
    }


}