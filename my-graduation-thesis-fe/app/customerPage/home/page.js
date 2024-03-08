"use client";
import React, { useState, useEffect } from "react";
import { Carousel } from "@douyinfe/semi-ui";
import { Card } from "@douyinfe/semi-ui";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";

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
          <div className="">
            <Link
              className="flex items-center gap-1 hover:text-[#74A65D]"
              href="/customerPage/product/product-list"
            >
              <h4>View all product</h4>
              <FaArrowRight />
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:grid md:grid-cols-2 lg:flex lg:justify-start lg:pl-2 lg">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="flex flex-col w-72 md:w-auto lg:w-72 rounded-lg outline outline-1 outline-[#74A65D] p-2"
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
                  <h5 className="text-md text-[#cccccc] line-through">
                    {product.originalPrice} $
                  </h5>
                  <h5 className="text-xl text-[#fe7314] font-semibold">
                    {product.price} $
                  </h5>
                </div>
                <button className="h-auto p-2 hover:bg-[#ACCC8B] hover:text-white border border-[#74A65D] w-full rounded-lg font-bold">
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
