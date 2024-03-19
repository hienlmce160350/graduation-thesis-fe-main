"use client";
import { useContext, useEffect } from "react";
import { useAuth, AuthProvider } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { parseJwt } from "@/libs/commonFunction";

export function withAuth(WrappedPage, role) {
  const Wrapper = (props) => {
    // let { role } = useAuth();
    let router = useRouter();
    let token = Cookies.get("token");

    useEffect(() => {
      if (!token) {
        router.replace("/auth/login");
      } else {
        const roleFromToken =
          parseJwt(token)[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];

        if (!roleFromToken.includes(role)) {
          router.replace("/auth/403");
        }
      }
    }, [token]);

    return <WrappedPage {...props} />;
  };

  return Wrapper;
}
