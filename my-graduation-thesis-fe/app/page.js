"use client";
import { useEffect, useState } from "react";
import Login from "../app/auth/login/page.js";
import HomeCus from "../app/customerPage/home/page.js";
import CustomerPage from "../app/customerPage/layout.js";
import CustomerPage2 from "../app/customerPage/page.js";

import ManagerPage from "../app/managerPage/layout.js";
import ManagerPage2 from "../app/managerPage/page.js";

import AdminPage from "../app/adminPage/layout.js";
import AdminPage2 from "../app/adminPage/page.js";

import VerifierPage from "../app/verifierPage/layout.js";
import VerifierPage2 from "../app/verifierPage/page.js";
import { useAuth, AuthProvider } from "../context/AuthContext";
const Home = () => {
  const { role, user } = useAuth();
  const [checkAuthen, setCheckAuthen] = useState();
  useEffect(() => {
    let checkAuthen = JSON.stringify(user) === "{}" ? true : false;
    setCheckAuthen(checkAuthen);
  }, [user]);

  if (!checkAuthen) {
    if (role == "") {
      return (
        <>
          <CustomerPage>
            <CustomerPage2></CustomerPage2>
          </CustomerPage>
        </>
      );
    } else if (role.includes("manager")) {
      return (
        <>
          <ManagerPage>
            <ManagerPage2></ManagerPage2>
          </ManagerPage>
        </>
      );
    } else if (role.includes("admin") && !role.includes("manager")) {
      return (
        <>
          <AdminPage>
            <AdminPage2></AdminPage2>
          </AdminPage>
        </>
      );
    } else if (
      !role.includes("admin") &&
      !role.includes("manager") &&
      role.includes("verifier")
    ) {
      return (
        <>
          <VerifierPage>
            <VerifierPage2></VerifierPage2>
          </VerifierPage>
        </>
      );
    }
  } else {
    return (
      <>
        <CustomerPage>
          <CustomerPage2></CustomerPage2>
        </CustomerPage>
      </>
    );
  }
};

const HomeWithAuthProvider = () => (
  <AuthProvider>
    <Home />
  </AuthProvider>
);
export default HomeWithAuthProvider;
