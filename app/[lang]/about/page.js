import { getDictionary } from "../../../dictionnaries/dictionaries"

export default async function Page({params}){
    
    const dict = await getDictionary(params.lang)

    return (
        <div className="flex justify-center">
            <div className='md:w-[70%] w-[90%] bg-[#424143] py-[16px] xl:px-[50px] px-[15px]  flex flex-col'>
                <div className='w-full flex justify-end font-semibold text-[28px] text-white pb-[16px] border-b-[0.5px] border-[#4a4a4a] font-serif shadow-[0_1px_0_rgba(10,10,10,0.5)]'>
                    {
                        dict.about.pageName
                    }
                </div>
                <p className='xl:text-[22px] pt-[16px] px-[16px] text-[#b5b5b5] text-[18px] font-serif'>
                    <span className="xl:text-[27px] text-[23px] font-extrabold mr-[8px]">
                        {
                            dict.about.content.firstWord
                        }
                    </span> 
                    
                        {
                            dict.about.content.firstParagraph
                        }
                        <br/>
                        {
                            dict.about.content.secondParagraph
                        }
                        <br/>
                        {
                            dict.about.content.thirdParagraph
                        }
                    
                </p>
            </div>
        </div>
    )
}