"use client";
import styles from "./UserEditScreen.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa";
import { FaPenSquare } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Notification } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import { withAuth } from "../../../../../context/withAuth";

const UserEdit = () => {
  const [ids, setIds] = useState([]);
  const userId = useParams().id;
  const [data, setUserData] = useState([]);

  const [isEditMode, setIsEditMode] = useState(false);

  const [isCancelMode, setIsCancelMode] = useState(false);

  const [isSaveMode, setIsSaveMode] = useState(false);

  const handleEditClick = () => {
    setIsEditMode(true);
    setIsCancelMode(false);
  };

  const handleCancelClick = () => {
    setIsCancelMode(true);
    setIsEditMode(false);
    fetchUserData();
  };

  const handleSaveClick = () => {
    setIsSaveMode(true);
  };

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

  let loadingMess = {
    title: "Loading",
    content: "Your task is being processed. Please wait a moment",
    duration: 3,
    theme: "light",
  };

  let emailErrorMess = {
    title: "Error",
    content: "Email already exists. Please try again.",
    duration: 3,
    theme: "light",
  };

  let accountErrorMess = {
    title: "Error",
    content: "Username already exists. Please try again.",
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

        const date = new Date(data.resultObj.dob);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        formik.setFieldValue("dob", formattedDate);

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

  // Edit user
  // function create user
  const editUser = async (credentials) => {
    const bearerToken = Cookies.get("token");
    fetch(`https://ersadminapi.azurewebsites.net/api/Users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        // Log the response data to the console
        let idsTmp = [...ids];
        // Handle the response data as needed
        if (data.isSuccessed) {
          // Success logic
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          Notification.success(successMess);
          router.push("/adminPage/user/user-list");
        } else {
          // Failure logic
          if (data.message == "Email is exist") {
            Notification.error(emailErrorMess);
          } else {
            Notification.error(errorMess);
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors
      });
  };
  // End edit user

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
    validationSchema: Yup.object({
      dob: Yup.date().max(
        new Date(),
        "Date must be not greater than current date"
      ),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phoneNumber: Yup.string().matches(/^0[1-9]\d{8,10}$/, "Phone is invalid"),
    }),
    onSubmit: async (values) => {
      if ((!isEditMode && !isCancelMode) || isSaveMode) {
        let id = Notification.info(loadingMess);
        setIds([...ids, id]);
        editUser(values);
      }
    },
  });

  useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <div className="mx-auto w-full mt-3 h-fit mb-3">
      <div className="bg-white h-fit m-auto px-7 py-3 rounded-[4px] border w-fit">
        <h2 className="text-[32px] font-medium mb-3 text-center">
          {isEditMode ? "Update User" : "User Information"}
        </h2>
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <div className="contain grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 m-auto mt-4">
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
                    disabled={!isEditMode}
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
                    disabled={!isEditMode}
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
                    disabled={!isEditMode}
                  />
                  <FaRegCalendarAlt className="text-[24px]" />
                </div>
                {formik.touched.dob && formik.errors.dob ? (
                  <div className="text-sm text-red-600 dark:text-red-400">
                    {formik.errors.dob}
                  </div>
                ) : null}
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
                    disabled={!isEditMode}
                  />
                  <MdEmail className="text-[24px]" />
                </div>
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-sm text-red-600 dark:text-red-400">
                    {formik.errors.email}
                  </div>
                ) : null}
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
                    disabled={!isEditMode}
                  />
                  <FaPhone className="text-[24px]" />
                </div>
                {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                  <div className="text-sm text-red-600 dark:text-red-400">
                    {formik.errors.phoneNumber}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex justify-start gap-4 mt-10 mb-2">
            {isEditMode ? (
              <button
                className="p-2 rounded-lg w-24 bg-[#74A65D] text-white hover:bg-[#44703D]"
                type="submit"
                onClick={handleSaveClick}
              >
                <span className="text-xl font-bold">Save</span>
              </button>
            ) : (
              <button
                className="p-2 rounded-lg w-24 bg-[#74A65D] text-white hover:bg-[#44703D]"
                type="button"
                onClick={handleEditClick}
              >
                <span className="text-xl font-bold">Update</span>
              </button>
            )}
            {isEditMode ? (
              <button
                className="p-2 rounded-lg w-24 text-[#74A65D] border border-[#74A65D] hover:border-[#44703D] hover:border hover:text-[#44703D]"
                type="button"
                onClick={handleCancelClick}
              >
                <span className="text-xl font-bold">Cancel</span>
              </button>
            ) : (
              <button className="p-2 rounded-lg w-24 text-[#74A65D] border border-[#74A65D] hover:border-[#44703D] hover:border hover:text-[#44703D]">
                <a
                  className="text-xl font-bold"
                  href="/adminPage/user/user-list"
                >
                  Back
                </a>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAuth(UserEdit, "admin");
