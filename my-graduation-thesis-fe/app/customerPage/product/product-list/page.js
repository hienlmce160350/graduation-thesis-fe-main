"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@douyinfe/semi-ui";
import { IconSearch } from "@douyinfe/semi-icons";
import { Card } from "@douyinfe/semi-ui";
import Link from "next/link";
import { Pagination } from '@douyinfe/semi-ui';

const AllProduct = () => {
  const { Meta } = Card;
  const style = {
    width: "100%",
    height: "600px",
  };
  const [dataSource, setData] = useState([]);

  const [selectedLanguage, setSelectedLanguage] = useState("en"); // Khởi tạo state ngôn ngữ mặc định
  const [page, setPage] = useState(1);
  const productsPerPage = 8;


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
        `https://eatright2.azurewebsites.net/api/Products/getAll/${storedLanguage}`,
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
  const chunkArray = (arr, chunkSize) => {
    const chunkedArray = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunkedArray.push(arr.slice(i, i + chunkSize));
    }
    return chunkedArray;
  };

  const renderChunkedCards = () => {
    const startIdx = (page - 1) * productsPerPage;
    const endIdx = startIdx + productsPerPage;
    const currentChunk = dataSource.slice(startIdx, endIdx);
    const chunkedData = chunkArray(currentChunk, 4);
    return chunkedData.map((chunk, index) => (
      <div key={index} className="flex items-center justify-start gap-1 my-1">
        {chunk.map((product) => (
          <Card
            key={product.id}
            style={{ maxWidth: 300 }}
            headerLine={false}
            cover={
              <img
                className="w-80 h-80"
                alt={product.name}
                src={product.thumbnailImage || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
              />
            }
            footer={
              <div className="flex items-center justify-center flex-col">
                <h5 className="text-xl text-lime-600">{product.price} VND</h5>
                <button className="buttonGradient w-full rounded-lg">
                  Add to cart
                </button>
              </div>
            }
          >
            <Meta
              title={
                <div className="h-14 mb-2">
                  <Link
                    href={`/customerPage/product/product-detail/${product.id}`}
                  >
                    {product.name}
                  </Link>
                </div>
              }
              description={
                <div className="w-64">
                  <p className="line-clamp-3">{product.seoDescription}</p>
                </div>
              }
            />
          </Card>
        ))}
      </div>
    ));
  };
  const totalPages = Math.ceil(dataSource.length / productsPerPage);
  return (
    <>
      <div className="max-w-7xl mx-auto my-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center my-4">
          <h1 className="text-4xl font-bold">Product</h1>
          <div className=""></div>
        </div>
        <div className="flex">
          <Input
            className="w-50 h-10 justify-end"
            prefix={<IconSearch />}
            showClear
            placeholder={"Search"}
          ></Input>
        </div>
        {/* <div className="flex flex-wrap">
          {dataSource.map((product) => (
            <div>
              <Card
                key={product.id}
                style={{ maxWidth: 300 }}
                headerLine={false}
                cover={
                  <img
                    className="w-96 h-80"
                    alt={product.name}
                    src={
                      product.thumbnailImage || "URL_mặc_định_nếu_không_có_ảnh"
                    }
                  />
                }
                footer={
                  <div className="flex items-center justify-center flex-col">
                    <h5 className="text-xl text-lime-600">${product.price}</h5>
                    <button className="buttonGradient w-full rounded-lg">
                      Add to cart
                    </button>
                  </div>
                }
              >
                <Meta
                  title={
                    <div className="h-12">
                      <Link
                        href={`/customerPage/product/product-detail/${product.id}`}
                      >
                        {product.name}
                      </Link>
                    </div>
                  }
                  description={product.seoDescription}
                />
              </Card>
            </div>
          ))}
        </div> */}
        {renderChunkedCards()}
        <Pagination
           total={totalPages}
           currentPage={page}
           onPageChange={setPage}>
        </Pagination>
      </div>
    </>
  );
};
export default AllProduct;
