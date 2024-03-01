import CusFooter from "../../components/cusfooter";
import NewNavigation from "../../components/newcusnavigation";

export default function CustomerLayout({ children }) {
  return (
    <>
      <NewNavigation></NewNavigation>
      {children}
      <CusFooter />
    </>
  );
}
