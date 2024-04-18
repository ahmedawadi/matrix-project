
import { getDictionary } from '../../../dictionnaries/dictionaries'
import {CalculationResult} from './resultCalculationPage'

export function generateStaticParams(){
    return [{ calculationResult: 'determinantCaclucation' }, { calculationResult: 'multiplicationCalculation' }, { calculationResult: 'additionCalculation' }, { calculationResult: 'substractionCalculation' }, { calculationResult: 'systemSolvingCalculation' }, {calculationResult : 'inverseCalculation'}, {calculationResult : 'transposeCalculation'}, {calculationResult : 'rankCalculation'}]
}

export default async function page({params}){
    
    const dict = await getDictionary(params.lang)
    
    return (
        <CalculationResult content={dict.resultPage} params={params} />

    )
}