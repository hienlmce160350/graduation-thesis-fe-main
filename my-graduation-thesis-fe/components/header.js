"use client";
import { Dropdown } from "@douyinfe/semi-ui";
import { TbLogout2 } from "react-icons/tb";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import Link from "next/link";

const HeadComponent = () => {
  return (
    <>
      <div className="h-[104px] w-full bg-slate-950">
        <div className="w-10 bg-white">
          <Dropdown
            trigger={"click"}
            position={"right"}
            render={
              <Dropdown.Menu>
                <Link href={`/adminPage/user/user-edit`}>
                  <Dropdown.Item>
                    <IoIosArrowUp className="pr-2 text-2xl" />
                    Edit User
                  </Dropdown.Item>
                </Link>

                <Link href={"/auth/login"}>
                  <Dropdown.Item>
                    <TbLogout2 className="text-2xl text-red-600" />
                    Logout
                  </Dropdown.Item>
                </Link>
              </Dropdown.Menu>
            }
          >
            <IoIosArrowDown className="cursor-pointer" />
          </Dropdown>
        </div>
      </div>
    </>
  );
};

export default HeadComponent;
