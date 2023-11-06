export function multplicateDenseMatrices (matrixA, matrixB){

    const calculatedMatrix = []//the result of multiplication

    for(let i=0; i<matrixA.length; i++){
        const matrixLine = []
        
        for(let j=0; j<matrixB[0].length; j++){

            let elementValue = 0;

            for(let k=0; k<matrixA[0].length; k++)
                elementValue += (Number(matrixA[i][k]) * Number(matrixB[k][j]))

            matrixLine.push(elementValue)
        }

        calculatedMatrix.push(matrixLine)
    }

    return calculatedMatrix
}