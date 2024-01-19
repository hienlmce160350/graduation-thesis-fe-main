import { DM_Sans } from "next/font/google";
import "./globals.css";
import Navigation from "../components/navigation";
import Test from "../components/test";
import CusNavigation from "../components/cusnavigation";
import CusHome from "../app/customerPage/home/page";
import CusFooter from "../components/cusfooter";
import HeadComponent from "../components/header";
import ProductPage from "../app/customerPage/product/page";
import LocationPage from "../app/customerPage/location/page";
const dm_sans = DM_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "EatRightify System",
  description: "EatRightify System capstone project SP24 wow",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={dm_sans.className}>
        {/* <div className="flex">
          
          <div className="flex flex-col">
            <HeadComponent></HeadComponent>
         

          </div>
        </div> */}

        <div class="flex">
          <div class="w-1/5 bg-gray-300">
            <Navigation></Navigation>
          </div>

          <div class="flex-1 flex flex-col">
            <div class="flex-1 bg-white p-4 border">
              <HeadComponent></HeadComponent>
            </div>
            <div class="flex-1 bg-white p-4 border">{children}</div>
          </div>
        </div>

        {/* <CusNavigation/>
        <CusHome/> */}
        {/* <ProductPage/> */}
        {/* <CusFooter/> */}

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
