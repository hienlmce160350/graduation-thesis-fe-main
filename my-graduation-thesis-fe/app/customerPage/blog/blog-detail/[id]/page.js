"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { IconCalendar } from "@douyinfe/semi-icons";
import { Avatar } from "@douyinfe/semi-ui";
import { Breadcrumb } from "@douyinfe/semi-ui";
import { IconHome, IconArticle } from "@douyinfe/semi-icons";

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
      <div className="max-w-7xl mx-auto my-4 px-4 md:px-[5rem] lg:px-[9rem]">
        <div className="p-[7px] bg-[#eee]">
          <Breadcrumb compact={false}>
            <Breadcrumb.Item icon={<IconHome />} href="/customerPage/home">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item
              icon={<IconArticle />}
              href="/customerPage/blog/blog-list"
            >
              Blog
            </Breadcrumb.Item>
            {blog && (
              <Breadcrumb.Item noLink={true}>{blog.title}</Breadcrumb.Item>
            )}
          </Breadcrumb>
        </div>
        <div className="flex justify-center my-4 items-center flex-col">
          <h1 className="text-3xl font-extrabold text-[#69AD28] uppercase text-center">
            {blog ? blog.title : "Loading..."}
          </h1>
          <div className="h-1 w-24 mt-3 bg-[#69AD28] mb-4"></div>
        </div>
        <div className="flex gap-8 justify-end">
          <div className="flex flex-row gap-8 items-center">
            <p className="font-semibold flex items-center gap-1">
              <img
                className="w-6 h-6 rounded-full"
                src={
                  blog
                    ? blog.userAvatar
                    : "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                }
                alt="Blog Image"
              />
              {blog ? blog.createdBy : "Unknown"}
            </p>
            <p className="flex items-center font-semibold">
              <IconCalendar className="mr-1" />
              {blog
                ? new Date(blog.dateCreate).toLocaleDateString()
                : "Unknown"}
            </p>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="w-full my-4 flex justify-center">
            <img
              className="w-full h-full lg:h-[600px] rounded-lg"
              src={
                blog
                  ? blog.image
                  : "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
              }
              alt="Blog Image"
            />
          </div>

          <div className="w-full ">
            {/* Sử dụng dangerouslySetInnerHTML để render HTML */}
            {blog ? (
              <div>
                {blog.description.split("\n").map((paragraph, index) => (
                  <p className="font-light" key={index}>
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              "Loading..."
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetail;
