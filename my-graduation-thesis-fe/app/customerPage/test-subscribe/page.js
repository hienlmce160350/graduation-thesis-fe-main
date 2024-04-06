"use client";
import styles from "./LoginScreen.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaUser } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "../../../context/AuthContext";
import Link from "next/link";

const Subscribe = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      content: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Username can't be empty"),
      phone: Yup.string().required("Phone is required"),
      content: Yup.string().required("Content is required"),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("entry.642712337", values.name);
        formData.append("entry.1650562157", values.phone);
        formData.append("entry.1251542735", values.content);

        const response = await fetch(
          `https://docs.google.com/forms/d/e/1FAIpQLSd_IEU8XM_Bq8z9NAAnSpBWEiv8dCyrhHIDJAUatSGcWx2bvQ/formResponse`,
          {
            headers: {},
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          console.log("Send Success");
        } else {
          console.log("Send Fail");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
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
                  src="/staticImage/ERSLogo2.png"
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
                <b className={styles.email}>Name</b>
                <div className="!h-11 px-[13px] py-[15px] w-full inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                  <input
                    name="name"
                    id="name"
                    type="text"
                    placeholder="Name"
                    className="bg-[#FFFFFF] bg-transparent text-sm w-full border-none outline-none"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                  />
                  <FaUser className="text-[24px]" />
                </div>
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-sm text-red-600 dark:text-red-400">
                    {formik.errors.name}
                  </div>
                ) : null}
              </div>
              <div className={styles.emailButton}>
                <b className={styles.email}>Phone</b>
                <div className="!h-11 px-[13px] py-[15px] w-full inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                  <input
                    name="phone"
                    id="phone"
                    type="text"
                    placeholder="Phone"
                    className="bg-[#FFFFFF] bg-transparent text-sm w-full border-none outline-none"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phone}
                  />
                  <FaUser className="text-[24px]" />
                </div>
                {formik.touched.phone && formik.errors.phone ? (
                  <div className="text-sm text-red-600 dark:text-red-400">
                    {formik.errors.phone}
                  </div>
                ) : null}
              </div>

              <div className={styles.emailButton}>
                <b className={styles.email}>Content</b>
                <div className="!h-fit px-[13px] py-[15px] w-full inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                  <textarea
                    name="content"
                    id="content"
                    rows={6}
                    cols={40}
                    placeholder="Content"
                    className="bg-[#FFFFFF] bg-transparent text-sm w-full border-none outline-none"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.content}
                  />
                </div>
                {formik.touched.content && formik.errors.content ? (
                  <div className="text-sm text-red-600 dark:text-red-400">
                    {formik.errors.content}
                  </div>
                ) : null}
              </div>
            </div>
            <div className={styles.button}>
              <button className={styles.children1} type="submit">
                <b className={styles.label2}>Subscribe</b>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
