import { DM_Sans } from "next/font/google";
import "./globals.css";
import Navigation from "../components/navigation";
import Test from "../components/test";
import CusNavigation from "../components/cusnavigation";
import CusFooter from "../components/cusfooter";

import NewNavigation from "../components/newcusnavigation";
const dm_sans = DM_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "EatRightify System",
  description: "EatRightify System capstone project SP24",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={dm_sans.className}>{children}</body>
    </html>
  );
}
