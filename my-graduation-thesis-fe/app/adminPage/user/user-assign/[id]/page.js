"use client";
import styles from "./UserAssignScreen.module.css";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Notification } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import { Select, Checkbox } from "@douyinfe/semi-ui";
import { Tag, Space } from "@douyinfe/semi-ui";
import { withAuth } from "../../../../../context/withAuth";

const UserAssign = () => {
  const userId = useParams().id;
  const [data, setUserData] = useState([]);

  const [rolesData, setRolesData] = useState([]);

  // Show notification
  let errorMess = {
    title: "Error",
    content: "User Assign Role could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successMess = {
    title: "Success",
    content: "User Assign Role Successfully.",
    duration: 3,
    theme: "light",
  };
  // End show notification

  // Load API Detail User

  const fetchUserData = async () => {
    try {
      // Replace with the actual user ID
      const bearerToken = Cookies.get("token");
      const response = await fetch(
        `https://ersadminapi.azurewebsites.net/api/Users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUserData(data);
      } else {
        notification.error({
          message: "Failed to fetch user data",
        });
      }
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };
  // End load API Detail User

  // Load API Roles List

  const fetchRolesData = async () => {
    try {
      const response = await fetch(
        `https://ersadminapi.azurewebsites.net/api/Roles`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setRolesData(data);
      } else {
        notification.error({
          message: "Failed to fetch roles data",
        });
      }
    } catch (error) {
      console.error("Error fetching roles data", error);
    }
  };
  // End load API Roles List

  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      roles: [],
    },
    onSubmit: async (values) => {
      // Handle role data
      const rolesArray = [];

      values.roles.forEach((roleId) => {
        const matchingRole = rolesData.find((role) => role.id === roleId);
        if (matchingRole) {
          matchingRole.selected = true;
          delete matchingRole.description;
          rolesArray.push(matchingRole);
        }
      });

      rolesArray.forEach((item) => {
        if (data.resultObj.roles.includes(item.name)) {
          item.selected = false;
        }
      });

      console.log("Roles Array: " + JSON.stringify(rolesArray));
      console.log("Values: " + JSON.stringify(values));
      // call API Assign Role
      try {
        const bearerToken = Cookies.get("token");
        const requestBody = {
          id: userId,
          roles: rolesArray,
        };

        console.log("Request Body: " + JSON.stringify(requestBody));

        const response = await fetch(
          `https://ersadminapi.azurewebsites.net/api/Users/${userId}/roles`,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
              "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify(requestBody),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("User assign role successfully. Response:", data);
          Notification.success(successMess);
          router.push("/adminPage/user/user-list");
        } else {
          console.log("Failed to assign role:", response.status);
          Notification.error(errorMess);
        }
      } catch (error) {
        Notification.error(errorMess);
        console.error("Error assigning role:", error);
      }
    },
  });

  useEffect(() => {
    fetchUserData();
    fetchRolesData();
  }, []);
  return (
    <div className="m-auto w-[82%] mb-10">
      <div className={styles.table}>
        <h2 className="text-[32px] font-bold mb-3 text-center">Assign Role</h2>
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <div className="contain m-auto mt-4 w-full">
            <div className={styles.details}>
              <div className={styles.emailButton}>
                <b className={styles.email}>Roles Of This Account</b>
                <div className="mt-3 !h-11 px-[13px] py-[15px] w-full inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                  {data.resultObj && data.resultObj.roles != "" ? (
                    <Space wrap>
                      {data.resultObj.roles.map((item, index) => (
                        <Tag color="green" key={index}>
                          {item}
                        </Tag>
                      ))}
                    </Space>
                  ) : (
                    <span>No roles</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col mt-2">
                <b className={styles.email}>
                  Choose role that you want to assign this account
                </b>
                <div className="mt-3 !h-11 py-[15px] w-fit inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                  <Select
                    onChange={(value) => formik.setFieldValue("roles", value)}
                    onBlur={formik.handleBlur}
                    value={formik.values.roles}
                    name="roles"
                    id="roles"
                    className="bg-[#FFFFFF] !bg-transparent text-sm w-full px-[13px] py-[10px] !rounded-md"
                    style={{ width: "fit-content", height: 41 }}
                    placeholder="Select Roles"
                    multiple // Thêm prop này để chuyển đổi thành Multiple Selection
                  >
                    {rolesData.map((role) => (
                      <Select.Option key={role.id} value={role.id}>
                        {role.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-start gap-4 mt-4 mb-2">
            <button
              className="w-[100px] py-1 rounded-[68px] bg-[#4BB543] text-white flex justify-center hover:opacity-80"
              type="submit"
            >
              <span className="text-xl font-bold">Save</span>
            </button>
            <button className="border-solid border border-[#ccc] w-[100px] py-1 rounded-[68px] flex justify-center text-[#ccc] hover:bg-[#ccc] hover:text-white">
              <a className="text-xl font-bold" href="/adminPage/user/user-list">
                Cancel
              </a>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAuth(UserAssign, "admin");
