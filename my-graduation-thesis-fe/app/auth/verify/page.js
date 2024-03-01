"use client";
import styles from "./VerifyScreen.module.css";
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

const Verify = () => {
  const { verify, getVerifyCode } = useAuth();

  const resendCode = async () => {
    await getVerifyCode(formik.values.email);
  };

  const formik = useFormik({
    initialValues: {
      email: Cookies.get("emailRegister"),
      verifyCode: "",
    },
    validationSchema: Yup.object({
      verifyCode: Yup.string().required("Verify Code can't be empty"),
    }),
    onSubmit: async (values) => {
      console.log("Email verify: " + values.email);
      await verify(values);
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
                <b className={styles.email}>Verify Code</b>
                <div className="!h-11 px-[13px] py-[15px] w-full inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                  <input
                    name="verifyCode"
                    id="verifyCode"
                    type="text"
                    placeholder="Verify Code"
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
            </div>
            <div className={styles.button}>
              <button className={styles.children1} type="submit">
                <b className={styles.label2}>Verify</b>
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
const VerifyWithAuthProvider = () => (
  <AuthProvider>
    <Verify />
  </AuthProvider>
);

export default VerifyWithAuthProvider;
