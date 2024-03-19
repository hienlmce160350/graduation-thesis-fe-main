"use client";
import React, { useState, useEffect } from "react";
import { Carousel } from "@douyinfe/semi-ui";
import { Card } from "@douyinfe/semi-ui";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { useCart } from "../../../context/CartContext"; // Import useCart
import { Skeleton } from "@douyinfe/semi-ui";

const CusHome = () => {
  const { Meta } = Card;
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    const response = await fetch(
      `https://erscustomer.azurewebsites.net/api/Products/featured/4`,
      {
        headers: {
          Method: "GET",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setFeaturedProducts(data);
      setMaxHeight();
      setLoading(false);
    } else {
      console.error("Failed to fetch data:", response);
      setLoading(false);
    }
  };

  const setMaxHeight = async () => {
    const elements = document.querySelectorAll(".line-clamp-2");
    console.log("Element: " + elements);
    let maxHeight = 0;
    elements.forEach((element) => {
      // Your logic here to handle each element
      const height = element.offsetHeight;
      maxHeight = Math.max(maxHeight, height);
    });
    elements.forEach((element) => {
      element.style.height = maxHeight + "px";
      element.style.overflow = "hidden";
    });
  };

  useEffect(() => {
    setMaxHeight();
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
              className="h-full rounded-lg outline outline-1 outline-[#74A65D] col-span-1 flex flex-col bg-white p-2"
            >
              <div className="flex flex-wrap mb-2">
                <Skeleton
                  loading={loading}
                  style={{
                    width: "auto",
                    height: "256px",
                    background: "#cccccc",
                  }}
                >
                  <img
                    className="relative aspect-square"
                    src={product.thumbnailImage}
                    alt="Product Thumbnail"
                  />
                </Skeleton>
              </div>
              <h2 className="mb-2 font-medium text-xl line-clamp-2 hover:text-[#74A65D]">
                <Link
                  href={`/customerPage/product/product-detail/${product.id}`}
                >
                  <Skeleton
                    loading={loading}
                    style={{
                      width: "290px",
                      height: "26px",
                      background: "#cccccc",
                    }}
                  >
                    {product.name}
                  </Skeleton>
                </Link>
              </h2>

              <Skeleton
                loading={loading}
                style={{
                  width: "290px",
                  height: "72px",
                  background: "#cccccc",
                  marginTop: "4px",
                }}
              >
                <p
                  className="line-clamp-3 mt-2 text-justify"
                  dangerouslySetInnerHTML={{
                    __html: product.description,
                  }}
                ></p>
              </Skeleton>
              <div className="flex flex-wrap mt-auto pt-3 justify-center">
                <div className="flex gap-2 items-center my-4">
                  <Skeleton
                    loading={loading}
                    style={{
                      width: "100px",
                      height: "28px",
                      background: "#cccccc",
                      textAlign: "center",
                    }}
                  >
                    <h5 className="text-md text-[#cccccc] line-through">
                      {product.originalPrice} $
                    </h5>
                    <h5 className="text-xl text-[#fe7314] font-semibold">
                      {product.price} $
                    </h5>
                  </Skeleton>
                </div>
                {/* Kiểm tra nếu sản phẩm có hàng */}
                {product.stock > 0 ? (
                  <button
                    className="h-[42px] p-2 hover:bg-[#ACCC8B] hover:text-white border border-[#74A65D] w-full rounded-lg font-bold"
                    onClick={() =>
                      addToCart(
                        {
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          thumbnailImage: product.thumbnailImage,
                          stock: product.stock,
                        },
                        1
                      )
                    }
                  >
                    Add To Cart
                  </button>
                ) : (
                  // Nếu không có hàng, hiển thị nút Out of Stock và làm cho nút bị vô hiệu hóa
                  <button
                    className="h-[42px] p-2 bg-gray-300 border border-gray-400 w-full rounded-lg font-bold cursor-not-allowed"
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
