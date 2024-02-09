"use client";
import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import Link from "next/link";
import Cookies from "js-cookie";

const CusNavbar = () => {
  const [isClick, setisClick] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    setLoggedIn(false);
    window.location.href = "/auth/login";
  };

  const toggleNavbar = () => {
    setisClick(!isClick);
  };

  const handleLanguageChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedLanguage(selectedValue);
    localStorage.setItem("language", selectedValue);
  };

  return (
    <>
      <nav className="bg-[#CCE1C233]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <a href="/customerPage/home" className="text-white">
                  <img src="/staticImage/logoShop2.png" className="w-14"></img>
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center space-x-4">
                <Link
                  href={`/customerPage/product/product-list`}
                  className="text-black block hover:bg-white hover:text-black rounded-lg p-2"
                >
                  Product
                </Link>

                <Link
                  href={`/customerPage/blog/blog-list`}
                  className="text-black hover:bg-white hover:text-black rounded-lg p-2"
                >
                  Blog
                </Link>
                <Link
                  href={`/customerPage/AI`}
                  className="text-black hover:bg-white hover:text-black rounded-lg p-2"
                >
                  AI Help
                </Link>
                <Link
                  href="/"
                  className="text-black hover:bg-white hover:text-black rounded-lg p-2"
                >
                  Location
                </Link>
                <Link
                  href={`/customerPage/my-profile`}
                  className="text-black hover:bg-white hover:text-black rounded-lg p-2"
                >
                  My Profile
                </Link>
                <Link
                    href={`/customerPage/order-history/order-list`}
                  className="text-black hover:bg-white hover:text-black rounded-lg p-2"
                >
                  My Order
                </Link>
                <Link
                  href="/"
                  className="text-black hover:bg-white hover:text-black rounded-lg p-2"
                >
                  Order
                </Link>

                <Link
                  className="text-black hover:bg-white hover:text-black rounded-lg p-2"
                  href="/"
                >
                  <FaShoppingCart />
                </Link>

                <select
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                >
                  <option value="vi">VI</option>
                  <option value="en">EN</option>
                </select>

                {isLoggedIn ? (
                  <button
                    className="text-black hover:bg-white hover:text-black rounded-lg p-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    href={`/auth/login`}
                    className="text-black hover:bg-white hover:text-black rounded-lg p-2"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>

            <div className="md:hidden flex items-center">
              <button
                className="inline-flex items-center justify-center p-2 rounded-md text-white md:text-white hover:text-white focus: outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={toggleNavbar}
              >
                {/* ... */}
              </button>
            </div>
          </div>
        </div>

        {isClick && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/"
                className="text-black block hover:bg-white hover:text-black rounded-lg p-2"
              >
                Product
              </Link>

              <Link
                href="/"
                className="text-black block hover:bg-white hover:text-black rounded-lg p-2"
              >
                Blog
              </Link>

              {isLoggedIn && (
                <>
                  <Link
                    href="/"
                    className="text-black block hover:bg-white hover:text-black rounded-lg p-2"
                  >
                    AI Help
                  </Link>
                  <Link
                    href="/"
                    className="text-black block hover:bg-white hover:text-black rounded-lg p-2"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/"
                    className="text-black block hover:bg-white hover:text-black rounded-lg p-2"
                  >
                    My Order
                  </Link>
                </>
              )}

              <Link
                href="/"
                className="text-black block hover:bg-white hover:text-black rounded-lg p-2"
              >
                Location
              </Link>
              <Link
                href="/"
                className="text-black block hover:bg-white hover:text-black rounded-lg p-2"
              >
                Order
              </Link>
              <Link
                href="/"
                className="text-black block hover:bg-white hover:text-black rounded-lg p-2"
              >
                <FaShoppingCart />
              </Link>
              <Link
                href="/"
                className="text-black block hover:bg-white hover:text-black rounded-lg p-2"
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

export default CusNavbar;
