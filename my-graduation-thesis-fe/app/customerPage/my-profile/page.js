"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useFormik } from "formik";
import { Notification } from "@douyinfe/semi-ui";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Modal } from "@douyinfe/semi-ui";
import * as Yup from "yup";
import Link from "next/link";
import { Breadcrumb } from "@douyinfe/semi-ui";
import { IconHome, IconUser } from "@douyinfe/semi-icons";
import { convertDateStringToFormattedDate } from "@/libs/commonFunction";
import { withAuth } from "../../../context/withAuth";
import { useAuth } from "../../../context/AuthContext";
import { formatCurrency } from "@/libs/commonFunction";

const MyProfile = () => {
  const [userData, setUserData] = useState(null);
  const [image, setImage] = useState(null);
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isCancelAvtVisible, setIsCancelAvtVisible] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const handleToggleOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };
  const handleToggleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };
  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const handleLogout = async () => {
    await logout();
  };

  const renderProfileFields = () => {
    if (isEditing) {
      return (
        <>
          <div className="flex flex-col gap-8">
            <div className="flex h-6 items-center">
              <label className="text-black font-light w-40" for="firstName">
                First Name
              </label>
              <div className="w-full ml-14">
                <input
                  name="firstName"
                  id="firstName"
                  className="border px-1 py-1 w-full rounded-md bg-gray-100"
                  type="text"
                  value={formUpdateProfile.values.firstName}
                  onChange={formUpdateProfile.handleChange}
                  onBlur={formUpdateProfile.handleBlur}
                />
                {formUpdateProfile.touched.firstName &&
                  formUpdateProfile.errors.firstName && (
                    <div className="text-red-500 text-sm">
                      {formUpdateProfile.errors.firstName}
                    </div>
                  )}
              </div>
            </div>

            <div className="flex h-6 items-center">
              <label className="text-black font-light w-40" for="lastName">
                Last Name
              </label>
              <div className=" w-full ml-14">
                <input
                  name="lastName"
                  id="lastName"
                  className="border px-1 py-1 w-full rounded-md bg-gray-100"
                  type="text"
                  value={formUpdateProfile.values.lastName}
                  onChange={formUpdateProfile.handleChange}
                  onBlur={formUpdateProfile.handleBlur}
                />
                {formUpdateProfile.touched.lastName &&
                  formUpdateProfile.errors.lastName && (
                    <div className="text-red-500 text-sm">
                      {formUpdateProfile.errors.lastName}
                    </div>
                  )}
              </div>
            </div>

            <div className="flex h-6 items-center">
              <label className="text-black font-light w-40" for="phoneNumber">
                Phone{" "}
              </label>
              <div className="w-full ml-14">
                <input
                  name="phoneNumber"
                  id="phoneNumber"
                  className="border px-1 py-1 w-full rounded-md bg-gray-100"
                  type="tel"
                  value={formUpdateProfile.values.phoneNumber}
                  onChange={formUpdateProfile.handleChange}
                  onBlur={formUpdateProfile.handleBlur}
                />
                {formUpdateProfile.touched.phoneNumber &&
                  formUpdateProfile.errors.phoneNumber && (
                    <div className="text-red-500 text-sm">
                      {formUpdateProfile.errors.phoneNumber}
                    </div>
                  )}
              </div>
            </div>

            <div className="flex h-6 items-center">
              <label className="text-black font-light w-40" for="email">
                Email{" "}
              </label>
              <div className="w-full ml-14">
                <input
                  name="email"
                  id="email"
                  className="border px-1 py-1 w-full rounded-md bg-gray-100"
                  type="email"
                  value={formUpdateProfile.values.email}
                  onChange={formUpdateProfile.handleChange}
                  onBlur={formUpdateProfile.handleBlur}
                />
                {formUpdateProfile.touched.email &&
                  formUpdateProfile.errors.email && (
                    <div className="text-red-500 text-sm">
                      {formUpdateProfile.errors.email}
                    </div>
                  )}
              </div>
            </div>

            <div className="flex w-full h-6 items-center">
              <label className="text-black font-light w-40" for="dob">
                Birthday
              </label>
              <div className="w-full ml-14">
                <input
                  name="dob"
                  id="dob"
                  className="border px-1 py-1 w-full rounded-md bg-gray-100"
                  type="date"
                  value={formUpdateProfile.values.dob}
                  onChange={formUpdateProfile.handleChange}
                  onBlur={formUpdateProfile.handleBlur}
                />
                {formUpdateProfile.touched.dob &&
                  formUpdateProfile.errors.dob && (
                    <div className="text-red-500 text-sm">
                      {formUpdateProfile.errors.dob}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="flex flex-col gap-8">
            <div className="flex h-6 items-center">
              <label className="text-black font-light w-40" for="firstName">
                First Name
              </label>
              <div className="w-full ml-14 px-1">
                <p>{userData.firstName}</p>
              </div>
            </div>

            <div className="flex h-6 items-center">
              <label className="text-black font-light w-40" for="lastName">
                Last Name
              </label>
              <div className=" w-full ml-14 px-1">
                <p>{userData.lastName}</p>
              </div>
            </div>

            <div className="flex h-6 items-center">
              <label className="text-black font-light w-40" for="phoneNumber">
                Phone
              </label>
              <div className="w-full ml-14 px-1">
                <p>{userData.phoneNumber}</p>
              </div>
            </div>

            <div className="flex h-6 items-center">
              <label className="text-black font-light w-40" for="email">
                Email{" "}
              </label>
              <div className="w-full ml-14 px-1">
                <p>{userData.email}</p>
              </div>
            </div>

            <div className="flex w-full h-6 items-center">
              <label className="text-black font-light w-40" for="dob">
                Birthday
              </label>
              <div className="w-full ml-14 px-1">
                <p>{userData.dob}</p>
              </div>
            </div>
          </div>
        </>
      );
    }
  };
  //Dialog Change Password
  const showDialog = () => {
    setVisible(true);
  };
  const handleOk = () => {
    formChangePassword.submitForm();
  };
  const handleCancel = () => {
    setVisible(false);
    formChangePassword.setValues({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };
  //End of dialog handle
  const handleSaveProfile = () => {
    // Call the formUpdateProfile.handleSubmit function with editFormData
    formUpdateProfile.handleSubmit();
  };
  const handleCancelEdit = () => {
    // Toggle editing state to exit editing mode
    setIsEditing(false);
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        formUpdateAvatar.setFieldValue("avatarImage", base64String);
        setImage(base64String);
      };
      reader.readAsDataURL(selectedFile);
      setIsSaveButtonVisible(true);
    }
    setIsCancelAvtVisible(true);
  };
  const handleUploadNew = () => {
    document.getElementById("fileInput").click();
  };
  const handleCancelAvt = () => {
    setIsCancelAvtVisible(false);
    setIsSaveButtonVisible(false);
    // Reset the value in the formUpdateAvatar to the previous avatar image
    formUpdateAvatar.setFieldValue("avatarImage", userData.avatarImage);
    // Clear the file input value
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = null;
    }
  };
  // end handle image
  // Show notification
  let errorMess = {
    title: "Error",
    content: "Profile editing could not be proceed. Please try again.",
    duration: 3,
    theme: "light",
  };

  let successMess = {
    title: "Success",
    content: "Profile Edited Successfully.",
    duration: 3,
    theme: "light",
  };
  // End show notification
  //UPDATE AVT FORM
  const formUpdateAvatar = useFormik({
    initialValues: {
      avatarImage: "",
      userId: "",
    },
    validationSchema: Yup.object({
      // Bạn có thể thêm quy tắc kiểm tra nếu cần
    }),
    onSubmit: async (values) => {
      try {
        const bearerToken = Cookies.get("token");
        const userId = Cookies.get("userId");
        if (image !== null) {
          const prefix = "data:image/jpeg;base64,";
          let imageBase64 = image.substring(prefix.length);
          values.avatarImage = imageBase64;
          const userId = Cookies.get("userId");
          values.userId = userId;
        } else {
          values.avatarImage = userData.avatarImage;
        }

        const response = await fetch(
          `https://erscus.azurewebsites.net/api/Users/UpdateUserAvatar/${userId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        if (response.ok) {
          Notification.success(successMess);
          getUserById();
          // Refresh user data or perform other actions on success
          setIsSaveButtonVisible(false);
          setIsCancelAvtVisible(false);
        } else {
          console.log("Failed to update avatar:", response.message);
          Notification.error(errorMess);
        }
      } catch (error) {
        console.error("An error occurred:", error);
        Notification.error(errorMess);
      }
    },
  });
  // UPDATE INFOR FORM
  const formUpdateProfile = useFormik({
    initialValues: {
      id: "",
      firstName: "",
      lastName: "",
      dob: "",
      email: "",
      phoneNumber: "",
      avatar: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().max(
        200,
        "First name must not exceed 200 characters"
      ),
      lastName: Yup.string().max(
        200,
        "Last name must not exceed 200 characters"
      ),
      phoneNumber: Yup.string().matches(/^0[1-9]\d{8,10}$/, "Phone is invalid"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      dob: Yup.date()
        .max(new Date(), "Date must be not greater than current date")
        .required("Date of birth is required"),
    }),
    onSubmit: async (values) => {
      try {
        const bearerToken = Cookies.get("token");
        const userId = Cookies.get("userId");
        values.id = userId;
        const response = await fetch(
          `https://erscus.azurewebsites.net/api/Users/${userId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );
        const responseData = await response.json();

        if (response.ok) {
          Notification.success({
            title: "Success",
            content: "Profile Updated Successfully.",
            duration: 3,
            theme: "light",
          });
          getUserById();
          setIsSaveButtonVisible(false);
          // Toggle editing state to exit editing mode
          setIsEditing(false);
        } else {
          // Xử lý khi đổi mật khẩu không thành công
          console.log("Failed to update profile:", responseData.message);
          Notification.error({
            title: "Error",
            content:
              responseData.message ||
              "Profile update could not be proceed. Please try again.",
            duration: 3,
            theme: "light",
          });
        }
      } catch (error) {
        console.error("An error occurred:", error);
        Notification.error({
          title: "Error",
          content: "An error occurred. Please try again.",
          duration: 3,
          theme: "light",
        });
      }
    },
  });
  //CHANGE PASSWORD FORM
  const formChangePassword = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string()
        .required("Old Password is required")
        .min(6, "Old Password must be at least 6 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
          "Old Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
      newPassword: Yup.string()
        .required("New Password is required")
        .min(6, "New Password must be at least 6 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
          "New Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
      confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const userId = Cookies.get("userId");
        const bearerToken = Cookies.get("token");
        values.oldPassword = formChangePassword.values.oldPassword;
        values.newPassword = formChangePassword.values.newPassword;
        const response = await fetch(
          `https://erscus.azurewebsites.net/api/Users/UpdatePassword?id=${userId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        const responseData = await response.json(); // Parse response body as JSON

        if (response.ok) {
          setLoading(false);
          // Đổi mật khẩu thành công, thực hiện các hành động khác nếu cần
          Notification.success({
            title: "Success",
            content: "Password Updated Successfully.",
            duration: 3,
            theme: "light",
          });
          formChangePassword.setValues({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setVisible(false);
        } else {
          setLoading(false);
          // Xử lý khi đổi mật khẩu không thành công
          console.log("Failed to update password:", responseData.message);
          Notification.error({
            title: "Error",
            content:
              responseData.message ||
              "Password update could not be proceed. Please try again.",
            duration: 3,
            theme: "light",
          });
        }
      } catch (error) {
        setLoading(false);
        // Xử lý lỗi khi thực hiện request
        console.error("An error occurred:", error);
        Notification.error({
          title: "Error",
          content: "An error occurred. Please try again.",
          duration: 3,
          theme: "light",
        });
      }
    },
  });

  // Ham lay du lieu theo UserId
  const getUserById = async () => {
    const userId = Cookies.get("userId");
    const bearerToken = Cookies.get("token");
    try {
      const response = await fetch(
        `https://erscus.azurewebsites.net/api/Users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            Method: "GET",
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setUserData({
        ...data.resultObj,
        dob: convertDateStringToFormattedDate(data.resultObj.dob),
      });
      formUpdateProfile.setFieldValue("firstName", data.resultObj.firstName);
      formUpdateProfile.setFieldValue("lastName", data.resultObj.lastName);
      formUpdateProfile.setFieldValue(
        "phoneNumber",
        data.resultObj.phoneNumber
      );
      formUpdateProfile.setFieldValue("email", data.resultObj.email);
      formUpdateProfile.setFieldValue(
        "dob",
        formatBirthday(data.resultObj.dob)
      );
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  // Ham format date
  const formatBirthday = (birthday) => {
    const date = new Date(birthday);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    return formattedDate;
  };
  // ----------------------------------------------------------------
  useEffect(() => {
    getUserById();
  }, []);

  return (
    <>
      <div className="">
        <div className="max-w-7xl mx-auto my-4 px-4">
          <div className="p-[7px] bg-[#eee]">
            <Breadcrumb compact={false}>
              <Breadcrumb.Item icon={<IconHome />}>
                <Link href="/customerPage/home">Home</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item icon={<IconUser />} noLink={true}>
                My Profile
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        {userData && (
          <div className="max-w-7xl mx-auto my-4 px-4 sm:w-full md:w-full lg:w-full h-auto flex flex-col lg:flex-row gap-4 justify-center">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="bg-[#CCE1D2] h-20 flex items-center py-2 px-4 rounded-md">
                <div>
                  <img
                    className="w-12 h-12 rounded-full border-2 border-green-500"
                    src={
                      userData.avatar ||
                      "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
                    }
                  />
                </div>
                <div className="flex flex-col ml-3">
                  <p className="font-semibold">
                    {userData.firstName} {userData.lastName}
                  </p>
                  <div className="flex flex-row">
                    <p className="text-gray-400 mr-1">VIP</p>
                    <div className="bg-white text-green-600 px-2 rounded-xl">
                      {userData.vip}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#CCE1C233] h-auto mt-1 rounded-md">
                <div className="flex flex-col justify-center">
                  <div className="flex flex-col px-4 py-2 border-b border-gray-200 gap-2">
                    <Link
                      className="font-semibold hover:text-gray-500"
                      href={"/customerPage/order-history/order-list"}
                    >
                      My Order
                    </Link>
                    <Link
                      className="font-semibold hover:text-gray-500"
                      href={"/"}
                    >
                      Setting
                    </Link>
                  </div>

                  <Link
                    className="px-4 py-2 hover:text-gray-500"
                    href="/auth/login"
                    onClick={handleLogout}
                  >
                    Logout
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-full md:w-full lg:w-3/4 shadow-md rounded-md">
              <div className="border-t border-r border-l px-8 py-7 rounded-t-md">
                <p className="text-2xl font-bold">Customer Profile</p>
              </div>
              <div className="flex border-t border-r border-l flex-col-reverse md:flex-row justify-center items-center">
                <div className="px-4 py-5 w-4/5">
                  <div className="flex">
                    <div className=" flex-col w-full font-semibold text-gray-700">
                      {renderProfileFields()}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center md:justify-start">
                    <button
                      className="font-medium rounded-sm bg-[#74A65D] text-white hover:bg-[#44703D] p-2"
                      onClick={showDialog}
                      type="button"
                    >
                      Change Password
                    </button>
                    <Modal
                      title={
                        <div className="text-center w-full text-gray-400">
                          Change Password
                        </div>
                      }
                      visible={visible}
                      onOk={handleOk}
                      onCancel={handleCancel}
                      okText={"Submit"}
                      cancelText={"Cancel"}
                      okButtonProps={{
                        style: {
                          background: "#74a65d",
                        },
                      }}
                      confirmLoading={loading}
                    >
                      <form
                        onSubmit={formChangePassword.handleSubmit}
                        className=""
                      >
                        <div className="mb-4 flex items-center">
                          <label
                            htmlFor="oldPassword"
                            className="block text-gray-700 font-semibold w-1/3"
                          >
                            Old Password:
                          </label>
                          <div className="!h-11 px-[13px] py-[15px] w-full inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                            <input
                              type={showOldPassword ? "text" : "password"}
                              id="oldPassword"
                              name="oldPassword"
                              className=" bg-[#FFFFFF] bg-transparent text-sm w-full border-none outline-none"
                              value={formChangePassword.values.oldPassword}
                              onChange={formChangePassword.handleChange}
                              onBlur={formChangePassword.handleBlur}
                            />
                            {showOldPassword ? (
                              <FaRegEyeSlash
                                onClick={handleToggleOldPassword}
                              />
                            ) : (
                              <FaRegEye onClick={handleToggleOldPassword} />
                            )}
                          </div>
                        </div>
                        <div className="mb-4 flex items-center">
                          <label
                            htmlFor="newPassword"
                            className="block text-gray-700 font-semibold w-1/3"
                          >
                            New Password:
                          </label>
                          <div className="!h-11 px-[13px] py-[15px] w-full inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              id="newPassword"
                              name="newPassword"
                              className="bg-[#FFFFFF] bg-transparent text-sm w-full border-none outline-none"
                              value={formChangePassword.values.newPassword}
                              onBlur={formChangePassword.handleBlur}
                              onChange={formChangePassword.handleChange}
                            />
                            {showNewPassword ? (
                              <FaRegEyeSlash
                                onClick={handleToggleNewPassword}
                              />
                            ) : (
                              <FaRegEye onClick={handleToggleNewPassword} />
                            )}
                          </div>
                        </div>
                        <div className="mb-4 flex items-center">
                          <label
                            htmlFor="confirmPassword"
                            className="block text-gray-700 font-semibold w-1/3"
                          >
                            Confirm New Password:
                          </label>
                          <div className="!h-11 px-[13px] py-[15px] w-full inline-flex items-center shadow-none border-solid border-1 border-transparent bg-brand-primary rounded-md border border-[#E0E0E0] bg-[#FFFFFF]">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              id="confirmPassword"
                              name="confirmPassword"
                              className=" bg-[#FFFFFF] bg-transparent text-sm w-full border-none outline-none"
                              onChange={formChangePassword.handleChange}
                              onBlur={formChangePassword.handleBlur}
                              value={formChangePassword.values.confirmPassword}
                            />
                            {showConfirmPassword ? (
                              <FaRegEyeSlash
                                onClick={handleToggleConfirmPassword}
                              />
                            ) : (
                              <FaRegEye onClick={handleToggleConfirmPassword} />
                            )}
                          </div>
                        </div>
                      </form>

                      {/* Display the error message conditionally */}
                      {formChangePassword.touched.oldPassword &&
                        formChangePassword.errors.oldPassword && (
                          <div className="text-red-500 text-sm">
                            {formChangePassword.errors.oldPassword}
                          </div>
                        )}
                      {formChangePassword.touched.newPassword &&
                        formChangePassword.errors.newPassword && (
                          <div className="text-red-500 text-sm">
                            {formChangePassword.errors.newPassword}
                          </div>
                        )}
                      {formChangePassword.touched.confirmPassword &&
                        formChangePassword.errors.confirmPassword && (
                          <div className="text-red-500 text-sm">
                            {formChangePassword.errors.confirmPassword}
                          </div>
                        )}
                    </Modal>
                  </div>
                </div>

                <div className="px-4 py-5 w-full md:w-2/5 border-b border-l md:border-b-0">
                  <form onSubmit={formUpdateAvatar.handleSubmit}>
                    <div className="flex justify-center w-full">
                      <div className="flex justify-center items-center flex-col gap-4">
                        <p className="text-gray-400">Profile Image</p>
                        {isCancelAvtVisible === true ? (
                          <img
                            className="w-36 h-36 border shadow-xl"
                            src={image || userData.avatar}
                          />
                        ) : (
                          <img
                            className="w-36 h-36 border shadow-xl"
                            src={
                              userData.avatar ||
                              "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
                            }
                          />
                        )}

                        <input
                          id="fileInput"
                          type="file"
                          accept="image/jpeg"
                          style={{ display: "none" }}
                          onChange={onImageChange}
                          onBlur={formUpdateAvatar.handleBlur}
                        />
                        <button
                          className="font-medium rounded-sm bg-[#8ABD7B] text-white hover:bg-white hover:text-[#8ABD7B] border border-white hover:border-[#8ABD7B] w-36 py-2"
                          onClick={handleUploadNew}
                          type="button"
                        >
                          Upload New
                        </button>
                        <button
                          className="font-medium rounded-sm bg-[#74A65D] text-white hover:bg-[#44703D] w-36 p-2"
                          type="submit"
                          style={{
                            display: isSaveButtonVisible ? "block" : "none",
                          }}
                        >
                          Save
                        </button>
                        {isCancelAvtVisible && (
                          <button
                            className="font-medium rounded-sm text-[#74A65D] border border-[#74A65D] hover:border-[#44703D] hover:border hover:text-[#44703D] w-36 p-2"
                            type="button"
                            onClick={handleCancelAvt}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="flex border rounded-b-md">
                <div className="px-4 py-7 w-4/5">
                  <div className="flex">
                    <div className="flex gap-4 w-1/3 text-gray-400">
                      <p>Accumulated Points</p>
                    </div>
                    <div className="flex gap-4 flex-col ml-10 w-2/3 font-semibold">
                      <p>{formatCurrency(userData.accumulatedPoints)}</p>
                    </div>
                  </div>
                </div>

                <div className=" px-4 py-5 w-2/5">
                  <div className="flex justify-center items-center flex-col gap-4">
                    {isEditing ? (
                      <>
                        <button
                          className=" bg-[#74A65D] text-white hover:bg-[#44703D] rounded-sm w-36 h-12"
                          onClick={handleSaveProfile}
                        >
                          Save
                        </button>
                        <button
                          className="rounded-sm text-[#74A65D] border border-[#74A65D] hover:border-[#44703D] hover:border hover:text-[#44703D] w-36 p-2"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className=" bg-[#74A65D] text-white hover:bg-[#44703D] rounded-sm w-36 h-12"
                        onClick={handleEditProfile}
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default withAuth(MyProfile, "");
