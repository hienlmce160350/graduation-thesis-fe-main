"use client";
import React from "react";
import { Input, Typography } from "@douyinfe/semi-ui";
import { IconSearch } from "@douyinfe/semi-icons";

const AllProduct = () => {
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
      </div>
    </>
  );
};
export default AllProduct;
