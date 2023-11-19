
import {CalculationResult} from './resultCalculationPage'

export function generateStaticParams(){
    return [{ calculationResult: 'determinantCaclucation' }, { calculationResult: 'multiplicationCalculation' }, { calculationResult: 'additionCalculation' }, { calculationResult: 'substractionCalculation' }, { calculationResult: 'systemSolvingCalculation' }, {calculationResult : 'inverseCalculation'}, {calculationResult : 'transposeCalculation'}, {calculationResult : 'rankCalculation'}]
}

export default function page({params}){

    return (
        <CalculationResult params={params} />

    )
}