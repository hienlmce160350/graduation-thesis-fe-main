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
  const increaseQty = (amount) => {
    const newQty = amount + 1;
    setAmount(newQty);
  };

  const decreaseQty = (amount) => {
    const newQty = amount - 1;
    setAmount(newQty);
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
      <div className="max-w-7xl mx-auto my-4 px-4 flex flex-col lg:flex-row lg:justify-center lg:items-start lg:flex-wrap">
        {product && ( // Kiểm tra nếu có dữ liệu sản phẩm thì hiển thị
          <div className="flex flex-wrap mt-10 justify-center">
            <div className="w-full lg:w-96">
              <img
                className="w-full h-auto lg:h-96 "
                src={product.thumbnailImage}
                alt="Product Image"
              />
            </div>
            <div className="lg:w-7/12 ml-0 lg:ml-20 relative lg:flex justify-start flex-col xl:mt-0 mt-3">
              <div className="">
                <h1 className="font-bold text-xl lg:text-2xl mb-2">
                  {product.name}
                </h1>
                <p className="italic text-xl text-red-600 font-bold mb-2">
                  Price: {product.price} VND
                </p>
                <p className="w-auto mb-2 text-xl">
                  Available in stock:
                  <span> </span>
                  <span className="mb-2 text-lime-600 font-bold">
                    {product.stock}
                  </span>
                </p>
              </div>
              <div className="mt-5">
                <p className="mb-2">{product.description}</p>
              </div>

              <div className="xl:absolute lg:static  md:static sm:static bottom-0 flex flex-col lg:w-7/12">
                <div className="flex items-center mb-2">
                  <label htmlFor="amount" className="mr-2">
                    Amount:{" "}
                  </label>
                  {/* <input
                    className="shadow border rounded focus:outline-none w-16 lg:w-10 text-center"
                    id="amount"
                    type="number"
                    min={1}
                    value={amount}
                    onChange={handleAmountChange}
                  /> */}
                  <div className="flex flex-row h-10 w-30 rounded-lg relative bg-transparent mt-1 border border-gray-200">
                    <button
                      data-action="decrement"
                      className=" bg-gray-200 text-black hover:text-gray-700 hover:bg-gray-400 h-full w-10 rounded-l cursor-pointer outline-none"
                      onClick={() => decreaseQty(amount)}
                    >
                      <span className="m-auto text-2xl font-thin">−</span>
                    </button>
                    <input
                      type="number"
                      className="focus:outline-none text-center w-10 bg-gray-200 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-900 custom-input-number"
                      name="custom-input-number"
                      value={amount}
                      readOnly
                    ></input>
                    <button
                      data-action="increment"
                      className="bg-gray-200 text-black hover:text-gray-700 hover:bg-gray-400 h-full w-10 rounded-r cursor-pointer"
                      onClick={() => increaseQty(amount)}
                    >
                      <span className="m-auto text-2xl font-thin">+</span>
                    </button>
                  </div>
                </div>
                <Link href={""}>
                  <button className="buttonGradient border rounded-lg w-48 lg:w-48 font-bold text-black mt-5">
                    Add To Cart
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default ProductDetail;
