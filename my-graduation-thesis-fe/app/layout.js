import { DM_Sans } from "next/font/google";
import {GlobalProvider} from "./customerPage/GlobalProvider";
import "./globals.css";

const dm_sans = DM_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "EatRightify System",
  description: "EatRightify System capstone project SP24",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={dm_sans.className}>
        <GlobalProvider></GlobalProvider>
        {children}
      </body>
    </html>
  );
}
