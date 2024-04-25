"use client";

import { useState } from "react";
import ReactModal from "react-modal";
import MatrixInput from "./matrixInput";
import { checkMatrixSize } from "./matrixInverse";
import axios from "axios";

let matrixSize = 1;

export default function Determinant({ inputText, determinantPageData }) {
  const [matrixInputIsOpen, setMatrixInputIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); //it will be used when we are waiting for the calculation

  //this function is used to get the values of a matrix with a specific size
  const getMatrixInput = () => {
    matrixSize = document.getElementById("matrixSize").value;

    if (matrixSize == "") return;

    //get the matrix values
    setMatrixInputIsOpen(true);
  };

  const calculate = () => {
    const matrix = getMatrixWithSpecificSize("A", matrixSize);
    const calculateButton = document.getElementById("calculateButton"); //will be used to animate the button when it is waiting for the calculation
    const matrixAWarning = document.getElementById("matrixWarningA");

    if (!matrix) {
      matrixAWarning.innerHTML = determinantPageData.warnings.emptyCells;
      return;
    } else if (matrixAWarning.innerText != "") matrixAWarning.innerHTML = "";

    setIsLoading(true);
    calculateButton.classList.add("opacity-40");
    calculateButton.disabled = true;

    const dataToSend = {
      matrix: matrix,
    };

    axios
      .post(
        process.env.backendDomainName + "/matrix/determinant/",
        dataToSend,
        { timeout: 12000 },
      )
      .then((res) => {
        window.open(
          "/determinantCaclucation?matrixId=" + res.data._id,
          "_blank",
        );

        setIsLoading(false);
        calculateButton.classList.remove("opacity-40");
        calculateButton.disabled = false;
        setMatrixInputIsOpen(false);
      })
      .catch((_) => {
        setIsLoading(false);
        calculateButton.classList.remove("opacity-40");
        calculateButton.disabled = false;
        matrixAWarning.innerHTML = determinantPageData.warnings.tryAgain;
      });
  };

  return (
    <div className="xl:basis-[80%] bg-[#424143] py-[20px] xl:px-[50px] px-[15px]  flex flex-col">
      <div className="w-full flex justify-end font-semibold text-[28px] text-white pb-[20px] border-b-[0.5px] border-[#4a4a4a] font-serif shadow-[0_1px_0_rgba(10,10,10,0.5)]">
        {determinantPageData.pageName}
      </div>
      <div className="xl:pt-[80px] xl:text-[22px] pt-[30px] flex flex-col space-y-[30px] text-[#b5b5b5] text-[18px]">
        <div>{determinantPageData.pageDesc}</div>
        <div className="xl:px-[30px] xl:py-[0px] py-[5px] px-[10px] border-[1px] border-[#4a4a4a] shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)] flex xl:flex-row flex-col space-y-[15px] xl:space-y-[0px] justify-between items-center w-full xl:h-[200px]">
          <div className="text-[20px]">
            {determinantPageData.dimension1Desc}
            <input
              type="number"
              id="matrixSize"
              defaultValue={"1"}
              className='w-[50px] h-[30px] p-[5px] ml-[7px] text-[18px] text-black hover:bg-[url("../public/titleFont.png")] focus:bg-[url("../public/titleFont.png")]'
              onChange={(event) => checkMatrixSize(event)}
            />
          </div>

          <div className="h-full flex items-center">
            <button
              className="font-semibold border-2 border-[#4a4a4a] text-white px-[10px] py-[5px] shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)]"
              onClick={getMatrixInput}
            >
              {determinantPageData.calculationButtonName}
            </button>
          </div>
        </div>
      </div>
      <ReactModal
        ariaHideApp={false}
        isOpen={matrixInputIsOpen}
        overlayClassName={
          "fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-60"
        }
        className={"flex overflow-auto"}
      >
        <div className="flex justify-center items-center">
          <MatrixInput
            inputText={inputText}
            matrixLines={matrixSize}
            matrixColumns={matrixSize}
            matrixName={"A"}
            closeMatrix={() => setMatrixInputIsOpen(false)}
            catlucate={calculate}
            isLoading={isLoading}
          />
        </div>
      </ReactModal>
    </div>
  );
}

//getting the matrix values for a matrix with a specific name and a specific size
export function getMatrixWithSpecificSize(matrixName, matrixSize) {
  const matrix = [];

  for (let i = 0; i < matrixSize; i++) {
    const matrixLine = [];

    for (let j = 0; j < matrixSize; j++) {
      const matrixElement = document.getElementById(matrixName + i + j).value;

      if (matrixElement === "") return null;

      matrixLine.push(Number(matrixElement));
    }

    matrix.push(matrixLine);
  }

  return matrix;
}
