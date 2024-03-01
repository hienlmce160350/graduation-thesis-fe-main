"use client";
import React, { useState, useEffect } from "react";
import { Nav, Avatar, Dropdown } from "@douyinfe/semi-ui";
import Link from "next/link";
import Cookies from "js-cookie"; // Import the js-cookie library
import {
  IconStar,
  IconUser,
  IconUserGroup,
  IconSetting,
  IconBulb,
  IconMapPin,
  IconCart,
  IconBox,
  IconArticle,
  IconShoppingBag,
} from "@douyinfe/semi-icons";

const NewNavigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to check login status

  useEffect(() => {
    // Check if userId exists in cookies
    const userId = Cookies.get("userId");
    setIsLoggedIn(!!userId); // Update login status based on the existence of userId in cookies
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    // Clear the userId cookie
    Cookies.remove("userId");
    // Update the login status
    setIsLoggedIn(false);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <Nav
          style={{ backgroundColor: "#F4FFEB" }}
          mode={"horizontal"}
          items={[
            {
              itemKey: "product",
              text: "Product",
              icon: <IconShoppingBag />,
              link: "/customerPage/product/product-list",
            },
            {
              itemKey: "blog",
              text: "Blog",
              icon: <IconArticle />,
              link: "/customerPage/blog/blog-list",
            },
            {
              itemKey: "aihelp",
              text: "AI Help",
              icon: <IconBulb />,
              link: "/customerPage/AI",
            },
            {
              text: "Location",
              icon: <IconMapPin />,
              itemKey: "location",
              link: "/customerPage/location",
            },
            {
              text: "Cart",
              icon: <IconCart />,
              itemKey: "cart",
              link: "/",
            },
            // {
            //   text: "My Order",
            //   icon: <IconSetting />,
            //   itemKey: "myorder",
            //   link: "/customerPage/order-history/order-list",
            // },
            {
              text: "Order",
              icon: <IconBox />,
              itemKey: "order",
              link: "/",
            },
          ]}
          onSelect={(key) => console.log(key)}
          header={{
            logo: <img src="/staticImage/logoShop2.png" />,
            text: "EatRightify System",
            link: "/customerPage/home",
          }}
          footer={
            isLoggedIn ? ( // Check if logged in
              <Dropdown
                className="!rounded-lg"
                style={{ background: "white" }}
                position="bottomRight"
                render={
                  <>
                    <Dropdown.Menu className="border">
                      <Dropdown.Item className="hover:!bg-[#F4FFEB]">
                        <Link href={"/customerPage/my-profile"}>
                          My Profile
                        </Link>
                      </Dropdown.Item>
                      <Dropdown.Item className="hover:!bg-[#F4FFEB]">
                        <Link href={"/customerPage/order-history/order-list"}>
                          My Order
                        </Link>
                      </Dropdown.Item>
                      <Dropdown.Item className="hover:!bg-[#F4FFEB]">
                        <Link
                          className="text-red-600"
                          href="/auth/login"
                          onClick={handleLogout}
                        >
                          Logout
                        </Link>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </>
                }
              >
                <Avatar size="small" color="light-blue" style={{ margin: 4 }}>
                  BD
                </Avatar>
                <span className="hover:cursor-pointer">Hello User</span>
              </Dropdown>
            ) : (
              // If not logged in
              <Link href="/auth/login">Login</Link>
            )
          }
        />
      </div>
    </>
  );
};

export default NewNavigation;
