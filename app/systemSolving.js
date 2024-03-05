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

export default function SystemSolving({systemResolutionPageData, inputText}){

    const [matrixInputIsOpen, setMatrixInputIsOpen] = useState(false)
    const [matricesTypeList, setMatricesTypeList] = useState([])//it will contains the list that we need to choose from it
    const [algorithm, setAlgorithm] = useState(0)//by default the Gauss algorithm will be used
    const [matrixType, setMatrixType] = useState(0)//it will be used with the algorithms that needs the choose of specific type of matrices
    const [isLoading, setIsLoading] = useState(false)//it will be used when we are waiting for the calculation
    const [iterativeMethod, setIterativeMethod] = useState(0)//it will be used in iterative method to indicate if the user want to work with maximal number of iterations or with epsilon

    //this function is used to close the functionalities list when the user click outside of it and outside the button that open it 
    const closeAlgorithmsTypesListInOutSideClick = useCallback((event) => {

        const algorithmsTypeList = document.getElementById("algorithmsTypeList")
        const algorithmsTypeListButton = document.getElementById("algorithmsTypeListButton")
        
        if(!(algorithmsTypeList?.contains(event.target) || algorithmsTypeListButton?.contains(event.target)))
            closeAlgorithmsTypeList()
            
    })

    useEffect(() => {
        
        if(typeof window !== 'undefined'){

            //addition of the outside click of the matrix type list to the listenner functionalities
            addEventListener('click', closeAlgorithmsTypesListInOutSideClick)
        }

        setMatricesTypeList(systemResolutionPageData.matrixTypes)

        return () => {
            removeEventListener('click', closeAlgorithmsTypesListInOutSideClick)
        }

    }, [])

    /*this functions are used to handle the list of matices types that the user will choose */

    //this function is used to close the functionalities list when the user click outside of it and outside the button that open it 
    const closeTypeMatricesListInOutSideClick = useCallback((event) => {

        const matricesTypeList = document.getElementById("matricesTypeList")
        const matricesTypeListButton = document.getElementById("matricesTypeListButton")
        
        //matricesTypeList and matriceTypeListButton can be null when we are dealing with iterative methods
        if( matricesTypeList && matricesTypeListButton && !(matricesTypeList?.contains(event.target) || matricesTypeListButton?.contains(event.target)))
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
        if(matrixType == 1 && ([1, 2, 3, 4, 5].includes(algorithm)) || (algorithm == 0 && [2, 3].includes(matrixType))){

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
        else if([6, 7].includes(algorithm)){ //checking the addition of the number of iterations if we're working with iteratives methods
            const iterationsNumber = document.getElementById("iterationsNumber")
            const iterationsNumberWarning = document.getElementById("iterationsNumberWarning")
            const epsilon = document.getElementById("Epsilon")
            const epsilonWarning = document.getElementById("EpsilonWarning")
            
            if(iterativeMethod == 1){
                if(iterationsNumber.value == ''){
                    iterationsNumberWarning.innerHTML = "Nombre d'itérations ne peut pas être vide!"
                    return 
                }
                else if (iterationsNumber.value == 0){
                    iterationsNumberWarning.innerHTML = "Nombre d'itérations ne peut pas être 0!"
                    return 
                }
                else if (iterationsNumberWarning.innerText != '')
                    iterationsNumberWarning.innerHTML = ''
            }
            else{//checking the addition of epsilon and the epsilon value (it can not be larger than 1)
                
                if(epsilon.value == ''){
                    epsilonWarning.innerHTML = "Epsilon ne peut pas être vide!"
                    return 
                }
                else if (epsilon.value == 0){
                    epsilonWarning.innerHTML = "Epsilon ne peut pas être 0!"
                    return 
                }
                else if (epsilon.value >= 1){
                    epsilonWarning.innerHTML = "Epsilon doit être inférieure à 1!"
                    return 
                }
                else if (epsilonWarning.innerText != '')
                    epsilonWarning.innerHTML = ''
            }
            
        }

        //get the matrix values
        setMatrixInputIsOpen(true)

    }

    const calculate = () => {
        
        const systemData = getSystemToSolveData('X', 'b', matrixSize)
        const calculateButton = document.getElementById("calculateButton")//will be used to animate the button when it is waiting for the calculation
        const systemWarning = document.getElementById('matrixWarningX')

        if(!systemData){
            systemWarning.innerHTML = "Il y a des cellules vides!"
            return 
        }
        else if(systemWarning.innerText != '')
            systemWarning.innerHTML = ''

        //system data is on that form [matrix, vector]
        if(!(systemData[0] && systemData[1]))
            return

        setIsLoading(true)
        calculateButton.classList.add("opacity-40")
        calculateButton.disabled = true

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

        //addition of the iterations number when we are working with iterative methods
        //iterations number already checked that the user have added it  
        if([6, 7].includes(algorithm)){
            if(iterativeMethod == 1)
                dataToSend["max_iteration"] = document.getElementById("iterationsNumber").value
            else 
                dataToSend["epsilon"] = document.getElementById("Epsilon").value
        }
        axios.post(process.env.backendDomainName + '/matrix/solve/', dataToSend, {timeout: 12000}).then(res => {
            window.open('/systemSolvingCalculation?matrixId=' + res.data._id, '_blank')

            setIsLoading(false)
            calculateButton.classList.remove("opacity-40")
            calculateButton.disabled = false
            setMatrixInputIsOpen(false)
        }).catch(error => {
            console.log(error)
            if(error?.response?.status == 400 && error.response?.data?.message)
                systemWarning.innerHTML = error.response.data.message
            else
                systemWarning.innerHTML = "essayer une autre fois!"

            setIsLoading(false)
            calculateButton.classList.remove("opacity-40")
            calculateButton.disabled = false
        })

    }

    const chooseAlgorithm = (algorithm) => {

        setAlgorithm(algorithm)
        setMatrixType(0)
        closeAlgorithmsTypeList()
        
        setMatricesTypeList(algorithm == 0 ? systemResolutionPageData.triangularSystemMatricesType : [1, 5].includes(algorithm) ? systemResolutionPageData.EGPP_cholesky_matricesType : [2, 3, 4].includes(algorithm)? systemResolutionPageData.EG_LU__EGJ_matricesType : [])

    }

    return (
        <div className='xl:basis-[80%] bg-[#424143] py-[20px] xl:px-[50px] px-[15px]  flex flex-col'>
            <div className='w-full flex justify-end font-semibold text-[28px] text-white pb-[20px] border-b-[0.5px] border-[#4a4a4a] font-serif shadow-[0_1px_0_rgba(10,10,10,0.5)]'>
                {
                    systemResolutionPageData.pageName
                }
            </div>
            <div className='xl:pt-[80px] xl:text-[22px] pt-[30px] flex flex-col space-y-[30px] text-[#b5b5b5] text-[18px]'>
                <div>
                    {
                        systemResolutionPageData.pageDesc
                    }
                    <div className="mt-[45px]">
                        {
                            systemResolutionPageData.algorithmTypeDec
                        }
                    </div>
                    <div className=" mt-[15px] w-full flex space-x-[10px]">
                        <div className="w-[80%] font-bold flex flex-col space-y-[4px]">
                            <div id="algorithmsTypeListButton" className="flex justify-between items-center border-2 px-[10px] py-[5px] cursor-pointer text-[16px] sm:text-[22px]" onClick={openAlgorithmsTypeList}>
                                <div>
                                {
                                    systemResolutionPageData.algorithms[algorithm]
                                }
                                </div>
                                <FontAwesomeIcon className="mt-[5px] w-fit" size="lg" icon={faChevronDown} />
                            </div>
                            <ul id="algorithmsTypeList" className="bg-[#424143] text-[#b5b5b5] max-h-[200px] overflow-y-auto hidden border-y-2 border-x-2 font-bold w-full">
                                {
                                    systemResolutionPageData.algorithms.map((algorithmName, index) => <li key={index} className={"text-[20px] font-bold cursor-pointer hover:text-white hover:bg-[url('../public/titleFont.png')]" + (index != systemResolutionPageData.algorithms.length - 1 ? " border-b-[3px]" : '')}>
                                        <label className="flex justify-between items-center px-[15px]" onClick={() => chooseAlgorithm(index)}>
                                            <div>
                                                {
                                                    algorithmName
                                                }
                                            </div>
                                            {
                                                index === algorithm ? <FontAwesomeIcon icon={faCheck} /> : null
                                            }
                                        </label>
                                    </li>)
                                }
                                
                            </ul>
                        </div>
                    </div>
                </div>
                {
                    ![6, 7].includes(algorithm) ? <>
                            <div className="mt-[45px] pr-[15px]">
                            {
                                systemResolutionPageData.matrixTypeDec
                            }
                        </div>
                        <div className="w-[80%] font-bold flex flex-col space-y-[4px]">
                            <div id="matricesTypeListButton" className="flex items-center justify-between border-2 px-[10px] py-[5px] cursor-pointer w-full sm:h-[45px] text-[16px] sm:text-[22px]" onClick={openmatricesTypeList}>
                                <div>
                                    {
                                        matricesTypeList[matrixType]
                                    }
                                </div>
                                <div>
                                    <FontAwesomeIcon className="mt-[5px] w-fit" size="lg" icon={faChevronDown} />
                                </div>
                            </div>
                            <ul id="matricesTypeList" className="bg-[#424143] text-[#b5b5b5] max-h-[200px] overflow-y-auto hidden border-y-2 border-x-2 font-bold w-full">
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
                    </> : <>
                        <div className="mt-[45px] pr-[15px]">
                            {
                                systemResolutionPageData.chooseStopCondition
                            }
                        </div>
                        <ul className="list-disc sm:px-[45px] px-[15px]">
                            {
                                systemResolutionPageData.iterativeMethodsTypes.map((iterativeMethodType, index) => <li key={index} className="w-full">
                                    <label className="flex justify-between w-full font-semibold">
                                        <div>
                                            {
                                                iterativeMethodType
                                            }
                                        </div>
                                        <input type="radio" checked={iterativeMethod == index} className="accent-black" onClick={() => setIterativeMethod(index)}/>
                                    </label>
                                </li>)
                            }
                        </ul>
                    </>
                }
                <div className="flex flex-col space-y-[25px] items-center justify-center xl:px-[30px] xl:py-[0px] py-[5px] px-[10px] border-[1px] border-[#4a4a4a] shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)] w-full xl:h-[200px]">
                    {   
                        (([1, 2, 3, 4, 5].includes(algorithm) && matrixType == 1) || (algorithm == 0 && [2, 3].includes(matrixType)))?
                        <div className="flex flex-col w-full">
                            <div className="font-extrabold w-full"> 
                                {
                                    systemResolutionPageData.warnings.bandSizeMatrixAddition
                                }
                                <input type='number' id="matrixBand" defaultValue={'1'} className='w-[50px] h-[30px] mt-[5px] ml-[15px] p-[5px] text-[18px] font-medium text-black hover:bg-[url("../public/titleFont.png")] focus:bg-[url("../public/titleFont.png")]' onChange={(event) => checkPositiveValue(event)}/>
                            </div>
                            <div id="matrixBandWarning" className="text-[#c92a1e] text-[18px]"></div>
                        </div> : [6, 7].includes(algorithm) && iterativeMethod == 1 ? 
                        <div  className="flex flex-col w-full">
                            <div className="font-extrabold sm:text-[20px] text-[18px] flex-none w-full">
                                {
                                    systemResolutionPageData.maxIterationsDesc
                                }
                                <input key={"iterativeInput"} type='number' id="iterationsNumber" defaultValue={'1'} className='w-[50px] h-[30px] mt-[5px] ml-[5px] p-[5px] text-[18px] font-medium text-black hover:bg-[url("../public/titleFont.png")] focus:bg-[url("../public/titleFont.png")] flex-1' onChange={(event) => checkPositiveValue(event)}/>
                            </div>
                            <div id="iterationsNumberWarning" className="text-[#c92a1e] text-[18px]"></div>
                        </div> : [6, 7].includes(algorithm) && iterativeMethod == 0 ? 
                        <div className="flex flex-col w-full">
                            <div className="font-extrabold sm:text-[20px] text-[18px] flex-none w-full">
                                {
                                    systemResolutionPageData.epsilonValueDesc
                                }
                                <input key={"epsilonInput"} type='number' id="Epsilon" defaultValue={'0.01'} className='w-[70px] h-[30px] mt-[5px] ml-[5px] p-[5px] text-[18px] font-medium text-black hover:bg-[url("../public/titleFont.png")] focus:bg-[url("../public/titleFont.png")] flex-1' onChange={(event) => checkPositiveValue(event)}/>
                            </div>
                            <div id="EpsilonWarning" className="text-[#c92a1e] text-[18px]"></div>
                        </div> : null
                    }
                    <div className='flex xl:flex-row flex-col space-y-[15px] xl:space-y-[0px] justify-center space-x-[25px] items-center'>
                        <div className='text-[20px]'>
                            {
                                systemResolutionPageData.dimension1Desc
                            }
                            <input type='number' id="matrixSize" defaultValue={'1'} className='w-[50px] h-[30px]  ml-[10px] md:mt-0 mt-[8px] p-[5px] text-[18px] text-black hover:bg-[url("../public/titleFont.png")] focus:bg-[url("../public/titleFont.png")]' onChange={(event) => checkMatrixSize(event)} />
                        </div>
                        
                        <div className="h-full flex items-center">
                            <button className="font-semibold border-2 border-[#4a4a4a] text-white px-[10px] py-[5px] shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)]" onClick={getMatrix}>
                                {
                                    systemResolutionPageData.calculationButtonName
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ReactModal ariaHideApp={false} isOpen={matrixInputIsOpen} overlayClassName={'fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-60' } className={'flex overflow-auto outline-none'}>
                <div className="flex justify-center items-center">
                    <MatrixInput inputText={inputText} matrixType={getMatrixType(algorithm, matrixType)}  bandSize={bandSize} matrixLines={matrixSize} matrixColumns={matrixSize} matrixName={'X'} closeMatrix={() => setMatrixInputIsOpen(false)} containsBVector={true} catlucate={calculate} isLoading={isLoading} />
                </div>
            </ReactModal>
        </div>
    )
}

//this function is used to close the functionalities list 
export function closeAlgorithmsTypeList(){

    const algorithmTypeList = document.getElementById("algorithmsTypeList")

    if(!algorithmTypeList.classList.contains('hidden'))
        algorithmTypeList.classList.add('hidden')
}

//this function is used to open the functionalities list 
export function openAlgorithmsTypeList(){
    
    const algorithmTypeList = document.getElementById("algorithmsTypeList")

    if(algorithmTypeList.classList.contains('hidden'))
        algorithmTypeList.classList.remove('hidden')
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

    if(algorithm == 0){//only triangular methods here
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
    else if([2, 3, 4].includes(algorithm)){//LU GJ EG
        switch(matrixType){
            case 0 : //symetric matrix
                return 5
            case 1 ://symetric band matrix
                return 6
        }
    }
    else if ([1, 5].includes(algorithm)){//GPP Cholesky
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
    else if ([1, 5].includes(algorithm)){
        
    }
    else if ([2, 3, 4].includes(algorithm)){
        switch(matrixType){
            case 0 : //dense matrix
                return "symmetric dense"
            case 1 ://band matrix
                return "symmetric banded"
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