"use client";
import React from "react";
import { Nav } from "@douyinfe/semi-ui";
import Image from "next/image";
import Link from "next/link";
import { FaStore } from "react-icons/fa";
import { FaBlog } from "react-icons/fa";
import logoShop from "../public/staticImage/logoShop.png";
import { TbLogout2 } from "react-icons/tb";
import { FaHome } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { MdLocalShipping } from "react-icons/md";
import { FcStatistics } from "react-icons/fc";
import { MdDiscount } from "react-icons/md";
import { FaUsers } from "react-icons/fa";

const navComponent = () => {
  return (
    <>
      <Nav
        bodyStyle={{}}
        onSelect={(data) => console.log("trigger onSelect: ", data)}
        onClick={(data) => console.log("trigger onClick: ", data)}
        className="!w-full h-full"
      >
        <Nav.Header
          logo={
            <Image
              src={logoShop}
              width={500}
              height={500}
              style={{ borderRadius: "50%" }}
              alt="Picture of the author"
            />
          }
          text={"EatRightify System"}
        />
        <Link href={"/"}>
          <Nav.Item
            itemKey={"home"}
            text={"Home"}
            icon={<FaHome className="w-5 h-5 p-0" />}
            className="!font-semibold"
          />
        </Link>
        <Nav.Sub
          itemKey={"product"}
          text="Product Management"
          icon={<FaStore className="w-5 p-0" />}
        >
          <Link href={"/adminPage/product/product-list"}>
            <Nav.Item itemKey={"product-list"} text={"List"} />
          </Link>
          <Link href={"/adminPage/product/product-create"}>
            <Nav.Item itemKey={"product-create"} text={"Create"} />
          </Link>
        </Nav.Sub>
        {/* test */}
        <Nav.Sub
          itemKey={"category"}
          text="Category Management"
          icon={<BiSolidCategory className="w-5 h-5 p-0" />}
        >
          <Link href={"/adminPage/category/category-list"}>
            <Nav.Item itemKey={"category-list"} text={"List"} />
          </Link>
          <Link href={"/adminPage/category/category-create"}>
            <Nav.Item itemKey={"category-create"} text={"Create"} />
          </Link>
        </Nav.Sub>
        {/* test */}
        <Nav.Sub
          itemKey={"order"}
          text="Order Management"
          icon={<MdLocalShipping className="w-5 h-5 p-0" />}
        >
          <Link href={"/adminPage/order/order-list"}>
            <Nav.Item itemKey={"order-list"} text={"List"} />
          </Link>
        </Nav.Sub>
        <Nav.Sub
          itemKey={"statistical"}
          text="Statistical Management"
          icon={<FcStatistics className="w-5 h-5 p-0" />}
        >
          <Link
            href={"/adminPage/statistical/statistics-of-best-selling-products"}
          >
            <Nav.Item
              itemKey={"statistics-of-best-selling-products"}
              text={"Statistics of best-selling products"}
            />
          </Link>
        </Nav.Sub>
        <Nav.Sub
          itemKey={"blog-management"}
          text="Blog Management"
          icon={<FaBlog style={{ width: "20px" }} />}
        >
          <Link href={"/adminPage/blog/blog-list"}>
            <Nav.Item itemKey={"blog-list"} text={"List"} />
          </Link>
          <Link href={"/adminPage/blog/blog-create"}>
            <Nav.Item itemKey={"blog-create"} text={"Create"} />
          </Link>
        </Nav.Sub>
        <Nav.Sub
          itemKey={"promotion"}
          text="Promotion Management"
          icon={<MdDiscount className="w-5 h-5 p-0" />}
        >
          <Link href={"/adminPage/promotion/promotion-list"}>
            <Nav.Item itemKey={"promotion-list"} text={"List"} />
          </Link>
          <Link href={"/adminPage/promotion/promotion-create"}>
            <Nav.Item itemKey={"promotion-create"} text={"Create"} />
          </Link>
        </Nav.Sub>

        <Nav.Sub
          itemKey={"user"}
          text="User Management"
          icon={<FaUsers className="w-5 h-5 p-0" />}
        >
          <Link href={"/adminPage/user/user-list"}>
            <Nav.Item itemKey={"user-list"} text={"List"} />
          </Link>
          <Link href={"/adminPage/user/user-create"}>
            <Nav.Item itemKey={"user-create"} text={"Create"} />
          </Link>
        </Nav.Sub>

        <Nav.Sub
          itemKey={"result"}
          text="Result Management"
          icon={<FaUsers className="w-5 h-5 p-0" />}
        >
          <Link href={"/verifierPage/result/result-list"}>
            <Nav.Item itemKey={"result-list"} text={"List"} />
          </Link>
        </Nav.Sub>

        <Link href={"/auth/login"}>
          <Nav.Item
            itemKey={"logout"}
            text="Logout"
            className="!font-semibold hover:bg-gray-100"
            icon={<TbLogout2 className="w-5 h-5 text-red-600" />}
          ></Nav.Item>
        </Link>

        <Nav.Footer
          collapseButton={true}
          collapseText={(collapsed) =>
            collapsed ? "Extend the sidebar" : "Collapse the sidebar"
          }
        />
      </Nav>
    </>
  );
};

export default navComponent;
