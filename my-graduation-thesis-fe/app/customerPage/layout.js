import CusFooter from "../../components/cusfooter";
import NewNavigation from "../../components/newcusnavigation";
import CusNavigation from "../../components/cusnavigation";
export default function CustomerLayout({ children }) {
  return (
    <>
      <CusNavigation></CusNavigation>
      {children}
      <CusFooter />
    </>
  );
}
