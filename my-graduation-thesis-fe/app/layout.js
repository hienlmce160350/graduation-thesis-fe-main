import { DM_Sans } from "next/font/google";
import "./globals.css";
import Navigation from "../components/navigation";
import Test from "../components/test";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import CusNavigation from "../components/cusnavigation";
import LandingCarousel from "../app/customerPage/home/page";
const dm_sans = DM_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "EatRightify System",
  description: "EatRightify System capstone project SP24",
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
      
        <LandingCarousel />
      </body>
    </html>
  );
}
