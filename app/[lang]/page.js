import MatrixOperations from '../components/matrixOperations'
import {getDictionary} from "../../dictionnaries/dictionaries"

const functionalities = ['multiplication', "system", "inverse", "transpose", "determinant", "addSous", "rank"]


export default async function Home({params}){

    const dict = await getDictionary(params.lang)

    const translatedFunctionnalities = functionalities.map(functionnality => dict.operations[functionnality])
    
    return (
        <div className='lg:pl-[100px] px-[20px]'>
            
            <MatrixOperations functionnalities={translatedFunctionnalities} multiplicationPageData={dict.matrixMultiplication}  />
            
        </div>
    )
}