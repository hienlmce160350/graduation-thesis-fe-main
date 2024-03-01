"use client";
import styles from "./UserCreateScreen.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPenSquare } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaPhone } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Notification, DatePicker } from "@douyinfe/semi-ui";
import { convertDateStringToFormattedDate } from "@/libs/commonFunction";
import { LocaleProvider } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import { withAuth } from "../../../../context/withAuth";

const UserCreate = () => {
  const [ids, setIds] = useState([]);
  const ref = useRef();
  // Start show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const [showPassword2, setShowPassword2] = useState(false);
  const [password2, setPassword2] = useState("");
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
    fetch("https://ersadminapi.azurewebsites.net/api/Users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        // Log the response data to the console
        console.log(data);

        // Now you ca    n access specific information, for example:
        console.log("Is Success:", data.isSuccessed);
        console.log("Message:", data.message);
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
      firstName: Yup.string().required("First name can't be empty"),
      lastName: Yup.string().required("Last name can't be empty"),
      dob: Yup.date()
        .max(new Date(), "Date must be not greater than current date")
        .required("Date of birth is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phoneNumber: Yup.string().matches(/^0[1-9]\d{8,10}$/, "Phone is invalid"),
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
      values.dob = convertDateStringToFormattedDate(values.dob);
      createUser(values);
    },
  });
  return (
    <LocaleProvider locale={en_US}>
      <div className="m-auto w-full mb-10">
        <div className={styles.table}>
          <h2 className="text-[32px] font-bold mb-3 text-center">
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
                  {formik.touched.dob && formik.errors.dob ? (
                    <div className="text-sm text-red-600 dark:text-red-400">
                      {formik.errors.dob}
                    </div>
                  ) : null}
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
                  {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                    <div className="text-sm text-red-600 dark:text-red-400">
                      {formik.errors.phoneNumber}
                    </div>
                  ) : null}
                </div>
                <div className={styles.emailButton}>
                  <b className={styles.email}>Username</b>
                  {/* <Input
                  placeholder="username"
                  suffix={<FaUser className="text-[24px]" />}
                  showClear
                  className="px-[13px] py-[15px] !h-11 !rounded-md !border border-[#E0E0E0] bg-[#FFFFFF]"
                ></Input> */}
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
                className="w-[154px] py-4 rounded-[68px] bg-[#4BB543] text-white flex justify-center hover:opacity-80"
                type="submit"
              >
                <span className="text-xl font-bold">Save</span>
              </button>
              <button className="border-solid border border-[#ccc] w-[154px] py-4 rounded-[68px] flex justify-center text-[#ccc] hover:bg-[#ccc] hover:text-white">
                <a
                  className="text-xl font-bold"
                  href="/adminPage/user/user-list"
                >
                  Cancel
                </a>
              </button>
            </div>
          </form>
        </div>
      </div>
    </LocaleProvider>
  );
};

export default withAuth(UserCreate, "admin");
