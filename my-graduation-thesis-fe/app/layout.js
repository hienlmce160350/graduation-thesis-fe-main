import { DM_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const dm_sans = DM_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "EatRightify System",
  description: "EatRightify System capstone project SP24",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={dm_sans.className}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
