"use client";
import styles from "./ResetScreen.module.css";
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

const Reset = () => {
  const { reset, forgot } = useAuth();

  const resendCode = async () => {
    const { email } = formik.values;
    await forgot(email);
  };

  // Start show/hide password
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const [showPassword2, setShowPassword2] = useState(false);
  const [password2, setPassword2] = useState("");
  const handleTogglePassword2 = () => {
    setShowPassword2(!showPassword2);
  };
  // End show/hide password

  const formik = useFormik({
    initialValues: {
      email: "",
      token: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      token: Yup.string().required("Token can't be empty"),
      newPassword: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must be at most 20 characters")
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).{8,30}$/,
          "Password must include uppercase letters, lowercase letters, numbers, and special characters"
        ),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      await reset(values);
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
            <div className={styles.emailButton}>
              <b className={styles.email}>Token</b>
              <div className="!h-11 px-[13px] py-[15px] w-full inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                <input
                  name="token"
                  id="token"
                  type="text"
                  placeholder="Token"
                  className="bg-[#FFFFFF] bg-transparent text-sm w-full border-none outline-none"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.token}
                />
                <FaUser className="text-[24px]" />
              </div>
              {formik.touched.token && formik.errors.token ? (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {formik.errors.token}
                </div>
              ) : null}
            </div>
            <div className={styles.pswd}>
              <div className={styles.emailButton}>
                <b className={styles.email}>Password</b>
                <div className="!h-11 px-[13px] py-[15px] w-full inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                  <input
                    name="newPassword"
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    className="bg-[#FFFFFF] bg-transparent text-sm w-full border-none outline-none"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.newPassword}
                  />
                  {showPassword ? (
                    <FaRegEyeSlash onClick={handleTogglePassword} />
                  ) : (
                    <FaRegEye onClick={handleTogglePassword} />
                  )}
                </div>
                {formik.touched.newPassword && formik.errors.newPassword ? (
                  <div className="text-sm text-red-600 dark:text-red-400">
                    {formik.errors.newPassword}
                  </div>
                ) : null}
              </div>
            </div>
            <div className={styles.pswd}>
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
                    <FaRegEyeSlash onClick={handleTogglePassword2} />
                  ) : (
                    <FaRegEye onClick={handleTogglePassword2} />
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
          <div className={styles.button}>
            <button className={styles.children1} type="submit">
              <b className={styles.label2}>Reset</b>
            </button>
          </div>
          <div className="text-sm w-full flex justify-center mt-4">
            Didn't receive a code? &nbsp;
            <a
              href="#"
              className="font-bold hover:opacity-80"
              onClick={resendCode}
            >
              Resend
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

// Wrap your Login component with AuthProvider
const ResetWithAuthProvider = () => (
  <AuthProvider>
    <Reset />
  </AuthProvider>
);

export default ResetWithAuthProvider;
