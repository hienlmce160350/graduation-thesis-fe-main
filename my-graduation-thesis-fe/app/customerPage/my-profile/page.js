"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useFormik } from "formik";
import { Notification } from "@douyinfe/semi-ui";
import { Modal } from "@douyinfe/semi-ui";
import * as Yup from "yup";

const MyProfile = () => {
  const [userData, setUserData] = useState(null);
  const [image, setImage] = useState(null);
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    userName: "",
    phoneNumber: "",
    email: "",
    dob: "",
    avatar: "",
  });
  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };
  const renderProfileFields = () => {
    if (isEditing) {
      return (
        <>
          <input
            className="border px-1"
            type="text"
            value={editFormData.firstName}
            onChange={(e) =>
              setEditFormData((prevFormData) => ({
                ...prevFormData,
                firstName: e.target.value,
              }))
            }
          />
          <input
            className="border px-1"
            type="text"
            value={editFormData.lastName}
            onChange={(e) =>
              setEditFormData((prevFormData) => ({
                ...prevFormData,
                lastName: e.target.value,
              }))
            }
          />
          <input
            className="border px-1"
            type="text"
            value={editFormData.userName}
            onChange={(e) =>
              setEditFormData((prevFormData) => ({
                ...prevFormData,
                userName: e.target.value,
              }))
            }
          />
          <input
            className="border px-1"
            type="tel"
            value={editFormData.phoneNumber}
            onChange={(e) =>
              setEditFormData((prevFormData) => ({
                ...prevFormData,
                phoneNumber: e.target.value,
              }))
            }
          />
          <input
            className="border px-1"
            type="email"
            value={editFormData.email}
            onChange={(e) =>
              setEditFormData((prevFormData) => ({
                ...prevFormData,
                email: e.target.value,
              }))
            }
          />
          <input
            className="border px-1"
            type="date"
            value={editFormData.dob}
            onChange={(e) =>
              setEditFormData((prevFormData) => ({
                ...prevFormData,
                dob: e.target.value,
              }))
            }
          />
        </>
      );
    } else {
      return (
        <>
          <p>{userData.firstName}</p>
          <p>{userData.lastName}</p>
          <p>{userData.userName}</p>
          <p>{userData.phoneNumber}</p>
          <p>{userData.email}</p>
          <p>{userData.dob}</p>
        </>
      );
    }
  };
  const showDialog = () => {
    setVisible(true);
  };
  const handleOk = () => {
    formChangePassword.submitForm();

    setVisible(false);
  };
  const handleCancel = () => {
    setVisible(false);
    formChangePassword.setValues({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };
  const handleSaveProfile = () => {
    // Call the formUpdateProfile.handleSubmit function with editFormData
    formUpdateProfile.handleSubmit({ ...editFormData });
    // Toggle editing state to exit editing mode
    setIsEditing(false);
  };
  const handleCancelEdit = () => {
    // Reset the editFormData to the current user data
    setEditFormData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      userName: userData.userName,
      phoneNumber: userData.phoneNumber,
      email: userData.email,
      dob: userData.dob,
    });
    // Toggle editing state to exit editing mode
    setIsEditing(false);
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        console.log("Image: " + base64String);
        formUpdateAvatar.setFieldValue("avatarImage", base64String);
        setImage(base64String);
      };
      reader.readAsDataURL(selectedFile);
      setIsSaveButtonVisible(true);
    }
  };
  const handleUploadNew = () => {
    document.getElementById("fileInput").click();
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
        console.log("Submitting form with values:", values);
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
          `https://eatright2.azurewebsites.net/api/Users/UpdateUserAvatar/${userId}`,
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
        } else {
          console.log("Failed to update avatar:", response.status);
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
      // Add validation rules if needed
    }),
    onSubmit: async (values) => {
      try {
        console.log("Submitting form with values:", values);
        const bearerToken = Cookies.get("token");
        const userId = Cookies.get("userId");
        values.id = userId;
        values.avatar = "";
        values.firstName = editFormData.firstName;
        values.lastName = editFormData.lastName;
        values.userName = editFormData.userName;
        values.phoneNumber = editFormData.phoneNumber;
        values.dob = editFormData.dob;
        values.email = editFormData.email;
        const response = await fetch(
          `https://eatright2.azurewebsites.net/api/Users/${userId}`,
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
          Notification.success({
            title: "Success",
            content: "Profile Updated Successfully.",
            duration: 3,
            theme: "light",
          });
          getUserById();
          setIsSaveButtonVisible(false);
        } else {
          console.log("Failed to update profile:", response.status);
          Notification.error({
            title: "Error",
            content: "Profile update could not be proceed. Please try again.",
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
      try {
        console.log("Submitting formChangePassword with values:", values);
        const userId = Cookies.get("userId");
        const bearerToken = Cookies.get("token");
        values.oldPassword = formChangePassword.values.oldPassword;
        values.newPassword = formChangePassword.values.newPassword;
        const response = await fetch(
          `https://eatright2.azurewebsites.net/api/Users/UpdatePassword?id=${userId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        if (response.ok) {
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
        } else {
          // Xử lý khi đổi mật khẩu không thành công
          console.log("Failed to update password:", response.status);
          Notification.error({
            title: "Error",
            content: "Password update could not be proceed. Please try again.",
            duration: 3,
            theme: "light",
          });
        }
      } catch (error) {
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
        `https://eatright2.azurewebsites.net/api/Users/${userId}`,
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
      // console.log(data.resultObj);
      setUserData({
        ...data.resultObj,
        dob: formatBirthday(data.resultObj.dob),
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  // Ham format date
  const formatBirthday = (birthday) => {
    const date = new Date(birthday);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
    return formattedDate;
  };
  // ----------------------------------------------------------------
  useEffect(() => {
    getUserById();
  }, []);

  useEffect(() => {
    if (userData) {
      setEditFormData((prevFormData) => ({
        ...prevFormData,
        firstName: userData.firstName,
        lastName: userData.lastName,
        userName: userData.userName,
        phoneNumber: userData.phoneNumber,
        email: userData.email,
        dob: userData.dob,
      }));
    }
  }, [userData]);
  return (
    <>
      {userData && (
        <div className="max-w-7xl mx-auto my-4 px-4 sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 h-auto">
          <div className="shadow-2xl">
            <div className="border-t border-r border-l px-4 py-10">
              <p className="text-2xl font-bold">Customer Profile</p>
            </div>
            <div className="flex border-t border-r border-l ">
              <div className="px-4 py-10 w-3/5">
                <div className="flex">
                  <div className="flex flex-col gap-4 w-1/3 text-gray-400">
                    <p>FirstName</p>
                    <p>LastName</p>
                    <p>UserName</p>
                    <p>Phone</p>
                    <p>Email</p>
                    <p>Birthday</p>
                  </div>
                  <div className="flex gap-4 flex-col ml-10 w-2/3 font-semibold text-gray-700">
                    {renderProfileFields()}
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    className="buttonGradient rounded-md text-gray-500"
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
                        background: "rgb(34, 139, 34)",
                      },
                    }}
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
                        <input
                          type="password"
                          id="oldPassword"
                          name="oldPassword"
                          className=" mt-1 block w-2/3 rounded-sm border h-8 px-2"
                          value={formChangePassword.values.oldPassword}
                          onChange={formChangePassword.handleChange}
                        />
                      </div>
                      {/* Display the error message conditionally */}
                      {formChangePassword.touched.oldPassword &&
                        formChangePassword.errors.oldPassword && (
                          <div className="text-red-500 text-sm">
                            {formChangePassword.errors.oldPassword}
                          </div>
                        )}

                      <div className="mb-4 flex items-center">
                        <label
                          htmlFor="newPassword"
                          className="block text-gray-700 font-semibold w-1/3"
                        >
                          New Password:
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          className=" mt-1 block w-2/3 rounded-sm border h-8 px-2"
                          value={formChangePassword.values.newPassword}
                          onChange={formChangePassword.handleChange}
                        />
                      </div>
                      <div className="mb-4 flex items-center">
                        <label
                          htmlFor="confirmPassword"
                          className="block text-gray-700 font-semibold w-1/3"
                        >
                          Confirm New Password:
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          className={`form-input mt-1 block w-2/3 h-8 rounded-sm border px-2 ${
                            formChangePassword.errors.confirmPassword
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          onChange={formChangePassword.handleChange}
                          onBlur={formChangePassword.handleBlur}
                          value={formChangePassword.values.confirmPassword}
                        />
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

              <div className="px-4 py-10 w-2/5 border-l ">
                <form onSubmit={formUpdateAvatar.handleSubmit}>
                  <div className="flex justify-center items-center flex-col gap-4">
                    <p className="text-gray-400">Profile Image</p>
                    <img
                      className="w-36 h-36 border shadow-xl"
                      src={
                        image ||
                        userData.avatar ||
                        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                      }
                    />
                    <input
                      id="fileInput"
                      type="file"
                      style={{ display: "none" }}
                      onChange={onImageChange}
                      onBlur={formUpdateAvatar.handleBlur}
                    />
                    <button
                      className="buttonGradient rounded-md text-gray-500 w-36"
                      onClick={handleUploadNew}
                      type="button"
                    >
                      Upload New
                    </button>
                    <button
                      className="buttonGradient rounded-md text-gray-500 w-36"
                      type="submit"
                      style={{
                        display: isSaveButtonVisible ? "block" : "none",
                      }}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="flex border items-center ">
              <div className="px-4 py-2 w-3/5">
                <div className="flex">
                  <div className="flex flex-col gap-4 w-1/3 text-gray-400">
                    <p>VIP</p>
                    <p>Accumulated Points</p>
                  </div>
                  <div className="flex gap-4 flex-col ml-10 w-2/3 font-semibold">
                    <p>{userData.vip || "Not yet"}</p>
                    <p>{userData.accumulatedPoints || "Not yet"}</p>
                  </div>
                </div>
              </div>

              <div className=" px-4 py-10 w-2/5 border-l">
                <div className="flex justify-center items-center flex-col gap-4">
                  {isEditing ? (
                    <>
                      <button
                        className="buttonGradient text-white rounded-md w-36 h-12"
                        onClick={handleSaveProfile}
                      >
                        Save
                      </button>
                      <button
                        className="buttonGradient text-white rounded-md w-36 h-12"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="buttonGradient text-white rounded-md w-36 h-12"
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
    </>
  );
};

export default MyProfile;
