"use client";
import { IllustrationNotFound } from "@douyinfe/semi-illustrations";
import { Empty } from "@douyinfe/semi-ui";
/* The following is available after version 1.13.0 */
import { IllustrationNotFoundDark } from "@douyinfe/semi-illustrations";
import Link from "next/link";
export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
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
      <Link href={"/customerPage/product/product-list"}>
        <button className="buttonGradient border rounded-lg w-48 lg:w-48 font-bold text-white mt-5">
          GOTO HOMEPAGE
        </button>
      </Link>
    </div>
  );
}
