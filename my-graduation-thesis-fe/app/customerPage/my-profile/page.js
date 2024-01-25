"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
const MyProfile = () => {
  const [userData, setUserData] = useState(null);

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
  const formatBirthday = (birthday) => {
    const date = new Date(birthday);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
    return formattedDate;
  };

  useEffect(() => {
    getUserById();
    formatBirthday();
  }, []);
  return (
    <>
      {userData && (
        <div className="max-w-7xl mx-auto my-4 px-4 w-1/2 h-auto">
          <div className="shadow-2xl">
            <div className="border-t border-r border-l px-4 py-10">
              <p className="text-2xl font-bold">Customer Profile</p>
            </div>
            <div className="flex border-t border-r border-l ">
              <div className="px-4 py-10 w-3/5">
                <div className="flex">
                  <div className="flex flex-col gap-4 w-1/3 text-gray-400">
                    <p>FullName</p>
                    <p>UserName</p>
                    <p>Phone</p>
                    <p>Email</p>
                    <p>Birthday</p>
                  </div>
                  <div className="flex gap-4 flex-col ml-10 w-2/3 font-semibold text-gray-700">
                    <p>
                      {userData.firstName} {userData.lastName}
                    </p>
                    <p>{userData.userName}</p>
                    <p>{userData.phoneNumber}</p>
                    <p>{userData.email}</p>
                    <p>{userData.dob}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="buttonGradient rounded-md text-gray-500">
                    Change Password
                  </button>
                </div>
              </div>

              <div className=" px-4 py-10 w-2/5 border-l ">
                <div className="flex justify-center items-center flex-col gap-4">
                  <p className="text-gray-400">Profile Image</p>
                  <img
                    className="w-36 h-36 border shadow-xl"
                    src={
                      userData.avatar ||
                      "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                    }
                  />
                  <button className="buttonGradient rounded-md text-gray-500 w-36">
                    Upload New
                  </button>
                </div>
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
                  <button className="bg-red-200 text-white rounded-md w-36 h-12">
                    Edit Profile
                  </button>
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
