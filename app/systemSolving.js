'use client'

import { useCallback, useEffect, useState } from "react"
import ReactModal from "react-modal"
import MatrixInput from "./matrixInput"
import {checkMatrixSize} from "./matrixInverse"
import axios from "axios"
import { faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { closeMatricesTypeList, openmatricesTypeList } from "./multpilcationMatrices"

let matrixSize = 1
let bandSize = 1
const algorthims = [ "Méthode de matrice triangulaire par choix", "Méthode de Gauss avec pivotage partiel", "Méthodes d’élimination de Gauss", "Méthode de Gauss Jordan", "Méthode de décomposition LU", "Méthode de Cholesky", "Méthode de Jacobi", "Méthode de Gauss-Seidel" ]//algorthims that will be choosed to sovle the system
const triangularSystemMatricesType = ["Matrice inférieure dense", "Matrice supérieure dense", "Matrice inférieure demi-bande", "Matrice supérieure demi-bande"]
const EG_LU__EGJ_matricesType = ["Matrice dense (Symétrique définie positive)", "Matrice bande (Symétrique définie positive)"]
const EGPP_cholesky_matricesType = ["Matrice dense non symétrique", "Matrice bande non symétrique"]
let matricesTypeList = triangularSystemMatricesType//it will contains the list that we need to choose from it

export default function SystemSolving(){

    const [matrixInputIsOpen, setMatrixInputIsOpen] = useState(false)
    const [algorithm, setAlgorithm] = useState(0)//by default the Gauss algorithm will be used
    const [matrixType, setMatrixType] = useState(0)//it will be used with the algorithms that needs the choose of specific type of matrices


    /*this functions are used to handle the list of matices types that the user will choose */

    //this function is used to close the functionalities list when the user click outside of it and outside the button that open it 
    const closeTypeMatricesListInOutSideClick = useCallback((event) => {

        const matricesTypeList = document.getElementById("matricesTypeList")
        const matricesTypeListButton = document.getElementById("matricesTypeListButton")
        
        if(!(matricesTypeList?.contains(event.target) || matricesTypeListButton?.contains(event.target)))
            closeMatricesTypeList()
            
    })

    useEffect(() => {
        
        if(typeof window !== 'undefined'){

            //addition of the outside click of the matrix type list to the listenner functionalities
            addEventListener('click', closeTypeMatricesListInOutSideClick)
        }

        return () => {
            removeEventListener('click', closeTypeMatricesListInOutSideClick)
        }

    }, [])
    //this function is used just to selet which matrix type will we use
    const chooseMatrixType = (matrixType) => {

        //we'll check if there's any previous warning to remove it when we change the matrix type
        const matrixABandWarning = document.getElementById('matrixABandWarning')

        if( matrixABandWarning && matrixABandWarning.innerText != '')
            matrixABandWarning.innerHTML = ''

        setMatrixType(matrixType)
        closeMatricesTypeList()
    }

    //this function is used to get the values of a matrix with a specific size
    const getMatrix = () => {

        matrixSize = document.getElementById('matrixSize').value

        //getting the band of the matrix and check it if the algorithm works with band matrix
        if(([1, 2, 3, 4, 5].includes(algorithm) && matrixType == 1) || (algorithm == 0 && [2, 3].includes(matrixType))){

            const matrixBand = document.getElementById('matrixBand')//used if we gonna work with band matrices
            const matrixBandWarning = document.getElementById('matrixBandWarning')

            if(matrixBand.value == ''){
                matrixBandWarning.innerHTML = 'Ajouter la bande de la matrice!'
                return
            }
            else if ((Number(matrixBand.value) + 1) >= Number(matrixSize)){
                matrixBandWarning.innerHTML = "taille de la bande ne s'applique pas à la matrice"
                return
            }
            else 
                bandSize = matrixBand.value

            if(matrixBandWarning.innerText != '')
                matrixBandWarning.innerHTML = ''

        }

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
                vector : systemData[1],
                    matrix_type: getMatrixTypeNameOnTheServer(algorithm, matrixType),
        }

        //only triangular matrices do not require the addition of the algorithm name
        if(algorithm != 0)
            dataToSend["algorithm"] = getAlgorithmNameOnTheServer(algorithm, matrixType)

        //addition of the band size for the banded matrices
        if(([1, 2, 3, 4, 5].includes(algorithm) && matrixType == 1) || (algorithm == 0 && [2, 3].includes(matrixType)))
            dataToSend['m'] = bandSize
        
        axios.post('https://matrixapi-ez2e.onrender.com/matrix/solve/', dataToSend).then(res => {
            window.open('/systemSolvingCalculation?matrixId=' + res.data._id, '_blank')

            const matrixWarning = document.getElementById('matrixWarning')

            if(matrixWarning.innerText != '')
                matrixWarning.innerHTML = ''

            setMatrixInputIsOpen(false)
        }).catch(error => {
            
            if(error?.response?.status == 400){
                const matrixWarning = document.getElementById('matrixWarning')

                matrixWarning.innerHTML = "Impossible de résoudre cette matrice"
            }
        })

    }

    const chooseAlgorithm = (algorithm) => {
        setAlgorithm(algorithm)
        setMatrixType(0)
        
        matricesTypeList = (algorithm == 0 ? triangularSystemMatricesType : [1, 5].includes(algorithm) ? EGPP_cholesky_matricesType : [2, 3, 4].includes(algorithm)? EG_LU__EGJ_matricesType : [])

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
                                <label className="flex space-x-[15px] w-fit">
                                    <div>
                                        {
                                            algorithmName
                                        }
                                    </div>
                                    <input type="radio" checked={index == algorithm} className="accent-black w-[15px]" onClick={() => chooseAlgorithm(index)} /> 
                                </label>
                            </li>)
                        }
                        
                    </ul>
                </div>
                <div className={"w-[80%] font-bold border-2 relative" + ([6, 7].includes(algorithm) ? " hidden" : "")}>
                    <div id="matricesTypeListButton" className="flex justify-between px-[10px] py-[5px] cursor-pointer h-[45px]" onClick={openmatricesTypeList}>
                        <div>
                            Types des matrices
                        </div>
                        <FontAwesomeIcon className="mt-[5px] w-fit" size="lg" icon={faChevronDown} />
                    </div>
                    <ul id="matricesTypeList" className="bg-[#424143] text-[#b5b5b5] max-h-[200px] overflow-y-auto hidden absolute border-y-2 border-x-2 font-bold top-[50px] right-0 w-full">
                        {   
                            matricesTypeList.map((matrixTypeName, index) => <li key={index} className={"text-[20px] font-bold cursor-pointer hover:text-white hover:bg-[url('../public/titleFont.png')]" + (index != matricesTypeList.length - 1 ? " border-b-[3px]" : '')}>
                                <label className="flex justify-between items-center px-[15px]" onClick={() => chooseMatrixType(index)}>
                                    <div>
                                        {
                                            matrixTypeName
                                        }
                                    </div>
                                    {
                                        index === matrixType ? <FontAwesomeIcon icon={faCheck} /> : null
                                    }
                                </label>
                            </li>)
                        }
                        
                    </ul>
                </div> 
                <div className="flex flex-col space-y-[25px] items-center justify-center xl:px-[30px] xl:py-[0px] py-[5px] px-[10px] border-[1px] border-[#4a4a4a] shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)] w-full xl:h-[200px]">
                    {   
                        (([1, 2, 3, 4, 5].includes(algorithm) && matrixType == 1) || (algorithm == 0 && [2, 3].includes(matrixType)))?
                        <div className="flex flex-col w-full">
                            <div className="font-extrabold flex items-center space-x-[15px] w-full">
                                <div>
                                    * Ajouter la taille du bande de la matrice : 
                                </div>
                                <input type='number' id="matrixBand" defaultValue={'1'} className='w-[50px] h-[30px] mt-[5px] p-[5px] text-[18px] font-medium text-black hover:bg-[url("../public/titleFont.png")] focus:bg-[url("../public/titleFont.png")]' onChange={(event) => checkPositiveValue(event)}/>
                            </div>
                            <div id="matrixBandWarning" className="text-[#c92a1e] text-[18px]"></div>
                        </div> : null
                    }
                    <div className='flex xl:flex-row flex-col space-y-[15px] xl:space-y-[0px] justify-center space-x-[25px] items-center'>
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
            </div>
            <ReactModal ariaHideApp={false} isOpen={matrixInputIsOpen} overlayClassName={'fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-60' } className={'flex overflow-auto outline-none'}>
                <div className="flex justify-center items-center">
                    <MatrixInput matrixType={getMatrixType(algorithm, matrixType)}  bandSize={bandSize} matrixLines={matrixSize} matrixColumns={matrixSize} matrixName={'X'} closeMatrix={() => setMatrixInputIsOpen(false)} containsBVector={true} catlucate={calculate}  />
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

            const matrixElement = document.getElementById(matrixName + i + j)

            if(!matrixElement)
                matrixLine.push(0)
            else if(matrixElement.value == '')
                return null
            else
                matrixLine.push(Number(matrixElement.value))


        }

        matrix.push(matrixLine)
    }

    return [matrix, vector]
}

//used to get the matrix type that we'll pass in the input
function getMatrixType(algorithm, matrixType){

    if(algorithm == 0){
        switch(matrixType){
            case 0 : //inferior matrix
                return 1
            case 1 ://superior matrix
                return 0
            case 2 : //inferior band matrix
                return 4
            case 3 ://superior band matrix
                return 3
        }
    }
    else if([2, 3, 4].includes(algorithm)){
        switch(matrixType){
            case 0 : //symetric matrix
                return 5
            case 1 ://symetric band matrix
                return 6
        }
    }
    else if ([1, 5].includes(algorithm)){
        switch(matrixType){
            case 0 : //dense matrix
                return undefined
            case 1 ://band matrix
                return 2
        }
    }

}

//used to get the matrix type name on the server t
function getMatrixTypeNameOnTheServer(algorithm, matrixType){

    if(algorithm == 0){
        switch(matrixType){
            case 0 : //inferior matrix
                return "lower"
            case 1 ://superior matrix
                return "upper"
            case 2 : //inferior band matrix
                return  "lower banded"
            case 3 ://superior band matrix
                return "upper banded"
        }
    }
    else if ([1, 2, 3, 4, 5].includes(algorithm)){
        switch(matrixType){
            case 0 : //dense matrix
                return "dense"
            case 1 ://band matrix
                return "banded"
        }
    }

}

export function checkPositiveValue(event){
    if(event.target.value < 0)
        event.target.value = ''
}

//this function will be used to get the algorithm name on the server based on the algorithm and matrix type
function getAlgorithmNameOnTheServer(algorithm, matrixType){
    switch(algorithm){
        //case 0 is triangular algorithm so we don't need to send the algorithm name
        case 1 : {//gauss avec pivotage
            return matrixType == 0 ?  "pivot partiel gauss dense" : "pivot partiel gauss banded"
        }
        case 2 : {//gauss ave elimination
            return matrixType == 0 ? "gauss elimination symmetric dense matrix" : "gauss eliminatoion symmetric banded matrix"
        }
        case 3 : {//gauss jordan
            return matrixType == 0 ? "gauss jordan symmetric dense matrix" : "gauss jordan symmetric banded matrix"
        }
        case 4 : {//decomposition LU
            return matrixType == 0 ? "LU dense symmetric" :"LU banded symmetric"
        }
        case 5 : {//cholesky
            return matrixType == 0 ? "cholesky dense" : "cholesky banded"
        }
        case 6 : {//jacobi
            return "jacobi"
        }
        case 7 : {//gauss seidel
            return "gauss-seidel"
        }
    }
}