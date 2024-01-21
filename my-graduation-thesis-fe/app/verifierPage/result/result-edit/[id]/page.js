"use client";
import styles from "./ResultEditScreen.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Notification } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import { Select, Checkbox } from "@douyinfe/semi-ui";

const ResultEdit = () => {
  const resultId = useParams().id;
  const [data, setBlogData] = useState([]);

  // Show notification
  let errorMess = {
    title: "Error",
    content: "Result editing could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successMess = {
    title: "Success",
    content: "Result Edited Successfully.",
    duration: 3,
    theme: "light",
  };
  // End show notification

  // Load API Detail Blog

  const fetchBlogData = async () => {
    try {
      const bearerToken = Cookies.get("token");
      const response = await fetch(
        `https://ersverifierapi.azurewebsites.net/api/Result/GetById/${resultId}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setBlogData(data);
        formik.setFieldValue("id", data.id);
        formik.setFieldValue("title", data.title);
        formik.setFieldValue("description", data.description);
        if (data.status == 1) {
          formik.setFieldValue("status", "Active");
        } else {
          formik.setFieldValue("status", "Inactive");
        }
        if (data.isSend == true) {
          formik.setFieldValue("isSend", "Sent");
        } else {
          formik.setFieldValue("isSend", "No Send");
        }
      } else {
        notification.error({
          message: "Failed to fetch result data",
        });
      }
    } catch (error) {
      console.error("Error fetching result data", error);
    }
  };
  // End load API Detail Blog

  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      id: 0,
      title: "",
      description: "",
      status: "",
      isSend: false,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Result Tilte can't be empty"),
      description: Yup.string().required("Result Description can't be empty"),
    }),
    onSubmit: async (values) => {
      try {
        const bearerToken = Cookies.get("token");
        if (values.status != 1 && values.status != 0) {
          if (values.status === "Active") {
            values.status = Number(1);
          } else if (values.status === "Inactive") {
            values.status = Number(0);
          }
        } else if (values.status == 1 || values.status == 0) {
          values.status = Number(values.status);
        }

        if (values.isSend != "true" && values.isSend != "false") {
          if (values.isSend === "Sent") {
            console.log("Check 1");
            values.isSend = true;
          } else if (values.isSend === "No Send") {
            console.log("Check 2");

            values.isSend = false;
          }
        } else if (values.isSend == "true") {
          console.log("Check 3");

          values.isSend = true;
        } else if (values.isSend == "false") {
          values.isSend = false;
        }

        console.log("Values Final: " + JSON.stringify(values));
        const response = await fetch(
          `https://ersverifierapi.azurewebsites.net/api/Result/Update/${resultId}`,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
              "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify(values),
          }
        );

        if (response.ok) {
          console.log(
            "Result information updated successfully. Response:",
            data
          );
          Notification.success(successMess);
          router.push("/verifierPage/result/result-list");
        } else {
          console.log("Failed to update result information:", response.status);
          Notification.error(errorMess);
        }
      } catch (error) {
        Notification.error(errorMess);
        console.error("Error updating result information:", error);
      }
    },
  });

  useEffect(() => {
    fetchBlogData();
  }, []);
  return (
    <div className="m-auto w-[82%] mb-10">
      <div className={styles.table}>
        <h2 className="text-[32px] font-bold mb-3 text-center">Edit Result</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-4">
            <input
              value={formik.values.id}
              name="id"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              hidden
            ></input>
            <div>
              <label>Result Title</label>
              <input
                name="title"
                id="title"
                type="text"
                placeholder="Result Title"
                className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] px-[13px] py-[10px] rounded-md"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
              />
            </div>
            {formik.touched.title && formik.errors.title ? (
              <div className="text-sm text-red-600 dark:text-red-400">
                {formik.errors.title}
              </div>
            ) : null}

            <div>
              <label>
                Result Description
                <textarea
                  id="description"
                  name="description"
                  defaultValue="I really enjoyed biking yesterday!"
                  rows={6}
                  cols={40}
                  className="bg-[#FFFFFF] bg-transparent text-sm w-full border border-solid border-[#DDD] rounded-md px-[13px] py-[10px]"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.description}
                />
              </label>
            </div>
            {formik.touched.description && formik.errors.description ? (
              <div className="text-sm text-red-600 dark:text-red-400">
                {formik.errors.description}
              </div>
            ) : null}

            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="">
                <p className="text-lg font-semibold mb-3 text-center">
                  General Info
                </p>
                <div className="flex flex-col gap-4">
                  <div>
                    <label>Status</label>
                    <Select
                      name="status"
                      id="status"
                      className="bg-[#FFFFFF] !bg-transparent text-sm w-full !border !border-solid !border-[#DDD] px-[13px] py-[10px] !rounded-md ml-2"
                      style={{ width: 140, height: 41 }}
                      placeholder="Active or Inactive"
                      onChange={(value) =>
                        formik.setFieldValue("status", value)
                      }
                      onBlur={formik.handleBlur}
                      value={formik.values.status}
                    >
                      <Select.Option value="1">Active</Select.Option>
                      <Select.Option value="0">Inactive</Select.Option>
                    </Select>
                  </div>

                  <div>
                    <label>Is Send</label>
                    <Select
                      name="isSend"
                      id="isSend"
                      className="bg-[#FFFFFF] !bg-transparent text-sm w-full !border !border-solid !border-[#DDD] px-[13px] py-[10px] !rounded-md ml-2"
                      style={{ width: 140, height: 41 }}
                      placeholder="Sent or No Send"
                      onChange={(value) =>
                        formik.setFieldValue("isSend", value)
                      }
                      onBlur={formik.handleBlur}
                      value={formik.values.isSend}
                    >
                      <Select.Option value="true">Sent</Select.Option>
                      <Select.Option value="false">No Send</Select.Option>
                    </Select>
                  </div>
                </div>
              </div>

              <div className=""></div>
            </div>

            <div className="flex justify-start gap-4 mt-4 mb-2">
              <button
                className="w-[154px] py-4 rounded-[68px] bg-[#4BB543] text-white flex justify-center hover:opacity-80"
                type="submit"
              >
                <span className="text-xl font-bold">Save</span>
              </button>
              <button className="border-solid border border-[#ccc] w-[154px] py-4 rounded-[68px] flex justify-center text-[#ccc] hover:bg-[#ccc] hover:text-white">
                <a
                  className="text-xl font-bold"
                  href="/verifierPage/result/result-list"
                >
                  Cancel
                </a>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResultEdit;
