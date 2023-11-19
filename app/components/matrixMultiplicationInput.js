'use client'

export default function MatrixMultiplicationInput({openMatrixMultiplication, matrixLines, matrixColumns, matrixName, containsMatrixBand}){

    //matrixName is the name of the matrix that we gonna put for the the initial values and they can not changed we use this in the continue calculation
    return (
        <div className='xl:px-[30px] xl:py-[0px] py-[5px] px-[10px] border-[1px] border-[#4a4a4a] shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)] flex flex-col space-y-[20px] items-center justify-center w-full xl:h-[200px]'>
            {   
                containsMatrixBand ?
                <div className="flex flex-col w-full">
                    <div className="font-extrabold flex items-center space-x-[15px] w-full">
                        <div>
                            * Ajouter la taille du bande de la matrice A : 
                        </div>
                        <input type='number' id="matrixBand" defaultValue={'1'} className='w-[50px] h-[30px] mt-[5px] p-[5px] text-[18px] font-medium text-black hover:bg-[url("../public/titleFont.png")] focus:bg-[url("../public/titleFont.png")]'/>
                    </div>
                    <div id="matrixBandWarning" className="text-[#c92a1e] text-[18px]"></div>
                </div> : null
            }
            <div className="flex xl:flex-row flex-col space-y-[15px] xl:space-y-[0px] justify-between items-center w-full">
                <div className="flex flex-col space-y-[25px]">
                    <div className="flex flex-col">
                        <div className='flex xl:flex-row flex-col xl:space-y-[0px] space-y-[5px] xl:space-x-[15px] text-[20px]'>
                            <div>
                                Dimension de la matrice A:
                            </div>
                            <div className="flex space-x-[15px]">
                                <input type='number' id="matrixALines" defaultValue={'1'} value={matrixLines && matrixName == 'L' ? matrixLines : undefined} className='w-[50px] h-[30px] p-[5px] text-[18px] text-black hover:bg-[url("../public/titleFont.png")] focus:bg-[url("../public/titleFont.png")]' onChange={(event) => checkMatrixLength(event)} />
                                <div>
                                    X
                                </div>
                                <input type='number' id="matrixAColumns" defaultValue={'1'} value={matrixColumns && matrixName == 'L' ? matrixColumns : matrixName == 'R' && matrixLines ? matrixLines : undefined } className='w-[50px] h-[30px] p-[5px] text-[18px] text-black hover:bg-[url("../public/titleFont.png")] focus:bg-[url("../public/titleFont.png")]' onChange={ !(matrixName == 'L' || matrixName == 'R') ? (event) => changeMatrixBLines(event) : null} />
                            </div>
                            
                        </div>
                        <div id="matrixAWarning" className="text-[#c92a1e] text-[18px]"></div>
                    </div>
                    <div className="flex flex-col">
                        <div className='flex xl:flex-row flex-col xl:space-y-[0px] space-y-[5px] xl:space-x-[15px] text-[20px]'>
                            <div>
                                Dimension de la matrice B:
                            </div>
                            <div className="flex space-x-[15px]">
                                <input type='number' id="matrixBLines" defaultValue={'1'} value={matrixLines && matrixName == 'R' ? matrixLines : matrixName == 'L' && matrixColumns ? matrixColumns : undefined } className='w-[50px] h-[30px] p-[5px] text-[18px] text-black hover:bg-[url("../public/titleFont.png")] focus:bg-[url("../public/titleFont.png")]' onChange={!(matrixName == 'R' || matrixName == 'L') ? (event) => changeMatrixAColumns(event): null}/>
                                <div>
                                    X
                                </div>
                                <input type='number' id="matrixBColumns" defaultValue={'1'} value={matrixColumns && matrixName == 'R' ? matrixColumns : undefined} className='w-[50px] h-[30px] p-[5px] text-[18px] text-black hover:bg-[url("../public/titleFont.png")] focus:bg-[url("../public/titleFont.png")]' onChange={(event) => checkMatrixLength(event)} />
                            </div>
                        </div>
                        <div id="matrixBWarning" className="text-[#c92a1e] text-[18px]"></div>
                    </div>
                    
                </div>
                <div className="h-full flex items-center">
                    <button className="font-semibold border-2 border-[#4a4a4a] text-white px-[10px] py-[5px] shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)]" onClick={openMatrixMultiplication}>
                        Ajouter matrices
                    </button>
                </div>
            </div>
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
        event.target.value = ''
    
}