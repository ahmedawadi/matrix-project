import './globals.css'
import { Inter } from 'next/font/google'
import Footer from './components/footer'
import { NavBar } from './components/navBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Matrix project',
  description: 'web site that calculate matrices operations and can ',
}

export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      <body className='backgroundImage min-h-screen w-full '>
        <div className='flex flex-col md:space-y-[50px] space-y-[30px] lg:space-y-[75px]'>
            <NavBar />
            {
              children
            }
            <Footer/>
            </div>
          </body>      

    </html>
  )
}
