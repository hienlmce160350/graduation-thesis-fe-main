"use client";
import styles from "./UserEditScreen.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa";
import { FaPenSquare } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Notification, DatePicker } from "@douyinfe/semi-ui";
import Cookies from "js-cookie";
import { withAuth } from "../../../../../context/withAuth";
import Link from "next/link";
import { LocaleProvider } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";

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

  // End show notification

  // Load API Detail User

  const fetchUserData = async () => {
    try {
      // Replace with the actual user ID
      const bearerToken = Cookies.get("token");
      const response = await fetch(
        `https://ersadmin.azurewebsites.net/api/Users/${userId}`,
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

  // Edit user
  const editUser = async (credentials) => {
    const bearerToken = Cookies.get("token");
    fetch(`https://ersadmin.azurewebsites.net/api/Users/${userId}`, {
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
          fetchUserData();
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
  const currentDate = new Date();
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
      firstName: Yup.string()
        .max(200, "First Name must not exceed 200 characters")
        .nullable(),
      lastName: Yup.string()
        .max(200, "Last Name must not exceed 200 characters")
        .nullable(),
      dob: Yup.date().max(
        currentDate,
        "Date of Birth must be before or equal to current Date"
      ),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phoneNumber: Yup.string()
        .matches(/^0[1-9]\d{8,10}$/, "Phone is invalid")
        .nullable(),
    }),
    onSubmit: async (values) => {
      if ((!isEditMode && !isCancelMode) || isSaveMode) {
        let id = Notification.info(loadingMess);
        setIds([...ids, id]);
        var dob = new Date(values.dob);
        dob.setDate(dob.getDate() + 1);
        var newDob = dob.toISOString();
        values.dob = newDob;
        editUser(values);
      }
    },
  });

  const customInputStyle = {
    // Specify your desired styles here
    backgroundColor: "transparent",
    marginTop: "5px",
    border: "none",
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <LocaleProvider locale={en_US}>
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
                  {formik.touched.firstName && formik.errors.firstName ? (
                    <div className="text-sm text-red-600 dark:text-red-400">
                      {formik.errors.firstName}
                    </div>
                  ) : null}
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
                  {formik.touched.lastName && formik.errors.lastName ? (
                    <div className="text-sm text-red-600 dark:text-red-400">
                      {formik.errors.lastName}
                    </div>
                  ) : null}
                </div>
                <div className={styles.emailButton}>
                  <b className={styles.email}>Date of Birth</b>
                  <div className="!h-11 px-[13px] py-[15px] w-full inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                    {/* <input
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
                  <FaRegCalendarAlt className="text-[24px]" /> */}
                    <DatePicker
                      name="dob"
                      id="dob"
                      onChange={(value) => formik.setFieldValue("dob", value)}
                      value={formik.values.dob}
                      inputStyle={customInputStyle}
                      className="w-full h-[44px]"
                      size="default"
                      disabled={!isEditMode}
                    />
                  </div>
                  {formik.touched.dob && !isCancelMode && formik.errors.dob ? (
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
                  {formik.touched.email &&
                  !isCancelMode &&
                  formik.errors.email ? (
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
                  {formik.touched.phoneNumber &&
                  !isCancelMode &&
                  formik.errors.phoneNumber ? (
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
                  <Link href={`/adminPage/user/user-list`}>
                    <p className="text-xl font-bold">Back</p>
                  </Link>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </LocaleProvider>
  );
};

export default withAuth(UserEdit, "admin");
