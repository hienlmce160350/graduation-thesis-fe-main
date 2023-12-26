"use client";
import { Notification } from "@douyinfe/semi-ui";
import React, { useEffect, useState } from "react";
import { Spin } from "@douyinfe/semi-ui";
const testComponent = () => {
  const [loading, setLoading] = useState(false);
  let errorMess = {
    title: "Error",
    content: "Addition of product could not be proceed. Please try again.",
    duration: 3,
  };

  let successMess = {
    title: "Success",
    content: "Product Added Successfully.",
    duration: 3,
  };
  const callAPI = async () => {
    try {
      setLoading(true); // Bắt đầu loading
      const res = await fetch(
        "https://63fc5f2b8ef914c5559612a1.mockapi.io/traningProgram",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            // No need to set "Access-Control-Allow-Origin" here; it's a response header, not a request header
          },
        }
      );
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        // Display success notification
        Notification.success(successMess);
        // You can do additional processing with the data if needed
        console.log(data);
      } else {
        // Display an error notification
        Notification.error(errorMess);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false); // Kết thúc loading, dù có lỗi hay không
    }
  };
  return (
    <div>
      <main>
        <button onClick={callAPI}>Make API Call</button>
        <Spin size="large" spinning={loading} />{" "}
        {/* Hiển thị spinner nếu đang loading */}
      </main>
    </div>
  );
};

export default testComponent;
