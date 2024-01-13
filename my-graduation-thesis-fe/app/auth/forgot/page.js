"use client";
import styles from "./ForgotScreen.module.css";
import { Checkbox } from "@douyinfe/semi-ui";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import * as Yup from "yup";
import { FaRegEye, FaRegEyeSlash, FaUser } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { Notification } from "@douyinfe/semi-ui";
import { MdEmail } from "react-icons/md";

import { AuthProvider, useAuth } from "../../../context/AuthContext";

const Forgot = () => {
  const { forgot } = useAuth();

  // Start show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  // End show/hide password
  // Show notification
  let errorMess = {
    title: "Error",
    content: "Login could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successMess = {
    title: "Success",
    content: "Login Successfully.",
    duration: 3,
    theme: "light",
  };
  // End show notification

  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Email can't be empty"),
    }),
    onSubmit: async (values) => {
      await forgot(values);
    },
  });
  return (
    <div className={styles.main}>
      <div className={styles.login}>
        <div className={styles.component66}>
          <div className={styles.logo}>
            <div className={styles.logo1}>
              <img
                className={styles.image2Icon}
                alt=""
                src="/staticImage/logoShop.png"
              />
            </div>
          </div>
          <div className={styles.header}>
            <b className={styles.title}>EatRightify System</b>
            <div className={styles.text}>Welcome</div>
          </div>
        </div>

        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <div className={styles.details}>
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
          <div className={styles.button}>
            <button className={styles.children1} type="submit">
              <b className={styles.label2}>Confirm</b>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Wrap your Login component with AuthProvider
const ForgotWithAuthProvider = () => (
  <AuthProvider>
    <Forgot />
  </AuthProvider>
);

export default ForgotWithAuthProvider;
