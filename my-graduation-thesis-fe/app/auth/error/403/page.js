"use client";
import { IllustrationNoAccessDark } from "@douyinfe/semi-illustrations";
import { Empty } from "@douyinfe/semi-ui";
/* The following is available after version 1.13.0 */
import { IllustrationNoAccess } from "@douyinfe/semi-illustrations";
import Link from "next/link";
export default function NotPermissionPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
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
      <Link href={"/customerPage/product/product-list"}>
        <button className="buttonGradient border rounded-lg w-48 lg:w-48 font-bold text-white mt-5">
          GOTO HOMEPAGE
        </button>
      </Link>
    </div>
  );
}
