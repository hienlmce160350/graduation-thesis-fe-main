import { DM_Sans } from "next/font/google";
import "./globals.css";
import Navigation from "../components/navigation";
import Test from "../components/test";
import CusNavigation from "../components/cusnavigation";
import CusFooter from "../components/cusfooter";
import HeadComponent from "../components/header";
const dm_sans = DM_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "EatRightify System",
  description: "EatRightify System capstone project SP24 wow",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={dm_sans.className}>
        {/* { <div className="flex">

          <div className="flex flex-col">
            <HeadComponent></HeadComponent>


          </div>
        </div> } */}

         <div class="flex h-[100vh]">
          <div class="w-fit bg-gray-300">
            <Navigation></Navigation>
          </div>

          <div class="flex-1 flex flex-col">
            <div class="bg-white border">
              <HeadComponent></HeadComponent>
            </div>
            <div class="flex-1 bg-white p-4 border border-b-0">{children}</div>
          </div>
        </div>

        {/* <div className="relative">
          <CusNavigation />
          {children}
          <div className="absolute w-full">
            <CusFooter />
          </div>
        </div> */}
      </body>
    </html>
  );
}
