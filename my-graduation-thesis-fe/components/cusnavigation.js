"use client";
import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { PiHandbagLight } from "react-icons/pi";
import Link from "next/link";
import Cookies from "js-cookie";
import { Nav, Avatar, Dropdown, Badge } from "@douyinfe/semi-ui";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { parseJwt } from "@/libs/commonFunction";

import { useCart } from "../context/CartContext";
import { IconMore } from "@douyinfe/semi-icons";
const CusNavbar = () => {
  const [isClick, setisClick] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const { user, logout } = useAuth();
  const [fullName, setFullName] = useState();
  const [avatar, setAvatar] = useState();
  const { cartItems, clearCart } = useCart();
  useEffect(() => {
    const token = Cookies.get("token");
    setLoggedIn(!!token);
    if (!user) {
    } else {
      setFullName(user.userName);
      setAvatar(user.avatar);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    await clearCart();
  };

  const toggleNavbar = () => {
    setisClick(!isClick);
  };

  const management = () => {
    const token = Cookies.get("token");
    if (token) {
      const roleFromToken =
        parseJwt(token)[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
      if (roleFromToken == "") {
        return null;
      } else if (roleFromToken.includes("manager")) {
        return (
          <Dropdown.Item className="hover:!bg-[#F4FFEB]">
            <Link href="/managerPage">Management</Link>
          </Dropdown.Item>
        );
      } else if (
        roleFromToken.includes("admin") &&
        !roleFromToken.includes("manager")
      ) {
        return (
          <Dropdown.Item className="hover:!bg-[#F4FFEB]">
            <Link href="/adminPage">Management</Link>
          </Dropdown.Item>
        );
      } else if (
        !roleFromToken.includes("admin") &&
        !roleFromToken.includes("manager") &&
        roleFromToken.includes("verifier")
      ) {
        return (
          <Dropdown.Item className="hover:!bg-[#F4FFEB]">
            <Link href="/verifierPage">Management</Link>
          </Dropdown.Item>
        );
      }
    }
  };

  const managementMobile = () => {
    const token = Cookies.get("token");
    if (token) {
      const roleFromToken =
        parseJwt(token)[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
      if (roleFromToken == "") {
        return null;
      } else if (roleFromToken.includes("manager")) {
        return (
          <Link
            href="/managerPage"
            className="text-black hover:text-[#74A65D] block p-2"
          >
            Management
          </Link>
        );
      } else if (
        roleFromToken.includes("admin") &&
        !roleFromToken.includes("manager")
      ) {
        return (
          <Link
            href="/adminPage"
            className="text-black hover:text-[#74A65D] block p-2"
          >
            Management
          </Link>
        );
      } else if (
        !roleFromToken.includes("admin") &&
        !roleFromToken.includes("manager") &&
        roleFromToken.includes("verifier")
      ) {
        return (
          <Link
            href="/verifierPage"
            className="text-black hover:text-[#74A65D] block p-2"
          >
            Management
          </Link>
        );
      }
    }
  };

  return (
    <>
      <nav className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 text-lg">
          <div className="flex items-center justify-between h-22">
            <div className="flex items-center">
              <div className="flex items-center">
                <Link href="/customerPage" className="flex items-center">
                  <img
                    src="/staticImage/ERSLogo22.png"
                    className="w-20 h-20"
                  ></img>
                  <h1 className="font-semibold text-2xl">EatRightify System</h1>
                </Link>
              </div>
            </div>
            <div className="hidden min-[810px]:block font-normal text-md">
              <div className="flex gap-4 items-center">
                <Link
                  href={`/customerPage/product/product-list`}
                  className="text-black hover:text-[#74A65D] p-2"
                >
                  Product
                </Link>

                <Link
                  href={`/customerPage/blog/blog-list`}
                  className="text-black hover:text-[#74A65D] p-2"
                >
                  Blog
                </Link>
                <div className="max-[904px]:hidden">
                  <Link
                    href="/customerPage/location"
                    className="text-black hover:text-[#74A65D] p-2"
                  >
                    Location
                  </Link>

                  <Link
                    href="/customerPage/check-order"
                    className="text-black hover:text-[#74A65D] p-2"
                  >
                    Order
                  </Link>
                </div>
                <div className="max-[904px]:flex items-center hidden">
                  <Dropdown
                    trigger={"click"}
                    position={"bottom"}
                    render={
                      <Dropdown.Menu>
                        <Link
                          href="/customerPage/location"
                          className="text-black !hover:text-[#74A65D]"
                        >
                          <Dropdown.Item>Location</Dropdown.Item>
                        </Link>

                        <Link
                          href="/customerPage/check-order"
                          className="text-black !hover:text-[#74A65D]"
                        >
                          <Dropdown.Item>Order</Dropdown.Item>
                        </Link>
                      </Dropdown.Menu>
                    }
                  >
                    <IconMore className="cursor-pointer" />
                  </Dropdown>
                </div>
              </div>
            </div>
            <div className="hidden min-[810px]:block font-normal text-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link
                    className="text-black hover:text-[#74A65D] p-2 flex items-center"
                    href="/customerPage/shopping-cart"
                  >
                    <Badge count={cartItems.length} type="warning">
                      <PiHandbagLight className="!text-3xl" />
                    </Badge>
                  </Link>

                  {isLoggedIn ? ( // Check if logged in
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
                              <Link
                                href={"/customerPage/order-history/order-list"}
                              >
                                My Order
                              </Link>
                            </Dropdown.Item>
                            {management()}
                            <Dropdown.Item className="hover:!bg-[#F4FFEB]">
                              <Link href={`/customerPage/AI`}>AI Help</Link>
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
                      <Avatar
                        size="small"
                        src={avatar}
                        style={{ margin: 4 }}
                      ></Avatar>
                      <span className="hover:cursor-pointer">{fullName}</span>
                    </Dropdown>
                  ) : (
                    // If not logged in
                    <>
                      <Link
                        href="/auth/login"
                        className="bg-[#74A65D] rounded-xl text-white px-4 py-2 hover:bg-white hover:text-[#74A65D] border-2 border-[#74A65D]"
                      >
                        Login
                      </Link>
                      <Link
                        href="/auth/register"
                        className="border-[#74A65D] px-4 py-2 border-2 rounded-xl text-[#74A65D] hover:bg-[#ACCC8B] hover:text-white"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="min-[810px]:hidden flex items-center">
              <button
                className="inline-flex items-center justify-center p-2 rounded-md text-white md:text-white hover:text-white focus: outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={toggleNavbar}
              >
                {isClick ? (
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                  >
                    <path
                      fill="#000000"
                      d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="#000000"
                      d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {isClick && (
          <div className="min-[810px]:hidden text-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 font-normal text-md flex flex-col items-center">
              <Link
                href="/customerPage/product/product-list"
                className="text-black hover:text-[#74A65D] block p-2"
                onClick={toggleNavbar}
              >
                Product
              </Link>

              <Link
                href="/customerPage/blog/blog-list"
                className="text-black hover:text-[#74A65D] block p-2"
                onClick={toggleNavbar}
              >
                Blog
              </Link>

              {isLoggedIn && (
                <>
                  <Link
                    href="/customerPage/AI"
                    className="text-black hover:text-[#74A65D] block p-2"
                    onClick={toggleNavbar}
                  >
                    AI Help
                  </Link>
                  <Link
                    href="/customerPage/my-profile"
                    className="text-black hover:text-[#74A65D] block p-2"
                    onClick={toggleNavbar}
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/customerPage/order-history/order-list"
                    className="text-black hover:text-[#74A65D] block p-2"
                    onClick={toggleNavbar}
                  >
                    My Order
                  </Link>
                  {managementMobile()}
                </>
              )}

              <Link
                href="/customerPage/location"
                className="text-black hover:text-[#74A65D] block p-2"
                onClick={toggleNavbar}
              >
                Location
              </Link>
              <Link
                href="/customerPage/check-order"
                className="text-black hover:text-[#74A65D] block p-2"
                onClick={toggleNavbar}
              >
                Order
              </Link>
              <Link
                href="/customerPage/shopping-cart"
                className="text-black hover:text-[#74A65D] block p-2"
                onClick={toggleNavbar}
              >
                <Badge count={cartItems.length} type="warning">
                  <PiHandbagLight className="!text-3xl" />
                </Badge>
              </Link>
              <Link
                href="/auth/login"
                className="text-black hover:text-[#74A65D] block p-2"
              >
                {isLoggedIn ? "Logout" : "Login"}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
const CusNavigationWithAuthProvider = () => (
  <AuthProvider>
    <CusNavbar />
  </AuthProvider>
);
export default CusNavigationWithAuthProvider;
