'use client'

const functionalities = ['Multiplication matricielle', "Resoudre d'un systeme", "Inverse d'une matrice", "Transpose d'une matrice", "Determinant", "Addition/Substraction"]

export default function MatrixFunctionalities({selectedFunctionality, setMatrixFunctionnality}){

    const changeFunctionality = (choosedFunctionality) => {

        setMatrixFunctionnality(choosedFunctionality)
    }

    return (
        <div className="flex flex-col rounded-b-[20px] bg-[#424143] text-[#b5b5b5]">
            {
                functionalities.map((functionality, index) => <div key={index} id={'functionality' + index} className={"border-b-2 cursor-pointer border-[#a6a4a4] px-[15px] py-[10px] hover:text-white hover:bg-[url('../public/titleFont.png')]" + (index === functionalities.length-1 ? ' rounded-b-[20px]' : '') + (selectedFunctionality === index ? " text-white bg-[url('../public/titleFont.png')]" : "")} onClick={() => changeFunctionality(index)}>
                    {
                        functionality
                    }
                </div>)
            }
        </div>
    )
}