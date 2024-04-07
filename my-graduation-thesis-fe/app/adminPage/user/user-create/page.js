"use client";
import styles from "./UserCreateScreen.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPenSquare } from "react-icons/fa";
import { FaPhone } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Notification, DatePicker } from "@douyinfe/semi-ui";
import { convertDateStringToFormattedDate2 } from "@/libs/commonFunction";
import { LocaleProvider } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { withAuth } from "../../../../context/withAuth";
import Link from "next/link";
import Cookies from "js-cookie";

const UserCreate = () => {
  const [ids, setIds] = useState([]);
  const ref = useRef();
  // Start show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const [showPassword2, setShowPassword2] = useState(false);
  const handleTogglePassword2 = () => {
    setShowPassword2(!showPassword2);
  };
  // End show/hide password

  const customInputStyle = {
    // Specify your desired styles here
    backgroundColor: "transparent",
    marginTop: "5px",
    border: "none",
  };

  // Show notification
  let errorMess = {
    title: "Error",
    content: "Addition of user could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successMess = {
    title: "Success",
    content: "User Added Successfully.",
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

  // function create user
  const createUser = async (credentials) => {
    const bearerToken = Cookies.get("token");
    fetch("https://ersadmin.azurewebsites.net/api/Users/CreateUser", {
      method: "POST",
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
          } else if (data.message == "Account is exist") {
            Notification.error(accountErrorMess);
          } else if (data.message == "Register fail") {
            Notification.error(errorMess);
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors
      });
  };
  // end function create user

  // End show notification
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      dob: "",
      email: "",
      phoneNumber: "",
      userName: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().max(
        200,
        "First Name must not exceed 200 characters"
      ),
      lastName: Yup.string().max(
        200,
        "Last Name must not exceed 200 characters"
      ),
      email: Yup.string().email("Invalid email").required("Email is required"),
      userName: Yup.string().required("Username can't be empty"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must be at most 20 characters")
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).{6,30}$/,
          "Password must include uppercase letters, lowercase letters, numbers, and special characters"
        ),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      let id = Notification.info(loadingMess);
      setIds([...ids, id]);
      values.dob = convertDateStringToFormattedDate2(values.dob);
      createUser(values);
    },
  });
  return (
    <LocaleProvider locale={en_US}>
      <div className="mx-auto w-full mt-3 h-fit mb-3">
        <div className="bg-white h-fit m-auto px-7 py-3 rounded-[4px] border w-fit">
          <h2 className="text-[32px] font-medium mb-3 text-center">
            Add New User
          </h2>
          <form className={styles.form} onSubmit={formik.handleSubmit}>
            <div className="contain grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 m-auto mt-4">
              <div className={styles.details}>
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
                  <div className="!h-11 pl-[1px] pr-[13px] py-[15px] w-full inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                    <DatePicker
                      name="dob"
                      id="dob"
                      selected={
                        (formik.values.dob && new Date(formik.values.dob)) ||
                        null
                      }
                      onChange={(value) => formik.setFieldValue("dob", value)}
                      ref={ref}
                      inputStyle={customInputStyle}
                      className="w-full h-[44px]"
                      size="default"
                    />
                  </div>
                </div>
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
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-sm text-red-600 dark:text-red-400">
                      {formik.errors.email}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className={styles.details}>
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
                    <FaPhone className="text-[24px]" />
                  </div>
                </div>
                <div className={styles.emailButton}>
                  <b className={styles.email}>Username</b>
                  <div className="!h-11 px-[13px] py-[15px] w-full inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                    <input
                      name="userName"
                      id="userName"
                      type="text"
                      placeholder="Username"
                      className="bg-[#FFFFFF] bg-transparent text-sm w-full border-none outline-none"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.userName}
                    />
                    <FaUser className="text-[24px]" />
                  </div>
                  {formik.touched.userName && formik.errors.userName ? (
                    <div className="text-sm text-red-600 dark:text-red-400">
                      {formik.errors.userName}
                    </div>
                  ) : null}
                </div>
                <div className={styles.emailButton}>
                  <div className={styles.emailButton}>
                    <b className={styles.email}>Password</b>
                    <div className="!h-11 px-[13px] py-[15px] w-full inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                      <input
                        name="password"
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="bg-[#FFFFFF] bg-transparent text-sm w-full border-none outline-none"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                      />
                      {showPassword ? (
                        <FaRegEyeSlash
                          onClick={handleTogglePassword}
                          className="text-[24px]"
                        />
                      ) : (
                        <FaRegEye
                          onClick={handleTogglePassword}
                          className="text-[24px]"
                        />
                      )}
                    </div>
                    {formik.touched.password && formik.errors.password ? (
                      <div className="text-sm text-red-600 dark:text-red-400">
                        {formik.errors.password}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className={styles.emailButton}>
                  <div className={styles.emailButton}>
                    <b className={styles.email}>Confirm Password</b>
                    <div className="!h-11 px-[13px] py-[15px] w-full inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                      <input
                        name="confirmPassword"
                        id="confirmPassword"
                        type={showPassword2 ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="bg-[#FFFFFF] bg-transparent text-sm w-full border-none outline-none"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.confirmPassword}
                      />
                      {showPassword2 ? (
                        <FaRegEyeSlash
                          onClick={handleTogglePassword2}
                          className="text-[24px]"
                        />
                      ) : (
                        <FaRegEye
                          onClick={handleTogglePassword2}
                          className="text-[24px]"
                        />
                      )}
                    </div>
                    {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword ? (
                      <div className="text-sm text-red-600 dark:text-red-400">
                        {formik.errors.confirmPassword}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-start gap-4 mt-4 mb-2">
              <button
                className="p-2 rounded-lg w-24 bg-[#74A65D] text-white hover:bg-[#44703D]"
                type="submit"
              >
                <span className="text-xl font-bold">Create</span>
              </button>
              <button className="p-2 rounded-lg w-24 text-[#74A65D] border border-[#74A65D] hover:border-[#44703D] hover:border hover:text-[#44703D]">
                <Link href={`/adminPage/user/user-list`}>
                  <p className="text-xl font-bold">Back</p>
                </Link>
              </button>
            </div>
          </form>
        </div>
      </div>
    </LocaleProvider>
  );
};

export default withAuth(UserCreate, "admin");
