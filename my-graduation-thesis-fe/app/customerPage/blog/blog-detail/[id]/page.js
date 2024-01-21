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
        setBlog(detailBlogData);
      } else {
        console.error("Failed to fetch blog detail:", response);
      }
    } catch (error) {
      console.error("Error fetching blog detail:", error);
    }
  };

  useEffect(() => {
    getBlogDetail();
  }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto my-4 px-4">
        <div className="flex justify-center my-4 items-center flex-col">
          <h1 className="text-4xl font-bold text-green-400 uppercase text-center">
            {blog ? blog.title : "Loading..."}
          </h1>
          <div className="h-1 w-24 mt-3 bg-green-400 mb-4"></div>
        </div>
        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start">
          <div className="w-full lg:w-1/2 lg:mr-8">
            <img
              className="xl:w-full lg:w-full md:w-full xl:h-96 object-cover sm:w-1/2"
              src={
                blog
                  ? blog.image
                  : "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
              }
              alt="Blog Image"
            />
          </div>

          <div className="w-full lg:w-1/2 px-4 mt-4 lg:mt-0">
            <p className="">{blog ? blog.description : "Loading..."}</p>
            <div className="flex justify-end mt-4 p-2 italic text-lime-700 font-semibold">
              <p>
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
