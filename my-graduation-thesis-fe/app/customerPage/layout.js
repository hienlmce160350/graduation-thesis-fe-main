import CusFooter from "../../components/cusfooter";
import CusNavigation from "../../components/cusnavigation";
import dynamic from "next/dynamic";

const Mess = dynamic(() => import("../../components/messenger"), {
  ssr: false,
});
export default function CustomerLayout({ children }) {
  return (
    <>
      <CusNavigation></CusNavigation>
      {children}
      <CusFooter />
      <Mess />
    </>
  );
}
