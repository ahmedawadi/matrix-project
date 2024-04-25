export default function CalculatedMatrices({
  calcultionType,
  firstMatrix,
  secondMatrix,
}) {
  return (
    firstMatrix && (
      <div className="flex space-x-[20px] items-center justify-center overflow-x-auto w-full px-[20px]">
        <div className="overflow-x-auto flex space-x-[10px]">
          <table className="border-collapse border border-[#c2c2c2]">
            <thead>
              <tr>
                {Array.from({ length: Number(firstMatrix[0]?.length) + 1 }).map(
                  (_, index) =>
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
                          {calcultionType == "systemSolvingCalculation"
                            ? "X"
                            : "A"}
                          <div className="mt-[7px] ">{index}</div>
                        </div>
                      </th>
                    ),
                )}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: firstMatrix?.length }).map(
                (_, lineIndex) => (
                  <tr
                    key={lineIndex}
                    className="border border-[#c2c2c2] border-[2px]"
                  >
                    <td className="xl:text-[22px] xl:p-[5px] p-[2px] text-[18px] font-extrabold text-[#c2c2c2] border border-[#c2c2c2] border-[2px]">
                      {Number(lineIndex) + 1}
                    </td>
                    {Array.from({ length: firstMatrix[0]?.length }).map(
                      (_, columnIndex) => (
                        <td
                          key={columnIndex}
                          className="xl:text-[22px] text-[15px] border border-[#c2c2c2] border-[2px]"
                        >
                          <div className="flex justify-center items-center text-white">
                            {Math.round(
                              firstMatrix[lineIndex][columnIndex] * 100,
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
          {calcultionType == "systemSolvingCalculation" ? (
            <div className="flex space-x-[10px]">
              <div className="h-full w-[2px] bg-[#c2c2c2]"></div>
              <table className="flex flex-col border">
                <thead className="flex justify-center">
                  <tr>
                    <th className="font-extrabold text-[22px] text-[#c2c2c2]  border-[#c2c2c2] py-[5px]">
                      b
                    </th>
                  </tr>
                </thead>
                <tbody className="flex flex-col">
                  {Array.from({ length: secondMatrix?.length }).map(
                    (_, lineIndex) => (
                      <tr
                        key={lineIndex}
                        className="xl:text-[22px] text-[15px] border border-[#c2c2c2] px-[10px] py-[5px]"
                      >
                        <td className="flex justify-center items-center text-white">
                          {Math.round(secondMatrix[lineIndex] * 100) / 100}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
        <div className="text-[35px] font-extrabold">
          {!secondMatrix
            ? null
            : calcultionType == "multiplicationCalculation"
              ? "X"
              : calcultionType == "additionCalculation"
                ? "+"
                : calcultionType == "substractionCalculation"
                  ? "-"
                  : null}
        </div>
        {calcultionType == "systemSolvingCalculation" ||
        !secondMatrix ? null : (
          <div className="overflow-x-auto">
            <table className="border-collapse border border-[#c2c2c2]">
              <thead>
                <tr>
                  {Array.from({
                    length: Number(secondMatrix[0]?.length) + 1,
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
                          B<div className="mt-[7px] ">{index}</div>
                        </div>
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: secondMatrix?.length }).map(
                  (_, lineIndex) => (
                    <tr
                      key={lineIndex}
                      className="border border-[#c2c2c2] border-[2px]"
                    >
                      <td className="xl:text-[22px] xl:p-[5px] p-[2px] text-[18px] font-extrabold text-[#c2c2c2] border border-[#c2c2c2] border-[2px]">
                        {Number(lineIndex) + 1}
                      </td>
                      {Array.from({ length: secondMatrix[0]?.length }).map(
                        (_, columnIndex) => (
                          <td
                            key={columnIndex}
                            className="xl:text-[22px] text-[15px] border border-[#c2c2c2] border-[2px]"
                          >
                            <div className="flex justify-center items-center text-white">
                              {Math.round(
                                secondMatrix[lineIndex][columnIndex] * 100,
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
        )}
      </div>
    )
  );
}
