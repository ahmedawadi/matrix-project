"use client";

import { useCallback, useEffect } from "react";
import { checkMatrixSize } from "../matrixInverse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function MatrixAdditionSubstractionInput({
  setAdditionOrSubstraction,
  additionOrSubstraction,
  getMatrix,
  matrixLines,
  matrixColumns,
  add_sousPageData,
}) {
  //this function is used to close the functionalities list when the user click outside of it and outside the button that open it
  const closeAdditionOrSubstractionListInOutSideClick = useCallback((event) => {
    const additionOrSubstractionList = document.getElementById(
      "additionOrSubstractionList",
    );
    const additionOrSubstractionListButton = document.getElementById(
      "additionOrSubstractionListButton",
    );

    if (
      !(
        additionOrSubstractionList.contains(event.target) ||
        additionOrSubstractionListButton.contains(event.target)
      )
    )
      closeAdditionOrSubstractionList();
  });

  useEffect(() => {
    //addition of the outside click of the addition or substraction list to the listenner functionalities
    if (typeof window !== "undefined") {
      addEventListener("click", closeAdditionOrSubstractionListInOutSideClick);
    }

    return () => {
      removeEventListener(
        "click",
        closeAdditionOrSubstractionListInOutSideClick,
      );
    };
  }, []);

  const chooseAdditionOrSubstraction = (additionOrSubstraction) => {
    setAdditionOrSubstraction(additionOrSubstraction);
    closeAdditionOrSubstractionList();
  };

  return (
    <div className="xl:px-[30px] xl:py-[0px] py-[5px] px-[10px] border-[1px] border-[#4a4a4a] shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)] flex xl:flex-row flex-col space-y-[15px] xl:space-y-[0px] xl:items-center xl:justify-center xl:space-x-[25px] w-full xl:h-[200px]">
      <div className="flex md:flex-row flex-col space-y-[5px] md:space-x-[15px] text-[20px]">
        <div>{add_sousPageData.dimension1Desc}</div>
        <div className="flex space-x-[15px]">
          <input
            type="number"
            id="matrixLines"
            defaultValue={"1"}
            value={matrixLines ? matrixLines : undefined}
            className='w-[50px] h-[30px] p-[5px] text-[18px] text-black hover:bg-[url("../public/titleFont.png")] focus:bg-[url("../public/titleFont.png")]'
            onChange={(event) => checkMatrixSize(event)}
          />
          <div>X</div>
          <input
            type="number"
            id="matrixColumns"
            defaultValue={"1"}
            value={matrixColumns ? matrixColumns : undefined}
            className='w-[50px] h-[30px] p-[5px] text-[18px] text-black hover:bg-[url("../public/titleFont.png")] focus:bg-[url("../public/titleFont.png")]'
            onChange={(event) => checkMatrixSize(event)}
          />
        </div>
      </div>
      <label htmlFor="additionOrSubstraction" className="flex space-x-[15px]">
        <div className="xl:hidden">{add_sousPageData.operationType}</div>
        <div
          id="additionOrSubstraction"
          className="bg-white w-fit text-black font-semibold relative border-2 border-[#4a4a4a] px-[5px] shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)]"
        >
          <div
            id="additionOrSubstractionListButton"
            className="flex items-center space-x-[15px] cursor-pointer"
            onClick={openAdditionOrSubstractionList}
          >
            <div className="font-bold text-[22px]">
              {additionOrSubstraction === 0 ? "+" : "-"}
            </div>

            <FontAwesomeIcon icon={faChevronDown} />
          </div>

          <div
            id="additionOrSubstractionList"
            className="hidden absolute right-0 w-full top-[40px] flex flex-col bg-white border-[1px] border-[#4a4a4a]"
          >
            <div
              className="flex justify-center hover:bg-[url('../public/titleFont.png')] active:bg-[url('../public/titleFont.png')]  cursor-pointer"
              onClick={() => chooseAdditionOrSubstraction(0)}
            >
              +
            </div>
            <div
              className="flex justify-center border-t-[1px] border-[#4a4a4a] hover:bg-[url('../public/titleFont.png')] active:bg-[url('../public/titleFont.png')]  cursor-pointer"
              onClick={() => chooseAdditionOrSubstraction(1)}
            >
              -
            </div>
          </div>
        </div>
      </label>

      <div className="h-full flex justify-center items-center">
        <button
          className="font-semibold border-2 border-[#4a4a4a] text-white px-[10px] py-[5px] shadow-[-1px_-1px_1px_rgba(0,0,0,0.7)]"
          onClick={getMatrix}
        >
          {add_sousPageData.calculationButtonName}
        </button>
      </div>
    </div>
  );
}

//this function is used to close the additionOrSubstraction list
function closeAdditionOrSubstractionList() {
  const additionOrSubstractionList = document.getElementById(
    "additionOrSubstractionList",
  );

  if (!additionOrSubstractionList.classList.contains("hidden"))
    additionOrSubstractionList.classList.add("hidden");
}

//this function is used to open the additionOrSubstraction list
function openAdditionOrSubstractionList() {
  const additionOrSubstractionList = document.getElementById(
    "additionOrSubstractionList",
  );

  if (additionOrSubstractionList.classList.contains("hidden"))
    additionOrSubstractionList.classList.remove("hidden");
}
