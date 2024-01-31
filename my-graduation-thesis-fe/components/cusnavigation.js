"use client";
import React from "react";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import Link from "next/link";

const cusNavbar = () => {
  const [isClick, setisClick] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const toggleNavbar = () => {
    setisClick(!isClick);
  };
  const handleLanguageChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedLanguage(selectedValue);
    localStorage.setItem("language", selectedValue); // Sử dụng selectedValue thay vì newLanguage
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
                <Link
                  href={`/auth/login`}
                  className="text-black hover:bg-white hover:text-black rounded-lg p-2"
                >
                  Login
                </Link>
              </div>
            </div>
            <div className="md:hidden flex items-center">
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
                Location
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
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
export default cusNavbar;
