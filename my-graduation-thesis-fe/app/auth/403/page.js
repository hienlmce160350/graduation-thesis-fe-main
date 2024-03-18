"use client";
import { IllustrationNoAccessDark } from "@douyinfe/semi-illustrations";
import { Empty } from "@douyinfe/semi-ui";
/* The following is available after version 1.13.0 */
import { IllustrationNoAccess } from "@douyinfe/semi-illustrations";
import Link from "next/link";
import { parseJwt } from "@/libs/commonFunction";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function NotPermissionPage() {
  const router = useRouter();
  const token = Cookies.get("token");

  useEffect(() => {
    // Redirect to login if token is missing
    if (!token) {
      router.replace("/auth/login");
    }
  }, [token, router]);

  let linkHome = "/";
  if (token) {
    const roleFromToken =
      parseJwt(token)[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ];
    if (roleFromToken === "") {
      linkHome = "/customerPage";
    } else if (roleFromToken.includes("manager")) {
      linkHome = "/managerPage";
    } else if (
      roleFromToken.includes("admin") &&
      !roleFromToken.includes("manager")
    ) {
      linkHome = "/adminPage";
    } else if (
      !roleFromToken.includes("admin") &&
      !roleFromToken.includes("manager") &&
      roleFromToken.includes("verifier")
    ) {
      linkHome = "/verifierPage";
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-[100vh]">
      <Empty
        image={<IllustrationNoAccess style={{ width: 250, height: 250 }} />}
        darkModeImage={
          <IllustrationNoAccessDark style={{ width: 250, height: 250 }} />
        }
        description={
          <p className="font-bold text-lg">403 - Permission denied</p>
        }
      />
      <p className="font-extralight">
        You do not have permission to access this page
      </p>
      <Link href={linkHome}>
        <button className="rounded-sm bg-[#74A65D] hover:bg-[#44703D] w-48 lg:w-48 font-bold text-white mt-5">
          GOTO HOMEPAGE
        </button>
      </Link>
    </div>
  );
}
