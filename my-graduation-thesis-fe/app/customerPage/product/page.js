"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@douyinfe/semi-ui";
import { IconSearch } from "@douyinfe/semi-icons";
import { Card } from "@douyinfe/semi-ui";

const AllProduct = () => {
  const { Meta } = Card;
  const style = {
    width: "100%",
    height: "600px",
  };
  const [dataSource, setData] = useState([]);
  const pageSize = 10;
  const getData = async () => {
    try {
      const response = await fetch(
        `https://eatright2.azurewebsites.net/api/Products/getAll/en`,
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
    const chunkedData = chunkArray(dataSource, 4); // Chia dataSource thành các nhóm có 4 phần tử
    return chunkedData.map((chunk, index) => (
      <div key={index} className="flex justify-start content-center my-2 gap-1">
        {chunk.map((product) => (
          <Card
            key={product.id}
            style={{ maxWidth: 300 }}
            headerLine={false}
            cover={
              <img
                className="w-80 h-80"
                alt={product.name}
                src={product.thumbnailImage || "URL_mặc_định_nếu_không_có_ảnh"}
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
                  <a href="/">{product.name}</a>
                </div>
              }
              description={
                <div className="h-10">
                  {product.seoDescription}
                  <p class="text-ellipsis overflow-hidden ..."></p>
                </div>
              }
            />
          </Card>
        ))}
      </div>
    ));
  };
  return (
    <>
      <div className="max-w-7xl mx-auto my-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center my-4">
          <h1 className="text-4xl font-bold">Product</h1>
          <div className=""></div>
        </div>
        <div className="flex items-center justify-end">
          <Input
            className="w-96 h-10"
            prefix={<IconSearch />}
            showClear
            placeholder={"Search"}
          ></Input>
        </div>
        {/* <div className="flex flex-row">
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
                  title={<a href="/">{product.name}</a>}
                  description={product.seoDescription}
                />
              </Card>
            </div>
          ))}
        </div> */}
        {renderChunkedCards()}
      </div>
    </>
  );
};
export default AllProduct;
