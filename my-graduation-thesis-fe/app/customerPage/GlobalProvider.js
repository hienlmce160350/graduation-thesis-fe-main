import { CartProvider } from "../../context/CartContext";

export function GlobalProvider({ children }) {
  return <CartProvider>{children}</CartProvider>;
}
export default GlobalProvider;
