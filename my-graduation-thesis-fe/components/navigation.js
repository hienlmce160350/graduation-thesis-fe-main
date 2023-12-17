"use client";
import React from "react";
import { Nav } from "@douyinfe/semi-ui";
import { IconUser, IconStar, IconUserGroup } from "@douyinfe/semi-icons";
// import logoShop from "";
import Image from "next/image";
import Link from "next/link";
import { FaStore } from "react-icons/fa";
import { FaBlog } from "react-icons/fa";
import logoShop from "../public/staticImage/logoShop.png";
import { TbLogout2 } from "react-icons/tb";
import { FaHome } from "react-icons/fa";

const navComponent = () => {
  return (
    <>
      <Nav
        bodyStyle={{}}
        defaultOpenKeys={["user", "union"]}
        onSelect={(data) => console.log("trigger onSelect: ", data)}
        onClick={(data) => console.log("trigger onClick: ", data)}
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
            className="font-semibold"
          />
        </Link>
        <Nav.Sub
          itemKey={"product"}
          text="Product Management"
          icon={<FaStore className="w-5 p-0" />}
        >
          <Link href={"/adminPage/product"}>
            <Nav.Item itemKey={"product-list"} text={"Product Management"} />
          </Link>
          <Nav.Item
            itemKey={"product-category-list"}
            text={"Category Management"}
          />
        </Nav.Sub>
        {/* test */}
        <Nav.Sub
          itemKey={"role"}
          text="Role Management"
          icon={<FaStore className="w-5 p-0" />}
        >
          <Link href={"/role/list"}>
            <Nav.Item itemKey={"role-list"} text={"List"} />
          </Link>
          <Nav.Item itemKey={"role-create"} text={"Create"} />
        </Nav.Sub>
        {/* test */}
        <Nav.Sub
          itemKey={"user-management"}
          text="User Management"
          icon={<IconUserGroup />}
        >
          <Nav.Item itemKey={"notice"} text={"Announcement Settings"} />
          <Nav.Item itemKey={"query"} text={"Union Query"} />
          <Nav.Item itemKey={"info"} text={"Entry Information"} />
        </Nav.Sub>
        <Nav.Sub
          itemKey={"blog-management"}
          text="Blog Management"
          icon={<FaBlog style={{ width: "20px" }} />}
        >
          <Nav.Item itemKey={"notice"} text={"Announcement Settings"} />
          <Nav.Item itemKey={"query"} text={"Union Query"} />
          <Nav.Item itemKey={"info"} text={"Entry Information"} />
        </Nav.Sub>

        <Link href={"/adminPage/auth/login"}>
          <Nav.Item
            itemKey={"logout"}
            text="Logout"
            className="font-semibold hover:bg-gray-100"
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
