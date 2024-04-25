import MatrixOperations from "../components/matrixOperations";
import { getDictionary } from "../../dictionnaries/dictionaries";

const functionalities = [
  "multiplication",
  "system",
  "inverse",
  "transpose",
  "determinant",
  "addSous",
  "rank",
];

export default async function Home({ params }) {
  const dict = await getDictionary(params.lang);

  const translatedFunctionnalities = functionalities.map(
    (functionnality) => dict.operations[functionnality],
  );

  return (
    <div className="lg:pl-[100px] px-[20px]">
      <MatrixOperations
        add_sousPageData={dict.add_sous}
        rankPageData={dict.rank}
        determinantPageData={dict.determinant}
        transposePageData={dict.transpose}
        inversePageData={dict.inverse}
        systemResolutionPageData={dict.systemResolution}
        inputText={dict.input}
        functionnalities={translatedFunctionnalities}
        multiplicationPageData={dict.matrixMultiplication}
      />
    </div>
  );
}
