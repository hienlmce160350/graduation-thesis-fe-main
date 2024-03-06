"use client";
import Login from "../app/auth/login/page.js";
import HomeCus from "../app/customerPage/home/page.js";
import CustomerPage from "../app/customerPage/layout.js";
import CustomerPage2 from "../app/customerPage/page.js";

import { useAuth, AuthProvider } from "../context/AuthContext";
const Home = () => {
  const { role, user } = useAuth();
  console.log("Role: homepage " + role);
  console.log("User: homepage " + JSON.stringify(user));

  let checkAuthen = JSON.stringify(user) === "{}" ? true : false;

  console.log("Check Authen: homepage " + checkAuthen);

  if (checkAuthen) {
    return (
      <>
        <CustomerPage>
          <CustomerPage2></CustomerPage2>
        </CustomerPage>
      </>
    );
  } else {
    if (role == "") {
      return <HomeCus></HomeCus>;
    } else {
      return (
        <>
          <Login></Login>
        </>
      );
    }
  }
};

const HomeWithAuthProvider = () => (
  <AuthProvider>
    <Home />
  </AuthProvider>
);
export default HomeWithAuthProvider;
