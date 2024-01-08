"use client";
import styles from "./UserEditScreen.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPenSquare } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Notification } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";

const UserEdit = () => {
  const userId = useParams().id;
  const [data, setUserData] = useState([]);

  // Show notification
  let errorMess = {
    title: "Error",
    content: "User editing could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successMess = {
    title: "Success",
    content: "User Edited Successfully.",
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
        formik.setFieldValue("id", data.resultObj.id);
        formik.setFieldValue("firstName", data.resultObj.firstName);
        formik.setFieldValue("lastName", data.resultObj.lastName);
        formik.setFieldValue("dob", data.resultObj.dob);
        formik.setFieldValue("email", data.resultObj.email);
        formik.setFieldValue("phoneNumber", data.resultObj.phoneNumber);
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

  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      id: "",
      firstName: "",
      lastName: "",
      dob: "",
      email: "",
      phoneNumber: "",
    },
    onSubmit: async (values) => {
      try {
        const bearerToken = Cookies.get("token");
        console.log("Values Edit: " + values);
        const response = await fetch(
          `https://ersadminapi.azurewebsites.net/api/Users/${userId}`,
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
          const data = await response.json();
          console.log("User information updated successfully. Response:", data);
          Notification.success(successMess);
          router.push("/adminPage/user/user-list");
        } else {
          console.log("Failed to update user information:", response.status);
          Notification.error(errorMess);
        }
      } catch (error) {
        Notification.error(errorMess);
        console.error("Error updating user information:", error);
      }
    },
  });

  useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <div className="ml-[12px] w-[82%] mt-[104px] mb-10">
      <div className={styles.table}>
        <h2 className="text-[32px] font-bold mb-3 text-center">Add New User</h2>
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <div className="contain grid grid-cols-2 gap-20 m-auto mt-4">
            <div className={styles.details}>
              <input
                value={formik.values.id}
                name="id"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                hidden
              ></input>
              <div className={styles.emailButton}>
                <b className={styles.email}>First Name</b>
                <div className="!h-11 px-[13px] py-[15px] w-full inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                  <input
                    name="firstName"
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    className="bg-[#FFFFFF] bg-transparent text-sm w-full border-none outline-none"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstName}
                  />
                  <FaPenSquare className="text-[24px]" />
                </div>
              </div>
              <div className={styles.emailButton}>
                <b className={styles.email}>Last Name</b>
                <div className="!h-11 px-[13px] py-[15px] w-full inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                  <input
                    name="lastName"
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    className="bg-[#FFFFFF] bg-transparent text-sm w-full border-none outline-none"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                  />
                  <FaPenSquare className="text-[24px]" />
                </div>
              </div>
              <div className={styles.emailButton}>
                <b className={styles.email}>Date of Birth</b>
                <div className="!h-11 px-[13px] py-[15px] w-full inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                  <input
                    name="dob"
                    id="dob"
                    type="text"
                    placeholder="yyyy-mm-dd"
                    className="bg-[#FFFFFF] bg-transparent text-sm w-full border-none outline-none"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.dob}
                  />
                  <FaRegCalendarAlt className="text-[24px]" />
                </div>
              </div>
            </div>
            <div className={styles.details}>
              <div className={styles.emailButton}>
                <b className={styles.email}>Email</b>
                <div className="!h-11 px-[13px] py-[15px] w-full inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                  <input
                    name="email"
                    id="email"
                    type="email"
                    placeholder="name@gmail.com"
                    className="bg-[#FFFFFF] bg-transparent text-sm w-full border-none outline-none"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                  />
                  <MdEmail className="text-[24px]" />
                </div>
              </div>
              <div className={styles.emailButton}>
                <b className={styles.email}>Phone Number</b>
                <div className="!h-11 px-[13px] py-[15px] w-full inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                  <input
                    name="phoneNumber"
                    id="phoneNumber"
                    type="text"
                    placeholder="0900******"
                    className="bg-[#FFFFFF] bg-transparent text-sm w-full border-none outline-none"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phoneNumber}
                  />
                  <MdEmail className="text-[24px]" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-start gap-4 mt-4 mb-2">
            <button
              className="w-[154px] py-4 rounded-[68px] bg-[#4BB543] text-white flex justify-center hover:opacity-80"
              type="submit"
            >
              <span className="text-xl font-bold">Save</span>
            </button>
            <button className="border-solid border border-[#ccc] w-[154px] py-4 rounded-[68px] flex justify-center text-[#ccc] hover:bg-[#ccc] hover:text-white">
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

export default UserEdit;
