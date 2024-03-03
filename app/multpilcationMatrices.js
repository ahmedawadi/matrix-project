'use client'

import { useCallback, useEffect, useState } from "react"
import ReactModal from "react-modal"
import MatrixInput from "./matrixInput"
import MatrixMultiplicationInput from './components/matrixMultiplicationInput'
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons"

let matrixALines = 1
let matrixAColumns = 1
let matrixBLines = 1
let matrixBColumns = 1
const matrixTypes = ["dense X dense", "supérieure X inférieure", "inférieure X dense", "supérieure X dense", "bande X dense", "demi bande supérieure X dense", "demi bande inférieure X dense", "bande X demi bande inférieure", "bande X l'inverse du matrice", "bande X la transposée du matrice", "demi bande inférieure X demi bande supérieure"]//contains the matrices type that the user can choose it
let bandASize = 0//used if we gonna work with band matrices on the matrix A
let bandBSize = 0//used if we gonna work with band matrices on the matrix B

export default function MultiplicationMatrices({multiplicationPageData}){

    const [matrixInputIsOpen, setMatrixInputIsOpen] = useState(false)
    const [matrixType, setMatrixType] = useState(-1)//by default the matries types are dense
    const [isLoading, setIsLoading] = useState(false)//used when we are making the calculation

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

    useEffect(() => {
        //checking if we were in the matrices types that needs only one matrix and correct the first matrix columns and second matrix lines
        if(![8, 9].includes(matrixType)){
            const matrixAColumns = document.getElementById("matrixAColumns")
            const matrixBLines = document.getElementById("matrixBLines")

            if(matrixAColumns.value != matrixBLines.value)
                matrixBLines.value = matrixAColumns.value
        }
    }, [matrixType])

    const openMatrixMultiplication = () => {

        //check the validity of the matrices added
        if(!checkMatricesValidity(matrixType))
            return

        //get the matrices values
        setMatrixInputIsOpen(true)
    }

    const calculate = () => {

        const matrixA = getMatrix('A')
        const calculateButton = document.getElementById("calculateButton")//will be used to animate the button when it is waiting for the calculation
        let matrixB = []
        let validMatrices = true
        const matrixAWarning = document.getElementById('matrixWarningA')
        const matrixBWarning = document.getElementById("matrixWarningB")

        if(!matrixA){
            matrixAWarning.innerHTML = "Il y a des cellules vides!"
            validMatrices = false
        }
        else if(matrixAWarning.innerText != '')
            matrixAWarning.innerHTML = ''
        
        if(![8,9].includes(matrixType)){

            matrixB = getMatrix('B')

            if(!matrixB){
                matrixBWarning.innerHTML = "Il y a des cellules vides!"
                validMatrices = false 
            }
            else if(matrixBWarning.innerText != '')
                matrixBWarning.innerHTML = ''

        }


        if(!validMatrices)
            return 

        setIsLoading(true)
        calculateButton.classList.add("opacity-40")
        calculateButton.disabled = true

        const dataToSend = {
            first_matrix: matrixA,
            first_matrix_type : getMatrixTypeNameInTheServer(matrixType, 1),
        }

        if(![8,9].includes(matrixType)){
            dataToSend["second_matrix"] = matrixB
            dataToSend["second_matrix_type"] = matrixB[0].length == 1 ? 'vector' : getMatrixTypeNameInTheServer(matrixType, 2)
        }
        else{
            if(matrixType == 8)
                dataToSend["second_matrix_type"] = 'inverse'
            else 
                dataToSend["second_matrix_type"] = 'transpose'
        }

        if([4, 5, 6, 7, 8, 9].includes(matrixType) )
            dataToSend['m_first_matrix'] = bandASize
        else if (matrixType == 10){
            dataToSend['m_first_matrix'] = bandASize
            dataToSend['m_second_matrix'] = bandBSize
        }

        axios.post('https://web-production-e015.up.railway.app/matrix/multiply/', dataToSend, {timeout: 12000}).then(res => {
            window.open('/multiplicationCalculation?matrixId=' + res.data._id, '_blank')

            setIsLoading(false)
            calculateButton.classList.remove("opacity-40")
            calculateButton.disabled = false
            setMatrixInputIsOpen(false)
        }).catch(_ => {

            calculateButton.classList.remove("opacity-40")
            calculateButton.disabled = false
            setIsLoading(false)

            if(![8,9].includes(matrixType))
                matrixBWarning.innerHTML = "essayer une autre fois!"
            else
                matrixAWarning.innerHTML = "essayer une autre fois!"
        })
    }

    //this function is used just to selet which matrix type will we use
    const chooseMatrixType = (matrixType) => {

        //we'll check if there's any previous warning to remove it when we change the matrix type
        const matrixAWarning = document.getElementById('matrixAWarning')
        const matrixBWarning = document.getElementById('matrixBWarning')
        const matrixABandWarning = document.getElementById('matrixABandWarning')
        const matrixBBandWarning = document.getElementById('matrixBBandWarning')

        if(matrixAWarning.innerText != '')
            matrixAWarning.innerHTML = ''
        if( matrixBWarning && matrixBWarning.innerText != '')
            matrixBWarning.innerHTML = ''
        if( matrixABandWarning && matrixABandWarning.innerText != '')
            matrixABandWarning.innerHTML = ''
        if( matrixBBandWarning && matrixBBandWarning.innerText != '')
            matrixBBandWarning.innerHTML = ''

        setMatrixType(matrixType)
        closeMatricesTypeList()
    }

    const dimensionsDesc = {
        dim1Desc: multiplicationPageData.dimension1Desc,
        dim2Desc: multiplicationPageData.dimension2Desc, 
        buttonName : multiplicationPageData.calculationButtonName
    }

    return (
        <div className='xl:basis-[80%] bg-[#424143] py-[20px] xl:px-[50px] px-[15px]  flex flex-col'>
            <div className='w-full flex justify-end font-semibold sm:text-[28px] text-[22px] text-white pb-[20px] border-b-[0.5px] border-[#4a4a4a] font-serif shadow-[0_1px_0_rgba(10,10,10,0.5)]'>
                {
                    multiplicationPageData.pageName
                }
            </div>
            <div className='xl:pt-[80px] xl:text-[22px] pt-[30px] flex flex-col space-y-[30px] text-[#b5b5b5] text-[18px]'>
                <p>
                    {
                        multiplicationPageData.pageDesc
                    }
                </p>

                <br/>
                <div className="flex flex-col">
                    <div className="mt-[10px]">
                        {
                            multiplicationPageData.matrixTypeDec
                        }
                    </div>
                    <div className="pl-[25px] mt-[15px] w-full flex space-x-[10px]">
                        <div className="w-[80%] font-bold flex flex-col space-y-[4px]">
                            <div id="matricesTypeListButton" className="w-full border-2 flex justify-between px-[10px] py-[5px] items-center cursor-pointer text-[16px] sm:text-[22px]" onClick={openmatricesTypeList}>
                                <div>
                                {
                                    matrixType != -1 ? matrixTypes[matrixType] : multiplicationPageData.matrixTypesButtonName
                                }    
                                </div>
                                <div>
                                    <FontAwesomeIcon className="mt-[5px] w-fit" icon={faChevronDown} />
                                </div>
                            </div>
                            <ul id="matricesTypeList" className="bg-[#424143] text-[#b5b5b5] max-h-[200px] overflow-y-auto hidden border-y-2 border-x-2 font-bold w-full">
                                {
                                    multiplicationPageData.matrixTypes.map((matrixTypeName, index) => <li key={index} className={"text-[20px] font-bold cursor-pointer hover:text-white hover:bg-[url('../public/titleFont.png')]" + (index != matrixTypes.length - 1 ? " border-b-[3px]" : '')}>
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
                    </div>
                </div>
                <MatrixMultiplicationInput dimensionsDesc={dimensionsDesc} oneMatrixWillBeUsed={[8, 9].includes(matrixType)} containsMatrixBand={[4, 5, 6, 7, 8, 9].includes(matrixType) ? 1 : matrixType == 10 ? 2 : undefined} sameBandOnTwoMatrices={matrixType == 7 ? true : undefined} openMatrixMultiplication={openMatrixMultiplication} />
            </div>
            <ReactModal ariaHideApp={false} isOpen={matrixInputIsOpen} overlayClassName={'fixed top-0 left-0 right-0 bottom-0 flex bg-black bg-opacity-60 overflow-auto' + (matrixAColumns > 7 || matrixBColumns > 7 ? '' : ' xl:justify-center xl:items-center')} className={'flex space-x-[20px] outline-none'}>
                {
                    [8, 9].includes(matrixType) ? null :
                    <div className="flex justify-center items-center">
                        <MatrixInput matrixLines={matrixALines} matrixColumns={matrixAColumns} matrixType={matrixType == 1 ? 0 : matrixType == 2 ? 1 : matrixType == 3 ? 0 : [4, 7].includes(matrixType) ? 2 : matrixType == 5 ? 3 : [6, 10].includes(matrixType) ? 4 : undefined } matrixName={'A'} bandSize={[4, 5, 6, 7, 8, 9, 10].includes(matrixType) ? bandASize : undefined} />
                    </div>
                }
                <div className="">
                    <MatrixInput matrixLines={[8, 9].includes(matrixType) ? matrixALines : matrixBLines} matrixColumns={[8, 9].includes(matrixType) ? matrixAColumns : matrixBColumns} matrixName={[8, 9].includes(matrixType) ? 'A' : 'B'} matrixType={matrixType == 1 ? 1 : matrixType == 7 ? 4 : matrixType == 10 ? 3 : [8, 9].includes(matrixType) ? 2 : undefined } bandSize={[7, 10].includes(matrixType) ? bandBSize : [8,9].includes(matrixType) ? bandASize : undefined} closeMatrix={() => setMatrixInputIsOpen(false)} catlucate={calculate} isLoading={isLoading}/>
                </div>
            </ReactModal>
        </div>

    )

}

//this function is used to close the functionalities list 
export function closeMatricesTypeList(){

    const matricesTypeList = document.getElementById("matricesTypeList")

    if(!matricesTypeList.classList.contains('hidden'))
        matricesTypeList.classList.add('hidden')
}

//this function is used to open the functionalities list 
export function openmatricesTypeList(){
    
    const matricesTypeList = document.getElementById("matricesTypeList")

    if(matricesTypeList.classList.contains('hidden'))
        matricesTypeList.classList.remove('hidden')
}

function getMatrix(matrixName){

    const matrixLines = (matrixName === 'A' ? matrixALines : matrixBLines)
    const matrixColumns = (matrixName === 'A' ? matrixAColumns : matrixBColumns)

    const matrix = []

    for(let i=0; i<matrixLines; i++){
        const matrixLine = []
        
        for(let j=0; j<matrixColumns; j++){

            const matrixElement = document.getElementById(matrixName + i + j)

            if(matrixElement && matrixElement.value === '')
                return null

            if(!matrixElement)
                matrixLine.push(0)
            else
                matrixLine.push(Number(matrixElement.value))
        }

        matrix.push(matrixLine)
    }

    return matrix
}

//function used to get the matrix type and matrixOrder (first or last) and return the matrix name to send it to the server to make the calculation
function getMatrixTypeNameInTheServer(matrixType, matrixOrder){

    switch(matrixType){
        case -1 : 
            return 'dense'
        case 0 : 
            return 'dense'
        case 1 :
            return matrixOrder == 1 ? 'upper' : 'lower'
        case 2 : 
            return matrixOrder == 1 ? 'lower' : 'dense'
        case 3 : 
            return matrixOrder == 1 ? 'upper' : 'dense'
        case 4 : 
            return matrixOrder == 1 ? 'banded' : 'dense'
        case 5 : 
            return matrixOrder == 1 ? 'upper banded' : 'dense'
        case 6 :
            return matrixOrder == 1 ? 'lower banded' : 'dense'
        case 7 : 
            return matrixOrder == 1 ? 'banded' : 'lower banded'
        case 8 : 
            return matrixOrder == 1 ? 'banded' : 'inverse'
        case 9 : 
            return matrixOrder == 1 ? 'upper banded' : 'transpose'
        case 10 :
            return matrixOrder == 1 ? 'lower banded' : 'upper banded'
    }
}

//check the validity of matrices based on the matrice type
function checkMatricesValidity(matrixType){
    //getting matrices size
    matrixALines = document.getElementById('matrixALines').value
    matrixAColumns = document.getElementById('matrixAColumns').value
    const matrixAWarning = document.getElementById('matrixAWarning')
    const matrixBWarning = document.getElementById('matrixBWarning')
    const matrixABand = document.getElementById('matrixABand')//used if we gonna work with band matrices in the matrix A
    const matrixABandWarning = document.getElementById('matrixABandWarning')
    const matrixBBand = document.getElementById('matrixBBand')//used if we gonna work with band matrices in the matrix B
    const matrixBBandWarning = document.getElementById('matrixBBandWarning')


    if(![8,9].includes(matrixType)){
        matrixBLines = document.getElementById('matrixBLines').value
        matrixBColumns = document.getElementById('matrixBColumns').value

        if( matrixAColumns == '' || matrixBColumns == '' || matrixALines == '' || matrixBLines == '')
            return
    }
    else if (matrixAColumns == '' || matrixALines == '')
        return

    //checking the matrix type in the matrix type case because les matrices bande sup ou inf doivent etre des matrices carrees
    let validMatrixASize = true
    let validMatrixBSize = true
    let validMatrixABand = true //used if we gonna work with band matrices
    let validMatrixBBand = true

    if(matrixType == 1){
        if(matrixALines !== matrixAColumns){

            matrixAWarning.innerHTML = 'La matrice supérieure doit être carre!'
            validMatrixASize = false

        }

        if(matrixBLines !== matrixBColumns){

            matrixBWarning.innerHTML = 'La matrice inferieure doit être carre.!'
            validMatrixBSize = false

        }

    }
    else if (matrixType == 2){
        if(matrixALines !== matrixAColumns){

            matrixAWarning.innerHTML = 'La matrice inferieure doit être carre!'
            validMatrixASize = false

        }
    }
    else if (matrixType == 3){
        if(matrixALines !== matrixAColumns){

            matrixAWarning.innerHTML = 'La matrice supérieure doit être carre!'
            validMatrixASize = false

        }
    }
    else if([4, 7, 8, 9].includes(matrixType)){
        if(matrixALines !== matrixAColumns){

            matrixAWarning.innerHTML = 'La matrice bande doit être carre!'
            validMatrixASize = false

        }

        if(validMatrixASize){//check the band size

            if(matrixABand.value == ''){
                matrixABandWarning.innerHTML = 'Ajouter la bande de la matrice A!'
                validMatrixABand = false
            }
            else if ((Number(matrixABand.value) + 1) > Number(matrixALines)){
                matrixABandWarning.innerHTML = "taille de la bande ne s'applique pas à la matrice A"
                validMatrixABand = false
            }
            else 
                bandASize = matrixABand.value
        }

        if(matrixType == 7){//here we gonna use the matrixABand as the band value because the two matrices have the same band
            if(matrixBLines !== matrixBColumns){

                matrixBWarning.innerHTML = 'La matrice bande inférieure doit être carre!'
                validMatrixBSize = false

            }

            if(validMatrixBSize){//check the band size

                if(matrixABand.value == ''){
                    matrixABandWarning.innerHTML = 'Ajouter la bande de la matrice!'
                    validMatrixABand = false
                }
                else if ((Number(matrixABand.value) + 1) > Number(matrixBLines)){
                    matrixABandWarning.innerHTML = "taille de la bande ne s'applique pas à la matrice B"
                    validMatrixABand = false
                }
                else 
                    bandBSize = matrixABand.value
            }
        }
    }
    else if (matrixType == 5){
        if(matrixALines !== matrixAColumns){

            matrixAWarning.innerHTML = 'La matrice bande supérieure doit être carre!'
            validMatrixASize = false
        }

        if(validMatrixASize){//check the band size

            if(matrixABand.value == ''){
                matrixABandWarning.innerHTML = 'Ajouter la bande de la matrice!'
                validMatrixABand = false
            }
            else if ((Number(matrixABand.value) + 1) > Number(matrixALines)){
                matrixABandWarning.innerHTML = "taille de la bande ne s'applique pas à la matrice A"
                validMatrixABand = false
            }
            else 
                bandASize = matrixABand.value
        }
    }
    else if ([6, 10].includes(matrixType)){
        if(matrixALines !== matrixAColumns){

            matrixAWarning.innerHTML = 'La matrice bande inférieure doit être carre!'
            validMatrixASize = false

        }

        if(validMatrixASize){//check the band size

            if(matrixABand.value == ''){
                matrixABandWarning.innerHTML = 'Ajouter la bande de la matrice!'
                validMatrixABand = false
            }
            else if ((Number(matrixABand.value) + 1) > Number(matrixALines)){
                matrixABandWarning.innerHTML = "taille de la bande ne s'applique pas à la matrice A"
                validMatrixABand = false
            }
            else 
                bandASize = matrixABand.value
        }

        if(matrixType == 10){//check the superior band in the matrix B
            if(matrixBLines !== matrixBColumns){

                matrixBWarning.innerHTML = 'La matrice bande supérieure doit être carre!'
                validMatrixBSize = false
            }

            if(validMatrixBSize){//check the band size

                if(matrixBBand.value == ''){
                    matrixBBandWarning.innerHTML = 'Ajouter la bande de la matrice!'
                    validMatrixBBand = false
                }
                else if ((Number(matrixBBand.value) + 1) > Number(matrixBLines)){
                    matrixBBandWarning.innerHTML = "taille de la bande ne s'applique pas à la matrice B"
                    validMatrixBBand = false
                }
                else if(validMatrixABand && bandASize == matrixBBand.value){
                    matrixBBandWarning.innerHTML = "La bande du A et la bande du B doivent être différentes!"
                    validMatrixBBand = false
                }
                else 
                    bandBSize = matrixBBand.value

            }
        }
    }

    //checking the warnings
    if(validMatrixASize && matrixAWarning.innerText != '')
        matrixAWarning.innerHTML = ''
    if( ![8, 9].includes(matrixType) && validMatrixBSize && matrixBWarning.innerText != '')
        matrixBWarning.innerHTML = ''
    if(matrixABand && validMatrixABand && matrixABandWarning.innerText != '')//if we are not working with band matrices matrixABand will be null
        matrixABandWarning.innerHTML = ''
    if(matrixBBand && validMatrixBBand && matrixBBandWarning.innerText != '')//if we are not working with band matrices matrixBBand will be null
        matrixBBandWarning.innerHTML = ''

    if(!validMatrixASize || !validMatrixBSize || !validMatrixABand || !validMatrixBBand)
        return false
    
    return true
}