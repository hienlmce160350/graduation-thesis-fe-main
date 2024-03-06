"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Pagination } from "@douyinfe/semi-ui";
import { get } from "https";
import { Form, Input } from "@douyinfe/semi-ui";
import { IconSearch } from "@douyinfe/semi-icons";
import { Select } from "@douyinfe/semi-ui";
import { useCart } from "../../../../context/CartContext"; // Import useCart

const AllProduct = () => {
  const [dataSource, setData] = useState([]);
  const [categories, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [selectedLanguage, setSelectedLanguage] = useState("en"); // Khởi tạo state ngôn ngữ mặc định
  const [page, setPage] = useState(1);
  const productsPerPage = 8;
  const { addToCart } = useCart(); // Sử dụng useCart để lấy addToCart từ context

  const handleLanguageChange = (value) => {
    const selectedValue = value;
    setSelectedLanguage(selectedValue);
    setSelectedCategory("");
    localStorage.setItem("language", selectedValue);
    getData();
  };
  const handleCategoryChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedCategory(selectedValue);
    getData();
    console.log(selectedValue);
  };
  const [productName, setProductName] = useState("");

  const handleProductNameChange = (value) => {
    setProductName(value);
    console.log(value);
  };

  // useEffect(() => {
  //   // Lấy giá trị ngôn ngữ từ localStorage khi component được render
  //   const storedLanguage = localStorage.getItem("language");
  //   if (storedLanguage) {
  //     setSelectedLanguage(storedLanguage);
  //   }
  // }, []);

  const getData = async () => {
    try {
      const storedLanguage = localStorage.getItem("language");
      if (storedLanguage) {
        setSelectedLanguage(storedLanguage);
      } else {
        setSelectedLanguage("en"); // Gán giá trị mặc định là "en" nếu không có trong localStorage
      }
      const response = await fetch(
        `https://eatright2.azurewebsites.net/api/Products/getAll?Keyword=${productName}&LanguageId=${storedLanguage}&CategoryId=${selectedCategory}`,
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
        getCategories();
      } else {
        console.error("Failed to fetch data:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const getCategories = async () => {
    try {
      const storedLanguage = localStorage.getItem("language");
      if (storedLanguage) {
        setSelectedLanguage(storedLanguage);
      } else {
        setSelectedLanguage("en"); // Gán giá trị mặc định là "en" nếu không có trong localStorage
      }
      const response = await fetch(
        `https://eatright2.azurewebsites.net/api/Categories?languageId=${storedLanguage}`,
        {
          headers: {
            Method: "GET",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const catedata = await response.json();
        console.log("categories: ", catedata);
        setCategory(catedata); // Cập nhật dataSource với dữ liệu từ API
      } else {
        console.error("Failed to fetch data:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getData(); // Gọi hàm getData khi component được render
    getCategories();
  }, [selectedCategory, productName]); // Chỉ gọi một lần sau khi component được render
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
  // Calculate product count
  const productCount = dataSource.length;

  return (
    <>
      <div className="max-w-7xl mx-auto my-4 px-4">
        <div className="flex justify-center my-4 items-center flex-col">
          <h1 className="text-4xl font-bold text-green-400">Product</h1>
          <div className="h-1 w-32 mt-3 bg-green-400"></div>
        </div>

        <div className="flex justify-between my-4 items-center max-w-7xl mx-4">
          <div className="w-1/3">
            <div className="w-fit px-2 py-2 rounded-md border border-[#69AD28]">
              <p className="text-[#69AD28] font-light">
                {productCount} products found
              </p>
            </div>
          </div>
          <div className="w-2/3 flex items-center justify-end gap-4">
            <Input
              suffix={<IconSearch className="!text-2xl" />}
              showClear
              onChange={(value) => handleProductNameChange(value)}
              initValue={productName}
              className="!rounded-[10px] !w-[50%] !h-12 !border border-solid !border-[#DDF7E3] !bg-white"
            />
            <select
              style={{ height: "48px", fontWeight: "600" }}
              className="bg-[#F4FFEB] rounded-lg text-[#214400] p-2 text-center"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">All Products</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <Select
              style={{ height: "100%" }}
              className="bg-[#F4FFEB] rounded-lg text-[#214400] p-2 w-20"
              defaultValue={selectedLanguage}
              onChange={(value) => handleLanguageChange(value)}
            >
              <Select.Option value="vi">
                <img
                  className="w-8 h-8"
                  src="/staticImage/vietnam-flag-round-circle-icon.svg"
                />
              </Select.Option>
              <Select.Option value="en">
                <img
                  className="w-8 h-8"
                  src="/staticImage/usa-flag-round-circle-icon.svg"
                />
              </Select.Option>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-5 xl:justify-start xl:pl-5 md:justify-center sm: justify-center">
          {currentPageData.map((product) => (
            <div
              key={product.id}
              className="flex flex-col w-72 rounded-lg outline outline-1 outline-green-500 p-2"
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
                <div className="flex gap-2 items-center my-4">
                  <h5 className="text-md text-red-400 line-through">
                    {product.originalPrice} $
                  </h5>
                  <h5 className="text-xl text-lime-600 font-semibold">
                    {product.price} $
                  </h5>
                </div>
                <button
                  className="buttonGradient w-full rounded-lg font-bold"
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      thumbnailImage: product.thumbnailImage,
                    })
                  }
                >
                  Add To Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center my-4">
        <Pagination
          className="text-white"
          total={totalPages * 10}
          currentPage={page}
          onPageChange={onPageChange}
        ></Pagination>
      </div>
    </>
  );
};
export default AllProduct;
