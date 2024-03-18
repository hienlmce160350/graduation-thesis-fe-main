"use client";
import { useEffect, useState } from "react";
import { IllustrationNotFound } from "@douyinfe/semi-illustrations";
import { Empty } from "@douyinfe/semi-ui";
/* The following is available after version 1.13.0 */
import { IllustrationNotFoundDark } from "@douyinfe/semi-illustrations";
import Link from "next/link";
import { parseJwt } from "@/libs/commonFunction";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function NotFoundPage() {
  const router = useRouter();
  const token = Cookies.get("token");

  let linkHome = "/";
  if (!token) {
    linkHome = "/auth/login"; // Change router.replace to updating linkHome
  } else {
    const roleFromToken =
      parseJwt(token)[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ];
    if (roleFromToken == "") {
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

  useEffect(() => {
    // Redirect logic runs only on the client-side
    if (!token) {
      router.replace("/auth/login");
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <div className="flex flex-col items-center justify-center h-[100vh]">
      <Empty
        image={<IllustrationNotFound style={{ width: 250, height: 250 }} />}
        darkModeImage={
          <IllustrationNotFoundDark style={{ width: 250, height: 250 }} />
        }
        description={<p className="font-bold text-lg">404 - PAGE NOT FOUND</p>}
      />
      <p className="font-extralight">
        The page you are looking for might be removed or temporarily unavailable
      </p>
      <Link href={linkHome}>
        <button className="rounded-sm bg-[#74A65D] text-white hover:bg-[#44703D] w-48 lg:w-48 font-bold mt-5 p-2">
          GOTO HOMEPAGE
        </button>
      </Link>
    </div>
  );
}
