"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Pagination } from "@douyinfe/semi-ui";
import { get } from "https";
import { Form, Input } from "@douyinfe/semi-ui";
import { IconSearch, IconFilter } from "@douyinfe/semi-icons";
import { Select } from "@douyinfe/semi-ui";
import { useCart } from "../../../../context/CartContext"; // Import useCart
import { Button } from "@douyinfe/semi-ui";
import { Modal } from "@douyinfe/semi-ui";
import { Empty } from "@douyinfe/semi-ui";
import { IllustrationNoResult } from "@douyinfe/semi-illustrations";
import { IllustrationNoResultDark } from "@douyinfe/semi-illustrations";
import { Breadcrumb } from "@douyinfe/semi-ui";
import { IconHome, IconShoppingBag } from "@douyinfe/semi-icons";
import { Skeleton } from "@douyinfe/semi-ui";

const AllProduct = () => {
  const [dataSource, setData] = useState([]);
  const [categories, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [selectedLanguage, setSelectedLanguage] = useState("en"); // Khởi tạo state ngôn ngữ mặc định
  const [page, setPage] = useState(1);
  const productsPerPage = 8;
  const { addToCart } = useCart(); // Sử dụng useCart để lấy addToCart từ context

  const [loading, setLoading] = useState(false);

  const handleLanguageChange = (value) => {
    const selectedValue = value;
    setSelectedLanguage(selectedValue);
    setSelectedCategory("");
    localStorage.setItem("language", selectedValue);
    getData();
  };
  const handleCategoryChange = (value) => {
    const selectedValue = value;
    setSelectedCategory(selectedValue);
    getData();
    console.log(selectedValue);
  };
  const [productName, setProductName] = useState("");

  const handleProductNameChange = (value) => {
    setProductName(value);
    console.log(value);
  };
  const [visible, setVisible] = useState(false);
  const showDialog = () => {
    setVisible(true);
  };
  const handleOk = () => {
    setVisible(false);
  };
  const handleCancel = () => {
    setVisible(false);
  };
  // useEffect(() => {
  //   // Lấy giá trị ngôn ngữ từ localStorage khi component được render
  //   const storedLanguage = localStorage.getItem("language");
  //   if (storedLanguage) {
  //     setSelectedLanguage(storedLanguage);
  //   }
  // }, []);

  const getData = async () => {
    setLoading(true);
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
        setLoading(false);
      } else {
        setLoading(false);
        console.error("Failed to fetch data:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
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
        <div className="p-[7px] bg-[#eee]">
          <Breadcrumb compact={false}>
            <Breadcrumb.Item icon={<IconHome />} href="/customerPage/home">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item icon={<IconShoppingBag />} noLink={true}>
              Product
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="flex justify-center my-4 items-center flex-col">
          <h1 className="text-4xl font-bold text-[#69AD28]">Product</h1>
          <div className="h-1 w-32 mt-3 bg-[#69AD28]"></div>
        </div>

        <div className="flex justify-between my-4 items-center max-w-7xl">
          <div className="w-1/2 md:w-1/3 flex justify-start md:pl-0">
            <div className="w-fit px-2 py-2 rounded-md border border-[#74A65D]">
              <p className="text-[#74A65D] font-light">
                {productCount} products found
              </p>
            </div>
          </div>
          <div className="w-1/2 md:w-2/3 flex items-center justify-end">
            <div className="hidden md:flex">
              <Input
                suffix={<IconSearch className="!text-2xl" />}
                showClear
                placeholder={"Input your keywords here"}
                onChange={(value) => handleProductNameChange(value)}
                initValue={productName}
                value={productName}
                className="!rounded-[10px] !w-[70%]  !h-12 !border-2 border-solid !border-[#ACCC8B] !bg-white"
              />
              <Select
                style={{
                  height: "48px",
                  fontWeight: "600",
                  width: "200px",
                  textAlign: "center",
                }}
                className="!bg-[#ACCC8B] rounded-[10px] !text-[#214400] mx-4 !border-[#ACCC8B]"
                value={selectedCategory}
                z
                onChange={handleCategoryChange}
              >
                <Select.Option className="hover:!bg-[#F4FFEB] !py-2" value="">
                  All Products
                </Select.Option>
                {categories.map((category) => (
                  <Select.Option
                    className="hover:!bg-[#F4FFEB] !py-2"
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
              <Select
                style={{ height: "100%", width: "120px" }}
                className="!bg-[#ACCC8B] rounded-[10px] text-[#214400] p-2 w-20 !border-[#ACCC8B]"
                defaultValue={selectedLanguage}
                value={selectedLanguage}
                onChange={(value) => handleLanguageChange(value)}
              >
                <Select.Option className="hover:!bg-[#F4FFEB]" value="vi">
                  <img
                    className="w-8 h-8"
                    src="/staticImage/vietnam-flag-round-circle-icon.svg"
                  />
                </Select.Option>
                <Select.Option className="hover:!bg-[#F4FFEB]" value="en">
                  <img
                    className="w-8 h-8"
                    src="/staticImage/usa-flag-round-circle-icon.svg"
                  />
                </Select.Option>
              </Select>
            </div>
            <div className="md:hidden rounded-md border border-[#69AD28] flex flex-row items-center text-center justify-center">
              <button
                onClick={showDialog}
                type="button"
                className="h-10 !text-[#69AD28] flex items-center justify-center px-2"
              >
                <IconFilter />
                <p className="text-[#69AD28]">Filter</p>
              </button>
            </div>

            <Modal
              width={400}
              title={
                <div className="text-center w-full pl-10 text-gray-400">
                  Filter Product
                </div>
              }
              visible={visible}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={
                <div className="flex justify-center">
                  <Button
                    className="!bg-[#69AD28] !text-white w-[80%] !h-10 rounded-2xl !mr-2"
                    onClick={handleOk}
                  >
                    Close
                  </Button>
                </div>
              }
            >
              <div className="flex justify-center">
                <Input
                  suffix={<IconSearch className="!text-2xl" />}
                  showClear
                  onChange={(value) => handleProductNameChange(value)}
                  initValue={productName}
                  value={productName}
                  className="!rounded-[10px] !w-[80%] !h-12 !border border-solid !border-[#DDF7E3] !bg-white mb-2"
                />
              </div>
              <div className="flex justify-start">
                <Select
                  style={{
                    height: "48px",
                    fontWeight: "600",
                    width: "140px",
                    textAlign: "center",
                  }}
                  className="!bg-[#F4FFEB] rounded-lg !text-[#214400] ml-9"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <Select.Option className="hover:!bg-[#F4FFEB] !py-2" value="">
                    All Products
                  </Select.Option>
                  {categories.map((category) => (
                    <Select.Option
                      className="hover:!bg-[#F4FFEB] !py-2"
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
                <Select
                  style={{ height: "100%", width: "100px" }}
                  className="!bg-[#F4FFEB] rounded-lg text-[#214400] p-2 w-20 flex flex-row ml-10"
                  defaultValue={selectedLanguage}
                  onChange={(value) => handleLanguageChange(value)}
                >
                  <Select.Option value="vi">
                    <img
                      className="w-8 h-8 mr-2"
                      src="/staticImage/vietnam-flag-round-circle-icon.svg"
                    />
                  </Select.Option>
                  <Select.Option value="en">
                    <img
                      className="w-8 h-8 mr-2"
                      src="/staticImage/usa-flag-round-circle-icon.svg"
                    />
                  </Select.Option>
                </Select>
              </div>
            </Modal>
          </div>
        </div>

        {currentPageData == "" ? (
          <div className="overflow-x-auto">
            <div className="flex flex-col items-center">
              <Empty
                image={
                  <IllustrationNoResult style={{ width: 150, height: 150 }} />
                }
                darkModeImage={
                  <IllustrationNoResultDark
                    style={{ width: 150, height: 150 }}
                  />
                }
                description={
                  <p className="font-semibold text-2xl">Not Found</p>
                }
                className="p-6 pb-1"
              />
            </div>
          </div>
        ) : loading ? (
          <p className="items-center">Loading...</p>
        ) : (
          <div className="grid-cols-1 gap-3 sm:grid-cols-2 grid lg:grid-cols-4 m-auto place-items-center">
            {currentPageData.map((product) => (
              <div
                key={product.id}
                className="flex flex-col md:w-auto lg:w-full rounded-lg outline outline-1 outline-[#74A65D] p-2"
              >
                <Skeleton
                  loading={loading}
                  style={{
                    width: "auto",
                    height: "256px",
                    background: "#cccccc",
                  }}
                >
                  <img
                    className="mb-2"
                    src={
                      product.thumbnailImage ||
                      "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                    }
                    alt="Blog Thumbnail"
                  />
                </Skeleton>
                <div className="flex flex-col">
                  <Link
                    href={`/customerPage/product/product-detail/${product.id}`}
                    className="font-normal text-xl line-clamp-2 hover:text-[#74A65D]"
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

                  <div className="h-20">
                    <Skeleton
                      loading={loading}
                      style={{
                        width: "290px",
                        height: "72px",
                        background: "#cccccc",
                        marginTop: "4px",
                      }}
                    >
                      <p className="line-clamp-3 mt-2">{product.description}</p>
                    </Skeleton>
                  </div>
                </div>
                <div className="flex items-center justify-center flex-col">
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
                  <button
                    className="h-auto p-2 hover:bg-[#ACCC8B] hover:text-white border border-[#74A65D] w-full rounded-lg font-bold"
                    onClick={() =>
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        thumbnailImage: product.thumbnailImage,
                        stock: product.stock,
                      })
                    }
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
