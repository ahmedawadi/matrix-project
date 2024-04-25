"use client";

import MatrixFunctionalities from "../components/functionalitiesList";
import MultiplicationMatrices from "../multpilcationMatrices";
import SystemSolving from "../systemSolving";
import { useState } from "react";
import MatrixInverse from "../matrixInverse";
import MatrixTranspose from "../matrixTranspose";
import Determinant from "../determinant";
import AdditionSubstraction from "../additionSubstraction";
import MatrixRank from "../rank";

export default function MatrixOperations({
  functionnalities,
  multiplicationPageData,
  inputText,
  systemResolutionPageData,
  inversePageData,
  transposePageData,
  determinantPageData,
  rankPageData,
  add_sousPageData,
}) {
  const [matrixFunctionnality, setMatrixFunctionnality] = useState(0); //used to choose which matrix functionality will be displayed to the user

  return (
    <div className="flex flex-col md:flex-row md:space-x-[10px]  md:space-y-[0px] space-y-[10px] md:w-[80%] w-full">
      <div>
        <MatrixFunctionalities
          functionalities={functionnalities}
          selectedFunctionality={matrixFunctionnality}
          setMatrixFunctionnality={setMatrixFunctionnality}
        />
      </div>
      {matrixFunctionnality === 0 ? (
        <MultiplicationMatrices
          inputText={inputText}
          multiplicationPageData={multiplicationPageData}
        />
      ) : matrixFunctionnality === 1 ? (
        <SystemSolving
          inputText={inputText}
          systemResolutionPageData={systemResolutionPageData}
        />
      ) : matrixFunctionnality === 2 ? (
        <MatrixInverse
          inversePageData={inversePageData}
          inputText={inputText}
        />
      ) : matrixFunctionnality === 3 ? (
        <MatrixTranspose
          transposePageData={transposePageData}
          inputText={inputText}
        />
      ) : matrixFunctionnality === 4 ? (
        <Determinant
          determinantPageData={determinantPageData}
          inputText={inputText}
        />
      ) : matrixFunctionnality === 5 ? (
        <AdditionSubstraction
          add_sousPageData={add_sousPageData}
          inputText={inputText}
        />
      ) : matrixFunctionnality === 6 ? (
        <MatrixRank rankPageData={rankPageData} inputText={inputText} />
      ) : null}
    </div>
  );
}
