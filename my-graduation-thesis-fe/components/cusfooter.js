import Link from "next/link";
import React from "react";

const Cusfooter = () => {
  return (
    <>
      {/* begin footer */}
      <div className="bg-[url('/staticImage/footer-bg.jpg')] bg-no-repeat bg-center bg-cover">
        <div class="container px-6 py-12 mx-auto ">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
            <div className="flex items-start">
              <Link href="/customerPage" className="flex items-center">
                <img
                  src="/staticImage/ERS_LogoWhite.png"
                  className="w-20 h-20"
                ></img>
                <h1 className="font-semibold text-2xl text-white">
                  EatRightify System
                </h1>
              </Link>
            </div>

            <div>
              <p class="font-semibold text-white text-2xl">Time Active</p>

              <div className="flex flex-col items-start mt-5 gap-4 text-md">
                <p className="text-white transition-colors duration-300 ">
                  From 8:00 AM to 10:00 PM
                </p>
                <p className="text-white transition-colors duration-300 ">
                  Address: 600, Nguyen Van Cu Street (extended), An Binh Ward,
                  Ninh Kieu District, City. Can Tho
                </p>
                <p className="text-white transition-colors duration-300 ">
                  Hotline: 078 663 1194
                </p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-white text-md text-2xl">
                Contact Info
              </p>

              <div className="flex flex-col items-start mt-5 gap-4">
                <Link
                  href={"/"}
                  className="text-white transition-colors duration-300 hover:text-[#74a65d]"
                >
                  Scientific Weight Loss Diet - Healthy Eating
                </Link>
                <Link
                  href={"/"}
                  className="text-white transition-colors duration-300 hover:text-[#74a65d]"
                >
                  Purchase policy
                </Link>
                <Link
                  href={"/customerPage/blog/blog-list"}
                  className="text-white transition-colors duration-300 hover:text-[#74a65d]"
                >
                  Blog
                </Link>
              </div>
            </div>
            <div>
              <p class="font-semibold text-white text-2xl">We on social</p>

              <div className="flex flex-col items-start mt-5 gap-4 ">
                <Link
                  href={"/"}
                  className="text-white transition-colors duration-300 flex gap-2  items-center hover:text-[#74a65d]"
                >
                  <img
                    src="https://www.svgrepo.com/show/303114/facebook-3-logo.svg"
                    width="30"
                    height="30"
                    alt="fb"
                  />{" "}
                  EatRightify Shop
                </Link>
                <Link
                  href={"/"}
                  className="text-white transition-colors duration-300 flex gap-2  items-center hover:text-[#74a65d]"
                >
                  <img
                    src="https://www.svgrepo.com/show/303145/instagram-2-1-logo.svg"
                    width="30"
                    height="30"
                    alt="inst"
                  />
                  EatRightify Shop
                </Link>
              </div>
            </div>
          </div>

          {/* <hr className="my-6 border-gray-200 md:my-8 h-2" />
          <div class="sm:flex sm:items-center sm:justify-between">
            <div class="flex flex-1 gap-4 hover:cursor-pointer">
              <img
                src="https://www.svgrepo.com/show/303139/google-play-badge-logo.svg"
                width="130"
                height="110"
                alt=""
              />
              <img
                src="https://www.svgrepo.com/show/303128/download-on-the-app-store-apple-logo.svg"
                width="130"
                height="110"
                alt=""
              />
            </div>

            <div class="flex gap-4 hover:cursor-pointer">
              <img
                src="https://www.svgrepo.com/show/303114/facebook-3-logo.svg"
                width="30"
                height="30"
                alt="fb"
              />
              <img
                src="https://www.svgrepo.com/show/303115/twitter-3-logo.svg"
                width="30"
                height="30"
                alt="tw"
              />
              <img
                src="https://www.svgrepo.com/show/303145/instagram-2-1-logo.svg"
                width="30"
                height="30"
                alt="inst"
              />
              <img
                src="https://www.svgrepo.com/show/94698/github.svg"
                class=""
                width="30"
                height="30"
                alt="gt"
              />
              <img
                src="https://www.svgrepo.com/show/22037/path.svg"
                width="30"
                height="30"
                alt="pn"
              />
              <img
                src="https://www.svgrepo.com/show/28145/linkedin.svg"
                width="30"
                height="30"
                alt="in"
              />
              <img
                src="https://www.svgrepo.com/show/22048/dribbble.svg"
                class=""
                width="30"
                height="30"
                alt="db"
              />
            </div>
          </div> */}
        </div>
      </div>
      {/* end of footer */}
    </>
  );
};
export default Cusfooter;
