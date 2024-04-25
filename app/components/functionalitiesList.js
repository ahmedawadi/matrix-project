"use client";

export default function MatrixFunctionalities({
  selectedFunctionality,
  setMatrixFunctionnality,
  functionalities,
}) {
  const changeFunctionality = (choosedFunctionality) => {
    setMatrixFunctionnality(choosedFunctionality);
  };

  return (
    <div className="flex md:flex-col md:space-x-[0px] space-x-[5px] rounded-[20px] text-[#b5b5b5] overflow-auto">
      {functionalities.map((functionality, index) => (
        <div
          key={index}
          id={"functionality" + index}
          className={
            "flex items-center justify-center border-b-2 cursor-pointer text-center border-[#a6a4a4] px-[15px] py-[10px] bg-[#424143] hover:text-white hover:bg-[url('../public/titleFont.png')]" +
            (selectedFunctionality === index
              ? " text-white bg-[url('../public/titleFont.png')]"
              : "")
          }
          onClick={() => changeFunctionality(index)}
        >
          {functionality}
        </div>
      ))}
    </div>
  );
}
