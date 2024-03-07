"use client";
import React, { useState, useEffect } from "react";
import { Pagination } from "@douyinfe/semi-ui";
import Link from "next/link";
import { Empty } from "@douyinfe/semi-ui";
import { IllustrationNoResult } from "@douyinfe/semi-illustrations";
import { IllustrationNoResultDark } from "@douyinfe/semi-illustrations";
import { Breadcrumb } from "@douyinfe/semi-ui";
import { IconHome, IconArticle } from "@douyinfe/semi-icons";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const blogsPerPage = 8;
  const getBlogList = async () => {
    const response = await fetch(
      `https://eatright2.azurewebsites.net/api/Blogs`,
      {
        headers: {
          Method: "GET",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setBlogs(data); // Cập nhật dataSource với dữ liệu từ API
    } else {
      console.error("Failed to fetch data:", response);
    }
  };
  useEffect(() => {
    getBlogList(); // Gọi hàm getData khi component được render
  }, []);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  // Hàm xử lý sự kiện thay đổi trang
  const onPageChange = (currentPage) => {
    setPage(currentPage);
  };

  // Lấy dữ liệu của trang hiện tại
  const currentPageData = blogs.slice(
    (page - 1) * blogsPerPage,
    page * blogsPerPage
  );
  return (
    <>
      <div className="max-w-7xl mx-auto my-4 px-4">
        <div className="p-[7px] bg-[#eee]">
          <Breadcrumb compact={false}>
            <Breadcrumb.Item icon={<IconHome />} href="/customerPage/home">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item icon={<IconArticle />} noLink={true}>
              Blog
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="flex justify-center my-4 items-center flex-col">
          <h1 className="text-4xl font-bold text-[#69AD28]">Blog</h1>
          <div className="h-1 w-32 mt-3 bg-[#69AD28]"></div>
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
        ) : (
          <div className="flex flex-wrap gap-5 xl:justify-start xl:pl-5 md:justify-center sm: justify-center">
            {currentPageData.map((blog) => (
              <div
                key={blog.id}
                className="flex flex-col w-72 rounded-lg outline outline-1 outline-green-500 p-2"
              >
                <img
                  className="h-64 mb-2"
                  src={
                    blog.image ||
                    "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                  }
                  alt="Blog Thumbnail"
                />
                <div className="flex flex-col">
                  <Link
                    href={`/customerPage/blog/blog-detail/${blog.id}`}
                    className="font-bold text-xl line-clamp-1"
                  >
                    {blog.title}
                  </Link>
                  <p className="line-clamp-3 mt-2">{blog.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-center my-4">
          <Pagination
            total={totalPages * 10}
            currentPage={page}
            onPageChange={onPageChange}
          ></Pagination>
        </div>
      </div>
    </>
  );
};
export default BlogList;
