"use client";
import React from "react";
import { Carousel, Typography, Space } from "@douyinfe/semi-ui";
import { Card } from "@douyinfe/semi-ui";
import cusNavbar from "../../../components/cusnavigation";
const LandingCarousel = () => {
  const { Title, Paragraph } = Typography;
  const { Meta } = Card;
  const style = {
    width: "100%",
    height: "600px",
  };

  const titleStyle = {
    position: "absolute",
    top: "100px",
    left: "100px",
    color: "#1C1F23",
  };

  const colorStyle = {
    color: "#1C1F23",
  };

  const imgList = [
    "/staticImage/carousel1.jpg",
    "/staticImage/carousel2.jpg",
    "/staticImage/carousel3.jpg",
    "/staticImage/carousel4.jpg",
  ];

  return (
    <>
    <cusNavbar></cusNavbar>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Carousel style={style} theme="dark">
          {imgList.map((src, index) => {
            return (
              <div
                key={index}
                style={{
                  backgroundSize: "cover",
                  backgroundImage: `url(${src})`,
                }}
              ></div>
            );
          })}
        </Carousel>
        <div className="my-8 flex items-center content-center justify-between">
          <div>
            <h2 className="text-4xl font-bold">Feature Product</h2>
          </div>
          <div className="">
            <a className="flex items-center gap-1 hover:text-lime-200" href="/">
              <h4>View all product</h4>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="14"
                viewBox="0 0 448 512"
              >
                <path
                  fill="#000000"
                  d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
                />
              </svg>
            </a>
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <Card
            style={{ maxWidth: 300 }}
            actions={
              [
                // eslint-disable-next-line react/jsx-key
              ]
            }
            headerLine={false}
            cover={
              <img
                alt="example"
                src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/card-cover-docs-demo.jpeg"
              />
            }
            footer={
              <>
                <div className="flex items-center justify-center flex-col">
                  <h5 className="text-xl text-lime-600">200$</h5>
                  <button className="bg-black text-white p-2 rounded-lg w-48 hover:bg-slate-800">
                    Add to cart
                  </button>
                </div>
              </>
            }
          >
            <Meta
              title="Product Name"
              description="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit"
            />
          </Card>
          <Card
            style={{ maxWidth: 300 }}
            actions={
              [
                // eslint-disable-next-line react/jsx-key
              ]
            }
            headerLine={false}
            cover={
              <img
                alt="example"
                src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/card-cover-docs-demo.jpeg"
              />
            }
            footer={
              <>
                <div className="flex items-center justify-center flex-col">
                  <h5 className="text-xl text-lime-600">200$</h5>
                  <button className="bg-black text-white p-2 rounded-lg w-48 hover:bg-slate-800">
                    Add to cart
                  </button>
                </div>
              </>
            }
          >
            <Meta
              title="Product Name"
              description="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit"
            />
          </Card>
          <Card
            style={{ maxWidth: 300 }}
            actions={
              [
                // eslint-disable-next-line react/jsx-key
              ]
            }
            headerLine={false}
            cover={
              <img
                alt="example"
                src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/card-cover-docs-demo.jpeg"
              />
            }
            footer={
              <>
                <div className="flex items-center justify-center flex-col">
                  <h5 className="text-xl text-lime-600">200$</h5>
                  <button className="bg-black text-white p-2 rounded-lg w-48 hover:bg-slate-800">
                    Add to cart
                  </button>
                </div>
              </>
            }
          >
            <Meta
              title="Product Name"
              description="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit"
            />
          </Card>
          <Card
            style={{ maxWidth: 300 }}
            actions={
              [
                // eslint-disable-next-line react/jsx-key
              ]
            }
            headerLine={false}
            cover={
              <img
                alt="example"
                src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/card-cover-docs-demo.jpeg"
              />
            }
            footer={
              <>
                <div className="flex items-center justify-center flex-col">
                  <h5 className="text-xl text-lime-600">200$</h5>
                  <button className="bg-black text-white p-2 rounded-lg w-48 hover:bg-slate-800">
                    Add to cart
                  </button>
                </div>
              </>
            }
          >
            <Meta
              title="Product Name"
              description="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit"
            />
          </Card>
        </div>

        <img src="/staticImage/section.png" />
      </div>
      {/* end of navbar */}

      <div class="bg-blue-100/80 font-sans dark:bg-gray-900">
        <div class="container px-6 py-12 mx-auto">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
            <div class="sm:col-span-2">
              <h1 class="max-w-lg text-xl font-semibold tracking-tight text-gray-800 xl:text-2xl dark:text-white">
                Subscribe our newsletter to get an update.
              </h1>

              <div class="flex flex-col mx-auto mt-6 space-y-3 md:space-y-0 md:flex-row">
                <input
                  id="email"
                  type="text"
                  class="px-4 py-2 text-gray-700 bg-white border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                  placeholder="Email Address"
                />

                <button class="w-full px-6 py-2.5 text-sm font-medium tracking-wider text-white transition-colors duration-300 transform md:w-auto md:mx-4 focus:outline-none bg-gray-800 rounded-lg hover:bg-gray-700 focus:ring focus:ring-gray-300 focus:ring-opacity-80">
                  Subscribe
                </button>
              </div>
            </div>

            <div>
              <p class="font-semibold text-gray-800 dark:text-white">
                Quick Link
              </p>

              <div class="flex flex-col items-start mt-5 space-y-2">
                <p class="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:cursor-pointer hover:text-blue-500">
                  Home
                </p>
                <p class="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:cursor-pointer hover:text-blue-500">
                  Who We Are
                </p>
                <p class="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:cursor-pointer hover:text-blue-500">
                  Our Philosophy
                </p>
              </div>
            </div>

            <div>
              <p class="font-semibold text-gray-800 dark:text-white">
                Industries
              </p>

              <div class="flex flex-col items-start mt-5 space-y-2">
                <p class="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:cursor-pointer hover:text-blue-500">
                  Retail & E-Commerce
                </p>
                <p class="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:cursor-pointer hover:text-blue-500">
                  Information Technology
                </p>
                <p class="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:cursor-pointer hover:text-blue-500">
                  Finance & Insurance
                </p>
              </div>
            </div>
          </div>

          <hr class="my-6 border-gray-200 md:my-8 dark:border-gray-700 h-2" />

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
          </div>
          <p class="font-sans p-8 text-start md:text-center md:text-lg md:p-4">
            © 2023 You Company Inc. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};
export default LandingCarousel;
