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
    const emailForgot = Cookies.get("emailForgot");
    await forgot(emailForgot);
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
      verifyCode: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: Yup.object({
      verifyCode: Yup.string().required("Refresh Token can't be empty"),
      newPassword: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must be at most 20 characters")
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).{6,30}$/,
          "Password must include uppercase letters, lowercase letters, numbers, and special characters"
        ),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      const emailForgot = Cookies.get("emailForgot");
      values.email = emailForgot;
      await reset(values);
    },
  });
  return (
    <div className="bg-[url('/staticImage/bg-authen.png')] min-h-[100vh] bg-contain bg-no-repeat flex items-center bg-right">
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
                <b className={styles.email}>Refresh Code</b>
                <div className="!h-11 px-[13px] py-[15px] w-full inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                  <input
                    name="verifyCode"
                    id="verifyCode"
                    type="text"
                    placeholder="Refresh Code"
                    className="bg-[#FFFFFF] bg-transparent text-sm w-full border-none outline-none"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.verifyCode}
                  />
                  <FaUser className="text-[24px]" />
                </div>
                {formik.touched.verifyCode && formik.errors.verifyCode ? (
                  <div className="text-sm text-red-600 dark:text-red-400">
                    {formik.errors.verifyCode}
                  </div>
                ) : null}
              </div>
              <div className={styles.pswd}>
                <div className={styles.emailButton}>
                  <b className={styles.email}>Enter New Password</b>
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
                  <b className={styles.email}>Re-enter New Password</b>
                  <div className="!h-11 px-[13px] py-[15px] w-full inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                    <input
                      name="confirmNewPassword"
                      id="confirmNewPassword"
                      type={showPassword2 ? "text" : "password"}
                      placeholder="Confirm New Password"
                      className="bg-[#FFFFFF] bg-transparent text-sm w-full border-none outline-none"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.confirmNewPassword}
                    />
                    {showPassword2 ? (
                      <FaRegEyeSlash onClick={handleTogglePassword2} />
                    ) : (
                      <FaRegEye onClick={handleTogglePassword2} />
                    )}
                  </div>
                  {formik.touched.confirmNewPassword &&
                  formik.errors.confirmNewPassword ? (
                    <div className="text-sm text-red-600 dark:text-red-400">
                      {formik.errors.confirmNewPassword}
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
