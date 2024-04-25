"use client";

import { faClose, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function MatrixInput({
  inputText,
  matrixLines,
  matrixColumns,
  matrixName,
  closeMatrix,
  catlucate,
  containsBVector,
  matrix,
  matrixType,
  bandSize,
  isLoading,
}) {
  //matrix variable is used when we want to put a matrix by default in the input
  /*matrixType is an integer that indicates the type of the matrix
        by default the matrix is dense 
        0 : superieur
        1 : inferieur
        2 : bande
        3 : bande superieure
        4 : bande inferieure
        5 : dense symetrique positive
        6 : bande symterique positive
    */

  const fillEmptyCellsWithZeros = () => {
    for (let i = 0; i < matrixLines; i++) {
      for (let j = 0; j < matrixColumns; j++) {
        const matrixElement = document.getElementById(matrixName + i + j);

        if (matrixElement && matrixElement.value === "")
          matrixElement.value = 0;
      }
    }
  };

  const clearMatrixValues = () => {
    for (let i = 0; i < matrixLines; i++) {
      if (containsBVector) {
        //if we have system to solve we need to clear the vector also
        const vectorElement = document.getElementById("b" + i);

        if (vectorElement.value != "") vectorElement.value = "";
      }

      for (let j = 0; j < matrixColumns; j++) {
        const matrixElement = document.getElementById(matrixName + i + j);

        if (matrixElement && matrixElement.value !== "")
          matrixElement.value = "";
      }
    }
  };

  const fillVectorEmptyCellsWithZeros = () => {
    for (let i = 0; i < matrixLines; i++) {
      const vectorElement = document.getElementById("b" + i);

      if (vectorElement.value === "") vectorElement.value = 0;
    }
  };

  //used to change other values in the other side in symectric matrix
  function updateSymetricMatricCells(lineIndex, columnIndex, event) {
    //changing the value of the symetric element
    const symetricElement = document.getElementById(
      matrixName + columnIndex + lineIndex,
    );

    symetricElement.value = event.target.value;
  }

  return (
    matrixColumns &&
    matrixLines &&
    matrixName && (
      <div className=" p-[2px] bg-[url('../public/titleFont.png')] min-w-[300px] ">
        <div className="flex flex-col w-full">
          <div className="w-full basis-[10%] flex relative justify-between py-[3px] text-[25px] text-white font-serif font-bold">
            <div className="basis-[80%] flex justify-center">
              {inputText.title}
            </div>
            {closeMatrix ? (
              <FontAwesomeIcon
                className="text-white top-[5px] right-[5px] bg-[#424143] p-[5px] cursor-pointer rounded-[10px]"
                icon={faClose}
                onClick={closeMatrix}
              />
            ) : null}
          </div>
          <div className="xl:px-[70px] xl:py-[50px] px-[10px] py-[50px] w-full basis-[90%] bg-[#424143] flex flex-col space-y-[15px] max-h-[80vh] max-w-[80vw] overflow-auto">
            <div
              className={
                "flex space-x-[10px]" +
                (matrixColumns < 7 ? " md:justify-center" : "") +
                (matrixColumns < 4 ? " justify-center" : "")
              }
            >
              <table className="border-collapse border border-[#c2c2c2]">
                <thead>
                  <tr>
                    {Array.from({ length: Number(matrixColumns) + 1 }).map(
                      (_, index) =>
                        index === 0 ? (
                          <th
                            key={index}
                            className="border border-[#c2c2c2] border-[2px]"
                          ></th>
                        ) : (
                          <th
                            key={index}
                            className="font-extrabold text-[22px] text-[#c2c2c2] border border-[#c2c2c2] border-[2px]"
                          >
                            <div className="flex justify-center w-full">
                              {matrixName}
                              <div className="mt-[7px] ">{index}</div>
                            </div>
                          </th>
                        ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: matrixLines }).map((_, lineIndex) => (
                    <tr
                      key={lineIndex}
                      className="border border-[#c2c2c2] border-[2px]"
                    >
                      <td className="font-extrabold text-[22px] text-[#c2c2c2] border border-[#c2c2c2] border-[2px] p-[5px]">
                        {Number(lineIndex) + 1}
                      </td>
                      {Array.from({ length: matrixColumns }).map(
                        (_, columnIndex) => (
                          <td
                            key={matrixName + lineIndex + columnIndex}
                            className="p-[5px] border border-[#c2c2c2] border-[2px]"
                          >
                            {isMatrixCellEmpty(
                              matrixType,
                              bandSize,
                              matrixLines,
                              lineIndex,
                              columnIndex,
                            ) ? null : (
                              <input
                                type="number"
                                id={matrixName + lineIndex + columnIndex}
                                value={
                                  matrix
                                    ? matrix[lineIndex][columnIndex]
                                    : undefined
                                }
                                className="p-[5px] w-[60px] h-[40px] hover:bg-[url('../public/titleFont.png')] focus:bg-[url('../public/titleFont.png')] text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                onChange={
                                  [5, 6].includes(matrixType)
                                    ? (event) =>
                                        updateSymetricMatricCells(
                                          lineIndex,
                                          columnIndex,
                                          event,
                                        )
                                    : undefined
                                }
                              />
                            )}
                          </td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {containsBVector ? (
                <div className="flex space-x-[10px]">
                  <div className="h-full w-[2px] bg-[#c2c2c2]"></div>
                  <table className="flex flex-col border">
                    <thead className="w-full border-b-2 flex justify-center">
                      <tr>
                        <th className="font-extrabold text-[22px] text-[#c2c2c2] border-[#c2c2c2] py-[5px]">
                          b
                        </th>
                      </tr>
                    </thead>
                    <tbody className="flex flex-col space-y-[0px]">
                      {Array.from({ length: matrixLines }).map(
                        (_, lineIndex) => (
                          <tr
                            key={"b" + lineIndex}
                            className={
                              "border-[#c2c2c2] p-[5px]" +
                              (lineIndex != matrixLines - 1
                                ? " border-b-[2px]"
                                : "")
                            }
                          >
                            <td>
                              <input
                                type="number"
                                id={"b" + lineIndex}
                                className="p-[5px] w-[60px] h-[40px] hover:bg-[url('../public/titleFont.png')] focus:bg-[url('../public/titleFont.png')] text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
            <div
              id={"matrixWarning" + matrixName}
              className="text-[#c92a1e] text-[18px]"
            ></div>
            <div className="max-w-[400px] flex flex-col space-y-[10px]">
              <div className="xl:flex-row xl:space-x-[20px] xl:space-y-0 xl:text-[22px] text-[18px] space-y-[10px] flex flex-col w-full">
                <button
                  className="font-semibold border-2 hover:border-[#4a4a4a] rounded-[10px] border-[#737373] text-white px-[10px] py-[5px] hover:shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)]"
                  onClick={clearMatrixValues}
                >
                  {inputText.clear}
                </button>
                <button
                  className=" font-semibold flex-1 border-2 hover:border-[#4a4a4a] rounded-[10px] border-[#737373] text-white px-[10px] py-[5px] hover:shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)]"
                  onClick={fillEmptyCellsWithZeros}
                >
                  {inputText.replace}
                </button>
              </div>
              {containsBVector ? (
                <button
                  className="xl:text-[22px] text-[18px] font-semibold border-2 hover:border-[#4a4a4a] rounded-[10px] border-[#737373] text-white px-[10px] py-[5px] hover:shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)]"
                  onClick={fillVectorEmptyCellsWithZeros}
                >
                  {inputText.replaceVector}
                </button>
              ) : null}
              {catlucate ? (
                <button
                  id="calculateButton"
                  className="xl:text-[22px] text-[18px] font-semibold border-2 hover:border-[#4a4a4a] rounded-[10px] border-[#737373] text-white px-[10px] py-[5px] hover:shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)] flex justify-center space-x-[10px]"
                  onClick={catlucate}
                >
                  <div>{inputText.calculate}</div>
                  {isLoading ? (
                    <div>
                      <FontAwesomeIcon icon={faSpinner} spin />
                    </div>
                  ) : null}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    )
  );
}

function getMaxValue(firstValue, secondValue) {
  return firstValue > secondValue ? firstValue : secondValue;
}

function getMinValue(firstValue, secondValue) {
  return firstValue < secondValue ? firstValue : secondValue;
}

//this function used to check if we need to put the cell empty when we are dealing with band matrix
function isCellEmptyBandCondition(
  bandSize,
  matrixSize,
  lineIndex,
  columnIndex,
) {
  return (
    columnIndex >
      getMinValue(matrixSize - 1, Number(lineIndex) + Number(bandSize)) ||
    columnIndex < getMaxValue(0, lineIndex - bandSize)
  );
}

//this function used to check if we need to put the cell empty when we are dealing with half band superior matrix
function isCellEmptyHalfBandSuperiorCondition(
  bandSize,
  matrixSize,
  lineIndex,
  columnIndex,
) {
  return (
    columnIndex >
      getMinValue(matrixSize - 1, Number(lineIndex) + Number(bandSize)) ||
    columnIndex < getMaxValue(0, lineIndex)
  );
}

//this function used to check if we need to put the cell empty when we are dealing with half band inferior matrix
function isCellEmptyHalfBandInferiorCondition(
  bandSize,
  matrixSize,
  lineIndex,
  columnIndex,
) {
  return (
    columnIndex > getMinValue(matrixSize - 1, Number(lineIndex)) ||
    columnIndex < getMaxValue(0, lineIndex - bandSize)
  );
}

//this function is used to give us which cell is empty base on the matrix type
function isMatrixCellEmpty(
  matrixType,
  bandSize,
  matrixSize,
  lineIndex,
  columnIndex,
) {
  //band size will be used only in the case of a band matrix

  switch (matrixType) {
    case 0: //superior matrix case
      return columnIndex < lineIndex;
    case 1: //inferior matrix case
      return lineIndex < columnIndex;
    case 2: //band matrix case
      return isCellEmptyBandCondition(
        bandSize,
        matrixSize,
        lineIndex,
        columnIndex,
      );
    case 3: //half band superior matrix
      return isCellEmptyHalfBandSuperiorCondition(
        bandSize,
        matrixSize,
        lineIndex,
        columnIndex,
      );
    case 4: //half band inferior matrix
      return isCellEmptyHalfBandInferiorCondition(
        bandSize,
        matrixSize,
        lineIndex,
        columnIndex,
      );
    case 6: //band and symetric positive matrix
      return isCellEmptyBandCondition(
        bandSize,
        matrixSize,
        lineIndex,
        columnIndex,
      );
  }
}
