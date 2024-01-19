"use client";
import React, { useState, useEffect } from "react";

import { useParams } from "next/navigation";

const BlogDetail = () => {
  const blogId = useParams().id;
  const [blog, setBlog] = useState();
  const getBlogDetail = async () => {
    try {
      const response = await fetch(
        `https://eatright2.azurewebsites.net/api/Blogs/${blogId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const detailBlogData = await response.json();
        // const myJson = JSON.stringify(detailProductData);
        // console.log(myJson);
        console.log("Blog detail:", detailBlogData);
        setBlog(detailBlogData);
        // Xử lý dữ liệu product detail ở đây, có thể hiển thị trong modal hoặc component riêng
      } else {
        console.error("Failed to fetch product detail:", response);
      }
    } catch (error) {
      console.error("Error fetching product detail:", error);
    }
  };
  useEffect(() => {
    getBlogDetail();
  }, []);
  return (
    <>
      <div className="max-w-7xl mx-auto my-4 px-4">
        <div className="flex justify-center my-4 items-center flex-col">
          <h1 className="text-4xl font-bold text-green-400 uppercase">
            {blog ? blog.title : "Loading..."}
          </h1>
          <div className="h-1 w-24 mt-3 bg-green-400 mb-4"></div>
        </div>
        <div className="flex justify-center">
          <div className="">
            <img
              className="w-10/12 h-96"
              src={
                blog
                  ? blog.image
                  : "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
              }
              alt="Blog Image"
            />
          </div>

          <div className="w-10/12 px-4">
            <p className="">{blog ? blog.description : "Loading..."}</p>
            <div className=" flex justify-end">
              <p className="mt-4 p-2 italic text-lime-700 font-semibold">
                Created by: {blog ? blog.createdBy : "Unknown"}
                <br />
                Date Created:{" "}
                {blog ? new Date(blog.dateCreate).toLocaleString() : "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default BlogDetail;
