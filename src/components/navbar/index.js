import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
// icons
import { BiSearchAlt2 } from "react-icons/bi";
import { BsLinkedin } from "react-icons/bs";
import { AiFillHome, AiFillMessage } from "react-icons/ai";
import { HiUsers } from "react-icons/hi";
import { useRouter } from "next/router";
import { MdSearchOff } from "react-icons/md";
import UserContext from "@/context/UserContext";
import { deleteCookie } from "cookies-next";
import cookieKeys from "@/constants/cookieKeys";

const Navbar = () => {
  const router = useRouter();
  const [selected, setSelected] = useState("home");
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const user = useContext(UserContext);

  // setting current selected tab
  useEffect(() => {
    if (router.pathname.includes("/home")) {
      setSelected("home");
    } else if (router.pathname.includes("/profile")) {
      setSelected("profile");
    } else if (router.pathname.includes("/connections")) {
      setSelected("connections");
    } else if (router.pathname.includes("/messages")) {
      setSelected("messages");
    }
  }, [router.pathname]);

  const handleSearch = (e) => {};

  return (
    <>
      <nav className="border-gray-200 fixed w-full bg-slate-800 p-2 px-4 flex flex-col items-center z-[9999]">
        <div className="max-w-6xl w-full">
          <div className="w-full  mx-auto flex flex-wrap items-center justify-between">
            {/* logo and search */}
            <div className="flex gap-2 items-center">
              <Link href="/">
                <BsLinkedin className="text-white text-4xl" />
              </Link>

              {/* search icon for mobile view */}
              <div
                className="visible md:hidden ml-2 cursor-pointer hover:scale-110 duration-300 "
                onClick={() => setShowSearch(!showSearch)}
              >
                {showSearch ? (
                  <MdSearchOff className="text-white text-3xl" />
                ) : (
                  <BiSearchAlt2 className="text-white text-3xl" />
                )}
              </div>

              {/* search bar */}
              <div className="relative md:mr-0 md:block md:w-[300px] hidden">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BiSearchAlt2 className="text-white" />
                </div>
                <input
                  type="text"
                  id="search"
                  className="bg-slate-600 text-white sm:text-sm rounded focus:outline-none block w-full pl-10 py-2 "
                  placeholder="Search..."
                />
              </div>
            </div>
            {/* options */}
            <div className="flex">
              <ul className="flex items-center gap-4">
                <li
                  className={`text-sm font-semibold cursor-pointer  transition-colors duration-300 ${
                    selected === "home" ? "text-white" : "text-slate-400"
                  }`}
                >
                  <Link href="/home">
                    <div className="flex flex-col items-center">
                      <AiFillHome
                        className={` text-2xl  duration-300 ${
                          selected !== "connections" && "hover:scale-110 "
                        }`}
                      />
                      <h1 className="text-xs duration-300">Home</h1>
                      {selected === "home" && (
                        <div className="w-full">
                          <div className="h-1 bg-white absolute translate-y-1 scale-x-125 rounded-full">
                            <p className="invisible text-xs">Home</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
                <li
                  className={`text-sm font-semibold cursor-pointer  transition-colors duration-300 ${
                    selected === "connections" ? "text-white" : "text-slate-400 "
                  }`}
                >
                  <Link href="/connections">
                    <div className="flex flex-col items-center">
                      <HiUsers
                        className={`text-2xl duration-300 ${
                          selected !== "connections" && "hover:scale-110 "
                        }`}
                      />
                      <h1 className="text-xs duration-300">Connections</h1>
                      {selected === "connections" && (
                        <div className="w-full">
                          <div className="h-1 bg-white absolute translate-y-1 scale-x-125 rounded-full">
                            <p className="invisible text-xs">Connections</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
                <li
                  className={`text-sm font-semibold cursor-pointer  transition-colors duration-300 ${
                    selected === "connections" ? "text-white" : "text-slate-400 "
                  }`}
                >
                  <Link href="/messages">
                    <div className="flex flex-col items-center">
                      <AiFillMessage
                        className={`text-2xl duration-300 ${
                          selected !== "messages" && "hover:scale-110 "
                        }`}
                      />
                      <h1 className="text-xs duration-300">Messages</h1>
                      {selected === "messages" && (
                        <div className="w-full">
                          <div className="h-1 bg-white absolute translate-y-1 scale-x-125 rounded-full">
                            <p className="invisible text-xs">Messages</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              </ul>

              {/* profile */}

              <div className=" cursor-pointer  ml-3 md:ml-10 ">
                <Image
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="hover:scale-110 transition-all duration-300 rounded-full object-cover"
                  src={
                    user?.image
                      ? `${process.env.NEXT_PUBLIC_BASE_URL}${user.image}`
                      : "/images/profile-placeholder.avif"
                  }
                  alt="logo"
                  style={{
                    width: 40,
                    height: 40,
                  }}
                  width={40}
                  height={40}
                />
                {showProfileDropdown && (
                  <div className="z-50">
                    <div
                      className="w-[100px]  bg-slate-800 rounded absolute -translate-x-[60px] translate-y-[15px] overflow-hidden "
                      style={{
                        zIndex: 1000,
                      }}
                    >
                      <div
                        onClick={() => {
                          setShowProfileDropdown(false);
                          router.push(`/profile/${user.username}`);
                        }}
                        className="w-full py-2 cursor-pointer hover:bg-slate-600  px-2 "
                      >
                        Profile
                      </div>

                      <div
                        onClick={() => {
                          // logging out
                          deleteCookie(cookieKeys.JWT);
                          router.reload();
                        }}
                        className="w-full py-2 cursor-pointer hover:bg-slate-600  px-2 text-red-500 "
                      >
                        Log out
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {showSearch && (
          // search icon for mobile view
          <div className="relative md:mr-0 block mt-5 md:hidden w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BiSearchAlt2 className="text-white" />
            </div>
            <input
              type="text"
              id="search"
              className="bg-slate-600 text-white sm:text-sm rounded focus:outline-none block w-full pl-10 py-2 "
              placeholder="Search..."
            />
          </div>
        )}
      </nav>
      {/* space for navbar */}
      <div className="h-14" />
      {showSearch && <div className="h-16 md:hidden" />}
    </>
  );
};

export default Navbar;
