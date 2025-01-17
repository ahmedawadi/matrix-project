import { getDictionary } from "../../../dictionnaries/dictionaries";
import FeedBack from "./feedBack";

export default async function Page({ params }) {
  const dict = await getDictionary(params.lang);

  return <FeedBack content={dict.feedBack} />;
}
