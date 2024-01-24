"use client";
import React from "react";
import { Tag } from "@douyinfe/semi-ui";

const MyProfile = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto my-4 px-4 w-1/2 h-auto">
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
                  <p>Phone</p>
                  <p>Email</p>
                  <p>Birthday</p>
                </div>
                <div className="flex gap-4 flex-col ml-10 w-2/3 font-semibold text-gray-700">
                  <p>Dan</p>
                  <p>Hieu Dan</p>
                  <p>0393740519</p>
                  <p>dohieudan@gmail.com</p>
                  <p>10/01/2002</p>
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
                  src="https://i.pinimg.com/736x/0f/4d/a8/0f4da8a2e550bd047de21ab679cfa8fa.jpg"
                />
                <button className="buttonGradient rounded-md text-gray-500 w-36">
                  Upload New
                </button>
              </div>
            </div>
          </div>
          <div className="flex border ">
            <div className="px-4 py-2 w-3/5">
              <div className="flex">
                <div className="flex flex-col gap-4 w-1/3 text-gray-400">
                  <p>VIP</p>
                  <p>Accumulated Points</p>
                </div>
                <div className="flex gap-4 flex-col ml-10 w-2/3 font-semibold">
                  <p>1</p>
                  <p>100</p>
                </div>
              </div>
            </div>

            <div className=" px-4 py-10 w-2/5 border-l">
              <div className="flex justify-center items-center flex-col gap-4">
                <button className="bg-red-400 rounded-md text-black w-36 h-12">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default MyProfile;
