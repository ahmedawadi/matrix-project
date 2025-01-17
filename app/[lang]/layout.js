import "../globals.css";
import { Inter } from "next/font/google";
import Footer from "../components/footer";
import { NavBar } from "../components/navBar";
import { getDictionary } from "../../dictionnaries/dictionaries";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Matrices Calculation",
  description:
    "web site that calculate matrices operations and can be used to calculate with different algorithms on the matrices and with different matrices types",
};

const navBarElements = ["home", "about_us", "feedback"];

export default async function RootLayout({ children, params }) {
  const dict = await getDictionary(params.lang);
  const translatedNavBarElements = navBarElements.map(
    (navBarElement) => dict.navBar[navBarElement],
  );

  return (
    <html lang="en">
      <body className="backgroundImage min-h-screen w-full flex flex-col justify-between">
        <div className="flex flex-col md:space-y-[50px] space-y-[30px] lg:space-y-[75px]">
          <NavBar
            title={dict.navBar.title}
            navBarElements={translatedNavBarElements}
          />
          {children}
        </div>
        <div className="mt-[60px]">
          {" "}
          <Footer footerElements={dict.footer} />
        </div>
      </body>
    </html>
  );
}
