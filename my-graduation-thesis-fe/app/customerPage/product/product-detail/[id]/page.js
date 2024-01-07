"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const ProductDetail = () => {
  const productId = useParams().id;
  const [product, setProduct] = useState();
  const [amount, setAmount] = useState(1); // Giá trị ban đầu là 1
  const handleAmountChange = (e) => {
    const newAmount = parseInt(e.target.value);
    setAmount(newAmount);
  };
  //api get detail product
  const getProductDetail = async () => {
    try {
      const storedLanguage = localStorage.getItem("language");
      const response = await fetch(
        `https://eatright2.azurewebsites.net/api/Products/${productId}/${storedLanguage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const detailProductData = await response.json();
        // const myJson = JSON.stringify(detailProductData);
        // console.log(myJson);
        console.log("Product detail:", detailProductData);
        setProduct(detailProductData);
        // Xử lý dữ liệu product detail ở đây, có thể hiển thị trong modal hoặc component riêng
      } else {
        console.error("Failed to fetch product detail:", response);
      }
    } catch (error) {
      console.error("Error fetching product detail:", error);
    }
  };
  useEffect(() => {
    getProductDetail();
  }, []);
  return (
    <>
      <div className="max-w-7xl mx-auto my-4 px-4">
        <div className="flex justify-center my-4">
          <h1 className="text-4xl font-bold">Product Detail</h1>
        </div>
        {product && ( // Kiểm tra nếu có dữ liệu sản phẩm thì hiển thị
          <div className="flex flex-wrap mt-10 justify-center">
            <div className="w-96">
              <img
                className="w-96 h-96"
                src={product.thumbnailImage}
                alt="Product Image"
              />
            </div>
            <div className="w-7/12 ml-20">
              <h1 className="font-bold text-2xl mb-2">{product.name}</h1>
              <p className="w-auto mb-2">{product.description}</p>
              <p className="w-auto mb-2 text-xl">Available in stock: <span className="mb-2 text-lime-600 font-bold">{product.stock}</span> </p>
              <p className="italic text-xl text-red-600 font-bold mb-2">
                Price: {product.price} VND
              </p>
              <div>
                <label for="amount">Amount: </label>
                <input
                  className="shadow border rounded focus:outline-none w-10 text-center ml-2"
                  id="amount"
                  type="number"
                  min={1}
                  value={amount}
                  onChange={handleAmountChange}
                />
              </div>
              <Link href={""}>
                <button className="buttonGradient border rounded-lg w-44 font-bold text-black mt-10">
                  Add To Cart
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default ProductDetail;
