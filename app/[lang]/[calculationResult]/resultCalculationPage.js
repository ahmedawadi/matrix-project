"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import MatrixAdditionSubstractionInput from "../../components/matrixAdditionSubstractionInput";
import MatrixMultiplicationInput from "../../components/matrixMultiplicationInput";
import CalculatedMatrices from "../../components/calculatedMatrices";
import ReactModal from "react-modal";
import MatrixInput from "../../matrixInput";
import axios from "axios";
import useSWR from "swr";

//this variables are used for the matrix multiplication
let matrixALines = 1;
let matrixAColumns = 1;
let matrixBLines = 1;
let matrixBColumns = 1;
let matrixDeterminantResult = null; //will be used if we have calculated the determinant of a matrix
let matrixRankResult = null; //will be used if we have calculated the rank of a matrix
let firstCalculatedMatrix = null;
let secondCalculatedMatrix = null;
const fetcher = (url) => axios.get(url).then((res) => res.data);

export function CalculationResult({ params, content }) {
  const [matrix, setMatrix] = useState(null); //matrix to display
  const [matrixInputIsOpen, setMatrixInputIsOpen] = useState(false); //used to get the matrix values from the user when the user want to continue calculation with his matrix
  const [actionToTake, setActionToTake] = useState(null); //used to stock the action that we gonna take from the functionnalities of the continuing the calculation
  const [additionOrSubstraction, setAdditionOrSubstraction] = useState(0); //used to choose addition or substraction when the user want to continue the calculation with his matrix
  const matrixId = useSearchParams().get("matrixId");
  const [isLoading, setIsLoading] = useState(false); //it will be used when we are waiting for the calculation
  const { data, error } = useSWR(
    getMatrixUrl(params.calculationResult, matrixId),
    fetcher,
  );

  //this function is used to close the functionalities list when the user click outside of it and outside the button that open it
  const closeFunctionnalitiesListInOutSideClick = useCallback((event) => {
    const functionnalitiesList = document.getElementById(
      "functionnalitiesList",
    );
    const functionnalitiesListButton = document.getElementById(
      "functionnalitiesListButton",
    );

    if (
      !(
        functionnalitiesList?.contains(event.target) ||
        functionnalitiesListButton?.contains(event.target)
      )
    )
      closeFunctionnalitiesList();
  });

  useEffect(() => {
    if (typeof window !== "undefined")
      window.addEventListener("click", closeFunctionnalitiesListInOutSideClick);

    return () =>
      window.removeEventListener(
        "click",
        closeFunctionnalitiesListInOutSideClick,
      );
  });

  useEffect(() => {
    if (data) {
      //setting the matrix information data
      if (params.calculationResult == "determinantCaclucation") {
        matrixDeterminantResult = data.determinant;
        setMatrix(data.matrix);
      } else if (params.calculationResult == "rankCalculation") {
        matrixRankResult = data.rank;
        setMatrix(data.matrix);
      } else if (params.calculationResult == "inverseCalculation") {
        firstCalculatedMatrix = data.matrix;
        setMatrix(data.result);
      } else if (params.calculationResult == "transposeCalculation") {
        firstCalculatedMatrix = data.matrix;
        setMatrix(data.result);
      } else {
        firstCalculatedMatrix = data.first_matrix;
        secondCalculatedMatrix = data.second_matrix;
        setMatrix(data.result);
      }
    }
  }, [data]);

  const continueCalculation = (functionality) => {
    const matrixCalculationWarning = document.getElementById(
      "matrixCalculationWarning",
    );

    if (matrixCalculationWarning.innerText != "")
      matrixCalculationWarning.innerHTML = "";

    if (functionality == 0) {
      //calculation of the determinant of a matrix

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
            "determinantCaclucation?matrixId=" + res.data._id,
            "_blank",
          );
        })
        .catch((_) => {
          matrixCalculationWarning.innerHTML = content.warnings.tryAgain;
        });
    } else if (functionality == 1) {
      //calculation of a rank of a matrix

      const dataToSend = {
        matrix: matrix,
      };

      axios
        .post(process.env.backendDomainName + "/matrix/rank/", dataToSend, {
          timeout: 12000,
        })
        .then((res) => {
          window.open("/rankCalculation?matrixId=" + res.data._id, "_blank");
        })
        .catch((_) => {
          matrixCalculationWarning.innerHTML = content.warnings.tryAgain;
        });
    } else if (functionality == 5) {
      const dataToSend = {
        matrix: matrix,
      };

      axios
        .post(process.env.backendDomainName + "/matrix/inverse/", dataToSend, {
          timeout: 12000,
        })
        .then((res) => {
          window.open("inverseCalculation?matrixId=" + res.data._id, "_blank");

          setMatrixInputIsOpen(false);
        })
        .catch((error) => {
          if (error?.response?.status == 400) {
            matrixCalculationWarning.innerHTML = content.warnings.noInverse;
          }

          matrixCalculationWarning.innerHTML =
            content.warnings.inverseCalculImpossible;
        });
    } else if (functionality == 6) {
      const dataToSend = {
        matrix: matrix,
      };

      axios
        .post(
          process.env.backendDomainName + "/matrix/transpose/",
          dataToSend,
          { timeout: 12000 },
        )
        .then((res) => {
          window.open(
            "transposeCalculation?matrixId=" + res.data._id,
            "_blank",
          );

          setMatrixInputIsOpen(false);
        })
        .catch((_) => {
          matrixCalculationWarning.innerHTML =
            content.warnings.inverseCalculImpossible;
        });
    } else
      document
        .getElementById("functionnalitiesListButton")
        .classList.add("hidden");

    //choosing the action for the displaying of the input and closing the functionnalities list
    setActionToTake(functionality);
    closeFunctionnalitiesList();
  };

  const calculate = () => {
    //if it is substraction or addition the matrix will putted on the left side matrix A
    const newMatrixAdded =
      actionToTake == 2
        ? getMatrix("A")
        : actionToTake == 3 || actionToTake == 4
          ? getMatrix("B")
          : null;
    const newMatrixName =
      actionToTake == 2
        ? "A"
        : actionToTake == 3 || actionToTake == 4
          ? "B"
          : null;
    const dataToSend = {};
    const matrixWarning = document.getElementById(
      "matrixWarning" + newMatrixName,
    );
    const calculateButton = document.getElementById("calculateButton"); //will be used to animate the button when it is waiting for the calculation

    if (!newMatrixAdded) {
      matrixWarning.innerHTML = content.warnings.emptyCells;
      return;
    } else if (matrixWarning.innerText != "") matrixWarning.innerHTML = "";

    setIsLoading(true);
    calculateButton.classList.add("opacity-40");
    calculateButton.disabled = true;

    if (actionToTake == 2 || actionToTake == 3 || actionToTake == 4) {
      dataToSend["first_matrix"] =
        actionToTake == 2
          ? newMatrixAdded
          : actionToTake == 3 || actionToTake == 4
            ? matrix
            : null;
      dataToSend["second_matrix"] =
        actionToTake == 3 || actionToTake == 4
          ? newMatrixAdded
          : actionToTake == 2
            ? matrix
            : null;

      if (actionToTake == 2 || actionToTake == 3) {
        dataToSend["first_matrix_type"] = "dense";
        dataToSend["second_matrix_type"] = "dense";
      }
    }

    if (
      actionToTake == 0 ||
      actionToTake == 1 ||
      actionToTake == 5 ||
      actionToTake == 6
    )
      dataToSend["matrix"] = matrix;

    //adding the url based on the type of action choosed by the user
    const url =
      process.env.backendDomainName +
      "/matrix/" +
      (actionToTake == 2 || actionToTake == 3
        ? "multiply/"
        : actionToTake == 4 && additionOrSubstraction == 0
          ? "add/"
          : actionToTake == 4 && additionOrSubstraction
            ? "substract/"
            : null);
    const urlToOpenOnDisplayedMatrix =
      "/" +
      (actionToTake == 2 || actionToTake == 3
        ? "multiplicationCalculation"
        : actionToTake == 4 && additionOrSubstraction == 0
          ? "additionCalculation"
          : actionToTake == 4 && additionOrSubstraction
            ? "substractionCalculation"
            : null) +
      "?matrixId=";

    axios
      .post(url, dataToSend, { timeout: 12000 })
      .then((res) => {
        window.open(urlToOpenOnDisplayedMatrix + res.data._id, "_blank");

        calculateButton.classList.remove("opacity-40");
        calculateButton.disabled = false;
        setIsLoading(false);

        setMatrixInputIsOpen(false);
      })
      .catch((_) => {
        matrixWarning.innerHTML = content.warnings.tryAgain;

        calculateButton.classList.remove("opacity-40");
        calculateButton.disabled = false;
        setIsLoading(false);
      });
  };

  const openMatrixMultiplicationGettingInputData = () => {
    //getting matrices size
    matrixALines = document.getElementById("matrixALines").value;
    matrixAColumns = document.getElementById("matrixAColumns").value;
    matrixBLines = document.getElementById("matrixBLines").value;
    matrixBColumns = document.getElementById("matrixBColumns").value;

    if (
      matrixAColumns == "" ||
      matrixBColumns == "" ||
      matrixALines == "" ||
      matrixBLines == ""
    )
      return;

    //get the matrices values
    setMatrixInputIsOpen(true);
  };

  const openMatrixAdditionOrSubstractionInputData = () => {
    matrixALines = document.getElementById("matrixLines").value;
    matrixAColumns = document.getElementById("matrixColumns").value;
    matrixBLines = matrixALines;
    matrixBColumns = matrixAColumns;

    if (matrixAColumns == "" || matrixALines == "") return;

    //get the matrix values
    setMatrixInputIsOpen(true);
  };

  return (
    matrix && (
      <div className="xl:px-[0px] flex justify-center w-full px-[15px]">
        <div className="xl:px-[50px] xl:w-[70%] w-full bg-[#424143] py-[20px] flex flex-col min-h-screen">
          <div className="xl:text-[28px] xl:pl-[0px] sm:pl-[20px] px-[10px] w-full flex justify-end font-semibold text-[22px] text-white pb-[20px] border-b-[0.5px] border-[#4a4a4a] font-serif shadow-[0_1px_0_rgba(10,10,10,0.5)]">
            {getResultTitle(
              params.calculationResult,
              content.calculationResult,
            )}
          </div>
          <div className="xl:pt-[40px] xl:text-[22px] pt-[30px] pl-[15px] text-[#b5b5b5] text-[18px]">
            {content.pageDesc}
          </div>
          <div className="pt-[30px] flex flex-col space-y-[30px] text-[#b5b5b5] text-[18px] xl:pt-[50px]">
            <div className="w-full flex flex-col items-center justify-center">
              <div
                id="calculatedMatrices"
                className="hidden flex flex-col space-y-[20px] w-full pb-[20px] mb-[30px] border-[1px] border-[#4a4a4a] shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)] "
              >
                <div className="xl:text-[28px] pl-[20px] font-serif text-[22px] font-extrabold">
                  {params.calculationResult == "inverseCalculation" ||
                  params.calculationResult == "transposeCalculation"
                    ? content.calculatedMatrix
                    : content.calculatedMatrices}
                </div>
                <CalculatedMatrices
                  calcultionType={params.calculationResult}
                  firstMatrix={firstCalculatedMatrix}
                  secondMatrix={secondCalculatedMatrix}
                />
              </div>
              <div
                className={
                  "flex flex-col items-center w-full sm:px-0 px-[10px]"
                }
              >
                <div className="flex space-x-[10px]">
                  {params.calculationResult == "determinantCaclucation" ||
                  params.calculationResult == "rankCalculation" ? null : (
                    <button
                      id="displayCalculatedMatricesButton"
                      className="relative font-semibold border-2 border-[#575757] hover:border-[#4a4a4a] rounded-[5px] text-white px-[10px] py-[5px] hover:shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)]"
                      onClick={() => seeCalculatedMatrices(content)}
                    >
                      {params.calculationResult == "systemSolvingCalculation"
                        ? content.checkSystem
                        : content.checkCalculatedMatrices}
                    </button>
                  )}
                  <div className="relative">
                    <button
                      id="functionnalitiesListButton"
                      className="font-semibold border-2 border-[#575757] hover:border-[#4a4a4a] rounded-[5px] text-white px-[10px] py-[5px] hover:shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)]"
                      onClick={openFunctionnalitiesList}
                    >
                      {params.calculationResult == "determinantCaclucation"
                        ? content.recalculate
                        : content.continueCalcul}
                    </button>
                    <div
                      id="functionnalitiesList"
                      className={
                        "hidden absolute sm:right-0 md:w-[300px] sm:top-[45px] w-[250px] flex flex-col border-y-[2px] border-[#4a4a4a] backgroundImage" +
                        (params.calculationResult == "determinantCaclucation" ||
                        params.calculationResult == "rankCalculation"
                          ? " top-[45px] right-[-30px]"
                          : " right-0 top-[70px]")
                      }
                    >
                      {content.functionalities.map((functionality, index) =>
                        matrix &&
                        matrix?.length != matrix[0]?.length &&
                        (index == 0 || index == 1 || index == 5) ? null : (
                          <div
                            key={index}
                            className="py-[10px] px-[20px] border-b-[0.5px] border-[#4a4a4a] cursor-pointer px-[15px] py-[10px] hover:text-white hover:bg-[url('../public/titleFont.png')]"
                            onClick={() => continueCalculation(index)}
                          >
                            {functionality}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full mt-[20px]">
                  {actionToTake == 2 || actionToTake == 3 ? (
                    <MatrixMultiplicationInput
                      openMatrixMultiplication={
                        openMatrixMultiplicationGettingInputData
                      }
                      matrixLines={matrix?.length}
                      matrixColumns={matrix[0]?.length}
                      matrixName={
                        actionToTake == 2 ? "R" : actionToTake == 3 ? "L" : ""
                      }
                    />
                  ) : actionToTake == 4 ? (
                    <MatrixAdditionSubstractionInput
                      matrixLines={matrix.length}
                      matrixColumns={matrix[0].length}
                      setAdditionOrSubstraction={setAdditionOrSubstraction}
                      additionOrSubstraction={additionOrSubstraction}
                      getMatrix={openMatrixAdditionOrSubstractionInputData}
                    />
                  ) : null}
                </div>
              </div>
            </div>
            <div className="xl:px-[30px] px-[10px] py-[40px] min-h-[200px] border-[1px] border-[#4a4a4a] shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)] flex flex-col justify-center space-y-[25px]">
              <div className="text-[25px] font-serif">Résultat :</div>
              <div className="flex justify-center">
                <div className="overflow-x-auto">
                  <table className="border-collapse border border-[#c2c2c2]">
                    <thead>
                      <tr>
                        {Array.from({
                          length: Number(matrix[0]?.length) + 1,
                        }).map((_, index) =>
                          index === 0 ? (
                            <th
                              key={index}
                              className="border border-[#c2c2c2] border-[2px]"
                            ></th>
                          ) : (
                            <th
                              key={index}
                              className="xl:text-[22px] text-[18px] font-extrabold text-[#c2c2c2] border border-[#c2c2c2] border-[2px]"
                            >
                              <div className="px-[3px] flex justify-center">
                                {params.calculationResult ==
                                "systemSolvingCalculation"
                                  ? "X"
                                  : "C"}
                                <div className="mt-[7px] ">{index}</div>
                              </div>
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: matrix?.length }).map(
                        (_, lineIndex) => (
                          <tr
                            key={lineIndex}
                            className="border border-[#c2c2c2] border-[2px]"
                          >
                            <td className="xl:text-[22px] xl:p-[5px] p-[2px] text-[18px] font-extrabold text-[#c2c2c2] border border-[#c2c2c2] border-[2px]">
                              {Number(lineIndex) + 1}
                            </td>
                            {Array.from({ length: matrix[0]?.length }).map(
                              (_, columnIndex) => (
                                <td
                                  key={columnIndex}
                                  className="xl:text-[22px] text-[15px] border border-[#c2c2c2] border-[2px]"
                                >
                                  <div className="flex justify-center items-center text-white">
                                    {Math.round(
                                      matrix[lineIndex][columnIndex] * 100,
                                    ) / 100}
                                  </div>
                                </td>
                              ),
                            )}
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div
                id="matrixCalculationWarning"
                className="text-[#c92a1e] text-[18px]"
              ></div>
              <div className="text-[25px] font-extrabold flex justify-center w-full">
                {params.calculationResult == "determinantCaclucation" ? (
                  <div>
                    {content.matrixDeterminant +
                      " = " +
                      Math.round(matrixDeterminantResult * 100) / 100}
                  </div>
                ) : params.calculationResult == "rankCalculation" ? (
                  <div>
                    {content.matrixRank +
                      " = " +
                      Math.round(matrixRankResult * 100) / 100}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <ReactModal
          ariaHideApp={false}
          isOpen={matrixInputIsOpen}
          overlayClassName={
            "xl:justify-center xl:items-center fixed top-0 left-0 right-0 bottom-0 w-full flex bg-black bg-opacity-60 overflow-auto"
          }
          className={"flex space-x-[20px] outline-none"}
        >
          <div className="flex justify-center items-center">
            <MatrixInput
              matrixLines={matrixALines}
              matrixColumns={matrixAColumns}
              matrixName={"A"}
              matrix={actionToTake == 3 || actionToTake == 4 ? matrix : null}
            />
          </div>
          <div className="">
            <MatrixInput
              matrixLines={matrixBLines}
              matrixColumns={matrixBColumns}
              matrixName={"B"}
              closeMatrix={() => setMatrixInputIsOpen(false)}
              catlucate={calculate}
              matrix={actionToTake == 2 ? matrix : null}
              isLoading={isLoading}
            />
          </div>
        </ReactModal>
      </div>
    )
  );
}

//this function is used to close the functionalities list
function closeFunctionnalitiesList() {
  const functionnalitiesList = document.getElementById("functionnalitiesList");

  if (!functionnalitiesList?.classList?.contains("hidden"))
    functionnalitiesList?.classList?.add("hidden");
}

//this function is used to open the functionalities list
function openFunctionnalitiesList() {
  const functionnalitiesList = document.getElementById("functionnalitiesList");

  if (functionnalitiesList.classList.contains("hidden"))
    functionnalitiesList.classList.remove("hidden");
}

//getting the new matrix added if there's addition or substraction or multiplication for that matrix
function getMatrix(matrixName) {
  const matrixLines = matrixName == "A" ? matrixALines : matrixBLines;
  const matrixColumns = matrixName == "A" ? matrixAColumns : matrixBColumns;

  const matrix = [];

  for (let i = 0; i < matrixLines; i++) {
    const matrixLine = [];

    for (let j = 0; j < matrixColumns; j++) {
      const matrixElement = document.getElementById(matrixName + i + j).value;

      if (matrixElement === "") return null;

      matrixLine.push(matrixElement);
    }

    matrix.push(matrixLine);
  }

  return matrix;
}

//used to put the result title based on the dynamic page joining
function getResultTitle(joinedPage, calcuationResult) {
  const possibePages = [
    "determinantCaclucation",
    "multiplicationCalculation",
    "additionCalculation",
    "substractionCalculation",
    "systemSolvingCalculation",
    "inverseCalculation",
    "transposeCalculation",
    "rankCalculation",
  ];

  if (joinedPage == possibePages[0]) return calcuationResult[0];
  else if (joinedPage == possibePages[1]) return calcuationResult[1];
  else if (joinedPage == possibePages[2]) return calcuationResult[2];
  else if (joinedPage == possibePages[3]) return calcuationResult[3];
  else if (joinedPage == possibePages[4]) return calcuationResult[4];
  else if (joinedPage == possibePages[5]) return calcuationResult[5];
  else if (joinedPage == possibePages[6]) return calcuationResult[6];
  else if (joinedPage == possibePages[7]) return calcuationResult[7];
}

//this function is used to return the url that we need to fetch on it
function getMatrixUrl(typeCalculation, matrixId) {
  if (typeCalculation == "determinantCaclucation")
    return (
      process.env.backendDomainName + "/matrix/determinant/" + matrixId + "/"
    );
  else if (typeCalculation == "rankCalculation")
    return process.env.backendDomainName + "/matrix/rank/" + matrixId + "/";
  else if (typeCalculation == "systemSolvingCalculation")
    return process.env.backendDomainName + "/matrix/solve/" + matrixId + "/";
  else if (typeCalculation == "multiplicationCalculation")
    return process.env.backendDomainName + "/matrix/multiply/" + matrixId + "/";
  else if (typeCalculation == "additionCalculation")
    return process.env.backendDomainName + "/matrix/add/" + matrixId + "/";
  else if (typeCalculation == "substractionCalculation")
    return (
      process.env.backendDomainName + "/matrix/substract/" + matrixId + "/"
    );
  else if (typeCalculation == "inverseCalculation")
    return process.env.backendDomainName + "/matrix/inverse/" + matrixId + "/";
  else if (typeCalculation == "transposeCalculation")
    return (
      process.env.backendDomainName + "/matrix/transpose/" + matrixId + "/"
    );
}

//this function is used to see the calculated matrices to get that result
function seeCalculatedMatrices(content) {
  const seeCalculatedMatricesButton = document.getElementById(
    "displayCalculatedMatricesButton",
  );
  const calculatedMatrices = document.getElementById("calculatedMatrices");

  if (calculatedMatrices.classList.contains("hidden")) {
    calculatedMatrices.classList.remove("hidden");

    if (seeCalculatedMatricesButton.innerText.includes("la matrice"))
      seeCalculatedMatricesButton.innerHTML = content.hideCalculatedMatrix;
    else seeCalculatedMatricesButton.innerHTML = content.hideCalculatedMatrices;
  } else {
    calculatedMatrices.classList.add("hidden");

    if (seeCalculatedMatricesButton.innerText.includes("la matrice"))
      seeCalculatedMatricesButton.innerHTML = content.checkCalculatedMatrix;
    else
      seeCalculatedMatricesButton.innerHTML = content.checkCalculatedMatrices;
  }
}
