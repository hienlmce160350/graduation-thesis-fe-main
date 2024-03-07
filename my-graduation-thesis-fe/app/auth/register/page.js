"use client";
import styles from "./RegisterScreen.module.css";
import { Input, DatePicker } from "@douyinfe/semi-ui";
import { MdEmail } from "react-icons/md";
import { FaPenSquare } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaPhone } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState, useRef } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { AuthProvider, useAuth } from "../../../context/AuthContext";
import { LocaleProvider } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";

const Register = () => {
  const { register } = useAuth();
  const ref = useRef();
  const customInputStyle = {
    // Specify your desired styles here
    backgroundColor: "transparent",
    marginBottom: "8px",
    border: "none",
  };

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

  const formik = useFormik({
    initialValues: {
      email: "",
      userName: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
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
      await register(values);
    },
  });
  return (
    <>
      <LocaleProvider locale={en_US}>
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
                      <b className={styles.email}>Email</b>
                      <div className="!h-11 px-[13px] py-[15px] w-full inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                        <input
                          name="email"
                          id="email"
                          type="text"
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
                    <div className={styles.pswd}>
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
                            <FaRegEyeSlash onClick={handleTogglePassword} />
                          ) : (
                            <FaRegEye onClick={handleTogglePassword} />
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
                    <b className={styles.label2}>Register</b>
                  </button>
                </div>
                <div className="text-sm w-full flex justify-center mt-4">
                  Already have an account? &nbsp;
                  <a href="/auth/login" className="font-bold hover:opacity-80">
                    Log in
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </LocaleProvider>
    </>
  );
};

// Wrap your Login component with AuthProvider
const RegisterWithAuthProvider = () => (
  <AuthProvider>
    <Register />
  </AuthProvider>
);

export default RegisterWithAuthProvider;
