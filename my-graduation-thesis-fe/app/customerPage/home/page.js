"use client";
import React, { useState, useEffect } from "react";
import { Carousel } from "@douyinfe/semi-ui";
import { Card } from "@douyinfe/semi-ui";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { useCart } from "../../../context/CartContext"; // Import useCart

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
  const { addToCart } = useCart(); // Sử dụng useCart để lấy addToCart từ context
  const getFeaturedProducts = async () => {
    const languageId = localStorage.getItem("language"); // Assuming you have logic to store languageId in local storage

    const response = await fetch(
      `https://eatright2.azurewebsites.net/api/Products/featured/4`,
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
              <h4 className="whitespace-nowrap">View all product</h4>
              <FaArrowRight />
            </Link>
          </div>
        </div>
        <div className="grid-cols-1 gap-3 sm:grid-cols-2 grid lg:grid-cols-4 m-auto place-items-center">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="flex flex-col md:w-auto lg:w-full rounded-lg outline outline-1 outline-[#74A65D] p-2"
            >
              <img
                className="mb-2"
                src={product.thumbnailImage}
                alt="Product Thumbnail"
              />
              <div className="flex flex-col">
                <Link
                  href={`/customerPage/product/product-detail/${product.id}`}
                  className="font-normal text-xl line-clamp-2 hover:text-[#74A65D]"
                >
                  {product.name}
                </Link>
                <div className="h-20">
                  <p
                    className="line-clamp-3 mt-2"
                    dangerouslySetInnerHTML={{
                      __html: product.description,
                    }}
                  ></p>
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
                {/* Kiểm tra nếu sản phẩm có hàng */}
                {product.stock > 0 ? (
                  <button
                    className="h-auto p-2 hover:bg-[#ACCC8B] hover:text-white border border-[#74A65D] w-full rounded-lg font-bold"
                    onClick={() =>
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        thumbnailImage: product.thumbnailImage,
                        stock: product.stock,
                      },1)
                    }
                  >
                    Add To Cart
                  </button>
                ) : (
                  // Nếu không có hàng, hiển thị nút Out of Stock và làm cho nút bị vô hiệu hóa
                  <button
                    className="h-auto p-2 bg-gray-300 border border-gray-400 w-full rounded-lg font-bold cursor-not-allowed"
                    disabled
                  >
                    Out of Stock
                  </button>
                )}
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
