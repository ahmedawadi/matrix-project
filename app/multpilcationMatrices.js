'use client'

import { use, useCallback, useEffect, useState } from "react"
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
const matrixTypes = ["dense x dense", "supérieure x inférieure", "inférieure x dense", "supérieure x dense", "bande x dense", "demi bande supérieure x dense", "demi bande inférieure x dense"]//contains the matrices type that the user can choose it
let bandSize = 0//used if we gonna work with band matrices

export default function MultiplicationMatrices(){

    const [matrixInputIsOpen, setMatrixInputIsOpen] = useState(false)
    const [matrixType, setMatrixType] = useState(0)//by default the matries types are dense

    //this function is used to close the functionalities list when the user click outside of it and outside the button that open it 
    const closeTypeMatricesListInOutSideClick = useCallback((event) => {

        const matricesTypeList = document.getElementById("matricesTypeList")
        const matricesTypeListButton = document.getElementById("matricesTypeListButton")
        
        if(!(matricesTypeList?.contains(event.target) || matricesTypeListButton?.contains(event.target)))
            closematricesTypeList()
            
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

    const openMatrixMultiplication = () => {

        //getting matrices size
        matrixALines = document.getElementById('matrixALines').value
        matrixAColumns = document.getElementById('matrixAColumns').value
        matrixBLines = document.getElementById('matrixBLines').value
        matrixBColumns = document.getElementById('matrixBColumns').value
        const matrixBand = document.getElementById('matrixBand')//used if we gonna work with band matrices
        const matrixAWarning = document.getElementById('matrixAWarning')
        const matrixBWarning = document.getElementById('matrixBWarning')
        const matrixBandWarning = document.getElementById('matrixBandWarning')

        if(matrixAColumns == '' || matrixBColumns == '' || matrixALines == '' || matrixBLines == '')
            return

        //checking the matrix type in the matrix type case because les matrices bande sup ou inf doivent etre des matrices carrees
        let validMatrixASize = true
        let validMatrixBSize = true
        let validMatrixBand = true //used if we gonna work with band matrices
    
        switch (matrixType) {
            case 1 : {
                if(matrixALines !== matrixAColumns){

                    matrixAWarning.innerHTML = 'La matrice supérieure doit être carre!'
                    validMatrixASize = false

                }

                if(matrixBLines !== matrixBColumns){

                    matrixBWarning.innerHTML = 'La matrice inferieure doit être carre.!'
                    validMatrixBSize = false

                }

                break
            }

            case 2 : {
                if(matrixALines !== matrixAColumns){

                    matrixAWarning.innerHTML = 'La matrice inferieure doit être carre!'
                    validMatrixASize = false

                }

                break
            }

            case 3 : {
                if(matrixALines !== matrixAColumns){

                    matrixAWarning.innerHTML = 'La matrice supérieure doit être carre!'
                    validMatrixASize = false

                }

                break
            }

            case 4 : {
                if(matrixALines !== matrixAColumns){

                    matrixAWarning.innerHTML = 'La matrice bande doit être carre!'
                    validMatrixASize = false

                }

                if(validMatrixASize){//check the band size

                    if(matrixBand.value == ''){
                        matrixBandWarning.innerHTML = 'Ajouter la bande de la matrice!'
                        validMatrixBand = false
                    }
                    else if ((Number(matrixBand.value) + 1) > Number(matrixALines)){
                        matrixBandWarning.innerHTML = "taille de la bande ne s'applique pas à la matrice A"
                        validMatrixBand = false
                    }
                    else if ((Number(matrixBand.value) + 1) == Number(matrixALines)){
                        matrixBandWarning.innerHTML = "La matrice A devient une matrice dense!"
                        validMatrixBand = false
                    }
                    else 
                        bandSize = matrixBand.value
                }

                break
            }

            case 5 : {
                if(matrixALines !== matrixAColumns){

                    matrixAWarning.innerHTML = 'La matrice bande supérieure doit être carre!'
                    validMatrixASize = false
                }

                if(validMatrixASize){//check the band size

                    if(matrixBand.value == ''){
                        matrixBandWarning.innerHTML = 'Ajouter la bande de la matrice!'
                        validMatrixBand = false
                    }
                    else if ((Number(matrixBand.value) + 1) > Number(matrixALines)){
                        matrixBandWarning.innerHTML = "taille de la bande ne s'applique pas à la matrice A"
                        validMatrixBand = false
                    }
                    else if ((Number(matrixBand.value) + 1) == Number(matrixALines)){
                        matrixBandWarning.innerHTML = "La matrice A devient une matrice supérieure!"
                        validMatrixBand = false
                    }
                    else 
                        bandSize = matrixBand.value
                }

                break
            }

            case 6 : {
                if(matrixALines !== matrixAColumns){

                    matrixAWarning.innerHTML = 'La matrice bande inférieure doit être carre!'
                    validMatrixASize = false

                }

                if(validMatrixASize){//check the band size

                    if(matrixBand.value == ''){
                        matrixBandWarning.innerHTML = 'Ajouter la bande de la matrice!'
                        validMatrixBand = false
                    }
                    else if ((Number(matrixBand.value) + 1) > Number(matrixALines)){
                        matrixBandWarning.innerHTML = "taille de la bande ne s'applique pas à la matrice A"
                        validMatrixBand = false
                    }
                    else if ((Number(matrixBand.value) + 1) == Number(matrixALines)){
                        matrixBandWarning.innerHTML = "La matrice A devient une matrice inférieure!"
                        validMatrixBand = false
                    }
                    else 
                        bandSize = matrixBand.value
                }

                break
            }
        }

        if(validMatrixASize && matrixAWarning.innerText != '')
            matrixAWarning.innerHTML = ''
        if(validMatrixBSize && matrixBWarning.innerText != '')
            matrixBWarning.innerHTML = ''
        if(matrixBand && validMatrixBand && matrixBandWarning.innerText != '')//if we are not working with band matrices matrixBand will be null
            matrixBandWarning.innerHTML = ''

        if(!validMatrixASize || !validMatrixBSize || !validMatrixBand)
            return 

        //get the matrices values
        setMatrixInputIsOpen(true)
    }

    const calculate = () => {

        const matrixA = getMatrix('A')
        const matrixB = getMatrix('B')

        if(!matrixA || !matrixB)
            return

        const dataToSend = {
            first_matrix: matrixA,
            second_matrix: matrixB,
            first_matrix_type : getMatrixTypeNameInTheServer(matrixType, 1) ,
            second_matrix_type : getMatrixTypeNameInTheServer(matrixType, 2)
        }

        console.log(dataToSend)

        axios.post('http://192.168.129.58:8000/matrix/multiply/', dataToSend).then(res => {
            window.open('/multiplicationCalculation?matrixId=' + res.data._id, '_blank')

            setMatrixInputIsOpen(false)
        }).catch(error => {
            console.log(error)
        })
    }

    //this function is used just to selet which matrix type will we use
    const chooseMatrixType = (matrixType) => {

        //we'll check if there's any previous warning to remove it when we change the matrix type
        const matrixAWarning = document.getElementById('matrixAWarning')
        const matrixBWarning = document.getElementById('matrixBWarning')
        const matrixBandWarning = document.getElementById('matrixBandWarning')

        if(matrixAWarning.innerText != '')
            matrixAWarning.innerHTML = ''
        if(matrixBWarning.innerText != '')
            matrixBWarning.innerHTML = ''
        if( matrixBandWarning && matrixBandWarning.innerText != '')
            matrixBandWarning.innerHTML = ''

        setMatrixType(matrixType)
        closematricesTypeList()
    }

    return (
        <div className='xl:basis-[80%] bg-[#424143] py-[20px] xl:px-[50px] px-[15px]  flex flex-col'>
            <div className='w-full flex justify-end font-semibold text-[28px] text-white pb-[20px] border-b-[0.5px] border-[#4a4a4a] font-serif shadow-[0_1px_0_rgba(10,10,10,0.5)]'>
                Multiplication des matrices
            </div>
            <div className='xl:pt-[80px] xl:text-[22px] pt-[30px] flex flex-col space-y-[30px] text-[#b5b5b5] text-[18px]'>
                <div>
                    La multiplication de deux matrices carre denses : après la multiplication de la matrice, il est possible d'ajouter des instructions supplémentaires sur la matrice qui en résulte, telles que le calcul d'inverse ou la multiplication par une matrice...
                </div>
                <br/>
                <div className="flex flex-col">
                    <div className="mt-[10px]">
                        Vous pouvez sélectionner le type de matrices que vous souhaitez travailler avec :
                    </div>
                    <div className="pl-[25px] mt-[15px] w-full flex space-x-[10px]">
                        <div className="w-[80%] font-bold border-2 relative">
                            <div id="matricesTypeListButton" className="flex justify-between px-[10px] py-[5px] cursor-pointer h-[45px]" onClick={openmatricesTypeList}>
                                <div>
                                    Types des matrices
                                </div>
                                <FontAwesomeIcon className="mt-[5px] w-fit" size="lg" icon={faChevronDown} />
                            </div>
                            <ul id="matricesTypeList" className="bg-[#424143] text-[#b5b5b5] hidden absolute border-t-2 border-x-2 font-bold top-[50px] right-0 w-full">
                                {
                                    matrixTypes.map((matrixTypeName, index) => <li key={index} className="border-b-[3px] text-[20px] font-bold cursor-pointer hover:text-white hover:bg-[url('../public/titleFont.png')]">
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
                <MatrixMultiplicationInput containsMatrixBand={matrixType == 4 || matrixType == 5 || matrixType == 6 ? true : undefined} openMatrixMultiplication={openMatrixMultiplication} />
            </div>
            <ReactModal ariaHideApp={false} isOpen={matrixInputIsOpen} overlayClassName={'xl:justify-center xl:items-center fixed top-0 left-0 right-0 bottom-0 flex bg-black bg-opacity-60 overflow-auto'} className={'flex space-x-[20px] outline-none'}>
                <div className="flex justify-center items-center">
                    <MatrixInput matrixLines={matrixALines} matrixColumns={matrixAColumns} matrixType={matrixType == 1 ? 0 : matrixType == 2 ? 1 : matrixType == 3 ? 0 : matrixType == 4 ? 2 : matrixType == 5 ? 3 : matrixType == 6 ? 4 : undefined } matrixName={'A'} bandSize={matrixType == 4 || matrixType == 5 || matrixType == 6 ? bandSize : undefined} />
                </div>
                <div className="">
                    <MatrixInput matrixLines={matrixBLines} matrixColumns={matrixBColumns} matrixName={'B'} matrixType={matrixType == 1 ? 1 : undefined } closeMatrix={() => setMatrixInputIsOpen(false)} catlucate={calculate} />
                </div>
            </ReactModal>
        </div>

    )

}

//this function is used to close the functionalities list 
function closematricesTypeList(){

    const matricesTypeList = document.getElementById("matricesTypeList")

    if(!matricesTypeList.classList.contains('hidden'))
        matricesTypeList.classList.add('hidden')
}

//this function is used to open the functionalities list 
function openmatricesTypeList(){
    
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
    }
}