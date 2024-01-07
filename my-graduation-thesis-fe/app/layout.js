import { DM_Sans } from "next/font/google";
import "./globals.css";
import Navigation from "../components/navigation";
import Test from "../components/test";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import CusNavigation from "../components/cusnavigation";
import CusHome from "../app/customerPage/home/page";
import CusFooter from "../components/cusfooter";
import ProductPage from "./customerPage/product/product-list/page";
import ProductDetail from "./customerPage/product/product-detail/[id]/page";

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
          <Navigation></Navigation>
          <Test></Test>
          {children}
         
        </div> */}
        <div className="relative">
          <CusNavigation />
          {/* <CusHome/> */}
          {/* <ProductPage /> */}
          {/* <ProductDetail/> */}
          {children}
          <div className="absolute w-full">
            <CusFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
