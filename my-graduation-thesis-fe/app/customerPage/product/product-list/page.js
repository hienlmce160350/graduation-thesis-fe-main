"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Pagination } from "@douyinfe/semi-ui";

const AllProduct = () => {
  const [dataSource, setData] = useState([]);

  const [selectedLanguage, setSelectedLanguage] = useState("en"); // Khởi tạo state ngôn ngữ mặc định
  const [page, setPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    // Lấy giá trị ngôn ngữ từ localStorage khi component được render
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
    }
  }, []);

  const getData = async () => {
    try {
      const storedLanguage = localStorage.getItem("language");
      if (storedLanguage) {
        setSelectedLanguage(storedLanguage);
      } else {
        setSelectedLanguage("en"); // Gán giá trị mặc định là "en" nếu không có trong localStorage
      }
      const response = await fetch(
        `https://eatright2.azurewebsites.net/api/Products/getAll?LanguageId=${storedLanguage}`,
        {
          headers: {
            Method: "GET",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("data: ", data);
        setData(data); // Cập nhật dataSource với dữ liệu từ API
      } else {
        console.error("Failed to fetch data:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getData(); // Gọi hàm getData khi component được render
  }, []); // Chỉ gọi một lần sau khi component được render
  const totalPages = Math.ceil(dataSource.length / productsPerPage);

  // Hàm xử lý sự kiện thay đổi trang
  const onPageChange = (currentPage) => {
    setPage(currentPage);
  };

  // Lấy dữ liệu của trang hiện tại
  const currentPageData = dataSource.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  return (
    <>
      <div className="max-w-7xl mx-auto my-4 px-4">
        <div className="flex justify-center my-4 items-center flex-col">
          <h1 className="text-4xl font-bold text-green-400">Product</h1>
          <div className="h-1 w-32 mt-3 bg-green-400"></div>
        </div>
        <div className="flex flex-wrap gap-5 xl:justify-start xl:pl-7 md:justify-center sm: justify-center">
          {currentPageData.map((product) => (
            <div
              key={product.id}
              className="flex flex-col w-96 rounded-lg outline outline-1 outline-green-500 p-2"
            >
              <img
                className="h-64 mb-2"
                src={
                  product.thumbnailImage ||
                  "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                }
                alt="Blog Thumbnail"
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
                <h5 className="text-xl text-lime-600">{product.price} VND</h5>
                <button className="buttonGradient w-full rounded-lg font-bold">
                  Add To Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center my-4">
        <Pagination
          total={totalPages * 10}
          currentPage={page}
          onPageChange={onPageChange}
        ></Pagination>
      </div>
    </>
  );
};
export default AllProduct;
