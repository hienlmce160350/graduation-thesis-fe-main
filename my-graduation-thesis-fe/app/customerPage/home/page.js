"use client";
import React, { useState, useEffect } from "react";
import { Carousel } from "@douyinfe/semi-ui";
import { Card } from "@douyinfe/semi-ui";
import Link from "next/link";

const CusHome = () => {
  const { Meta } = Card;
  const style = {
    width: "100%",
    height: "600px",
  };

  const imgList = [
    "/staticImage/carousel1.jpg",
    "/staticImage/carousel2.jpg",
    "/staticImage/carousel3.jpg",
    "/staticImage/carousel4.jpg",
  ];
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const getFeaturedProducts = async () => {
    const languageId = localStorage.getItem("language"); // Assuming you have logic to store languageId in local storage

    const response = await fetch(
      `https://eatright2.azurewebsites.net/api/Products/featured/${languageId}/4`,
      {
        headers: {
          Method: "GET",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setFeaturedProducts(data); // Cập nhật dataSource với dữ liệu từ API
    } else {
      console.error("Failed to fetch data:", response);
    }
  };

  useEffect(() => {
    getFeaturedProducts();
  }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Carousel style={style} theme="light" arrowType="hover">
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
          <div className="hover:rounded-lg hover:bg-[#F4FFEB] p-2">
            <Link
              className="flex items-center gap-1"
              href="/customerPage/product/product-list"
            >
              <h4>View all product</h4>
              <svg
                className=""
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
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap gap-5 xl:justify-start xl:pl-5 md:justify-center sm: justify-center">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="flex flex-col w-72 rounded-lg outline outline-1 outline-[#69AD28] p-2"
            >
              <img
                className="h-64 mb-2"
                src={product.thumbnailImage}
                alt="Product Thumbnail"
              />
              <div className="flex flex-col">
                <Link
                  href={`/customerPage/product/product-detail/${product.id}`}
                  className="font-bold text-xl line-clamp-1"
                >
                  {product.name}
                </Link>
                <div className="h-20">
                  <p className="line-clamp-3 mt-2">{product.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-center flex-col">
                <div className="flex gap-2 items-center my-4">
                  <h5 className="text-md text-red-400 line-through">
                    {product.originalPrice} $
                  </h5>
                  <h5 className="text-xl text-lime-600 font-semibold">
                    {product.price} $
                  </h5>
                </div>
                <button className="buttonGradient w-full rounded-lg font-bold">
                  Add To Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <img src="/staticImage/section.png" />
        <img src="/staticImage/section3.png" />
        <img src="/staticImage/section4.png" />
      </div>
      {/* end of navbar */}
    </>
  );
};
export default CusHome;
