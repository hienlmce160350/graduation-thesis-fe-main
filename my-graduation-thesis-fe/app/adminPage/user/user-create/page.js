"use client";
import styles from "./UserCreateScreen.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPenSquare } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Notification } from "@douyinfe/semi-ui";

export default function UserCreate() {
  const [ids, setIds] = useState([]);
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
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).{8,30}$/,
          "Password must include uppercase letters, lowercase letters, numbers, and special characters"
        ),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      try {
        let id = Notification.info(loadingMess);
        setIds([...ids, id]);
        const response = await fetch(
          `https://ersadminapi.azurewebsites.net/api/Users`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );
        // let account = {
        //   userName: values.userName,
        //   password: values.password,
        // };

        if (response.ok) {
          let idsTmp = [...ids];
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          const data = await response.json();
          console.log("Register successful. Response:", data);
          Notification.success(successMess);
          // console.log("Account: " + JSON.stringify(account));
          // const responseLogin = await fetch(
          //   `https://ersadminapi.azurewebsites.net/api/Users/authenticate`,
          //   {
          //     method: "POST",
          //     headers: {
          //       "Content-Type": "application/json",
          //     },
          //     body: JSON.stringify(account),
          //   }
          // );
          // const dataLogin = await responseLogin.json();
          // let userId = dataLogin.id;
          // let token = dataLogin.resultObj;

          // Cookies.set("userId", userId, { expires: 1 });
          // Cookies.set("token", token, { expires: 1 });
          router.push("/adminPage/user/user-list");
        } else {
          let idsTmp = [...ids];
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          console.log("An error occurred:", response.status);
          Notification.error(errorMess);
        }
      } catch (error) {
        Notification.error(errorMess);
        console.error("An error occurred:", error);
      }
    },
  });
  return (
    <div className="ml-[12px] w-[82%] mt-[104px] mb-10">
      <div className={styles.table}>
        <h2 className="text-[32px] font-bold mb-3 text-center">Add New User</h2>
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <div className="contain grid grid-cols-2 gap-20 m-auto mt-4">
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
                {/* <Input
                  placeholder="abc"
                  suffix={<FaPenSquare className="text-[24px]" />}
                  showClear
                  className="px-[13px] py-[15px] !h-11 !rounded-md !border border-[#E0E0E0] bg-[#FFFFFF]"
                ></Input> */}
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
                {/* <Input
                  placeholder="yyyy-mm-dd"
                  suffix={<FaRegCalendarAlt className="text-[24px]" />}
                  showClear
                  className="px-[13px] py-[15px] !h-11 !rounded-md !border border-[#E0E0E0] bg-[#FFFFFF]"
                ></Input> */}
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
                {formik.touched.dob && formik.errors.dob ? (
                  <div className="text-sm text-red-600 dark:text-red-400">
                    {formik.errors.dob}
                  </div>
                ) : null}
              </div>
              <div className={styles.emailButton}>
                <b className={styles.email}>Email</b>
                {/* <Input
                  placeholder="name@gmail.com"
                  suffix={<MdEmail className="text-[24px]" />}
                  showClear
                  className="px-[13px] py-[15px] !h-11 !rounded-md !border border-[#E0E0E0] bg-[#FFFFFF]"
                ></Input> */}
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
                {/* <Input
                  placeholder="0900******"
                  suffix={<MdEmail className="text-[24px]" />}
                  showClear
                  className="px-[13px] py-[15px] !h-11 !rounded-md !border border-[#E0E0E0] bg-[#FFFFFF]"
                ></Input> */}
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
              <div className={styles.pswd}>
                <div className={styles.emailButton}>
                  <b className={styles.email}>Password</b>
                  {/* <Input
                    mode="password"
                    defaultValue="123456"
                    className="px-[13px] py-[15px] !h-11 !rounded-md !border border-[#E0E0E0] bg-[#FFFFFF]"
                  ></Input> */}
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
              <div className={styles.pswd}>
                <div className={styles.emailButton}>
                  <b className={styles.email}>Confirm Password</b>
                  {/* <Input
                    mode="password"
                    defaultValue="123456"
                    className="px-[13px] py-[15px] !h-11 !rounded-md !border border-[#E0E0E0] bg-[#FFFFFF]"
                  ></Input> */}
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
              <a className="text-xl font-bold" href="/adminPage/user/user-list">
                Cancel
              </a>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
