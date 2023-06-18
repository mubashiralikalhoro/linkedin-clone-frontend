import React, { useState } from "react";
import { MdOutlineModeEditOutline } from "react-icons/md";
import useWindowSize from "@/hooks/useWindowSize";
import Image from "next/image";
import Link from "next/link";
import ReactModal from "react-modal";
import { IoClose } from "react-icons/io5";
import apiEndPoints from "@/constants/apiEndpoints";
import { getCookie } from "cookies-next";
import cookieKeys from "@/constants/cookieKeys";
import printLog from "@/util/printLog";
import { toast } from "react-hot-toast";
import LoaderComponent from "../loader/LoaderComponent";
import api from "@/util/api";
import Connection from "./Connection";

const UserCard = ({ user, canEdit, setContextUser, setUser }) => {
  const [hover, setHover] = useState("none");
  const [imageModal, setImageModal] = useState("none");
  const [loading, setLoading] = useState(false);
  const size = useWindowSize();

  const handleImageDelete = () => {
    setLoading(true);
    api
      .delete(`${apiEndPoints.USER_ME}/images/${imageModal}`, {
        headers: {
          Authorization: `Bearer ${getCookie(cookieKeys.JWT)}`,
        },
      })
      .then((res) => {
        setContextUser({
          ...res.data.data,
          setUser: user.setUser,
        });
        toast.success("Image deleted");
      })
      .catch((err) => {
        const error = err.response.data.error || "Something went wrong";
        toast.error(error);
      })
      .finally(() => {
        setLoading(false);
        setImageModal("none");
      });
  };

  const handleImageUpload = (e) => {
    printLog("image :", e.target.files);

    if (e?.target?.files?.length === 0) return;
    if (e.target.files[0].size > 5000000) {
      toast.error("Image size should be less than 5mb");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    printLog("formData :", formData.get("file"));

    api
      .post(`${apiEndPoints.USER_ME}/images/${imageModal}`, formData, {
        headers: {
          Authorization: `Bearer ${getCookie(cookieKeys.JWT)}`,
        },
      })
      .then((res) => {
        printLog("res", res.data);
        setContextUser({
          ...res.data.data,
          setUser: user.setUser,
        });
        toast.success("Image uploaded");
      })
      .catch((err) => {
        printLog("error", err);
        const error = err?.response?.data?.error || "Something went wrong";
        toast.error(error);
      })
      .finally(() => {
        setLoading(false);
        setImageModal("none");
      });
  };

  return (
    <>
      <ReactModal
        ariaHideApp={false}
        isOpen={imageModal !== "none"}
        onRequestClose={() => setImageModal("none")}
        className="w-full h-full flex items-center justify-center"
        overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50"
      >
        <div className={`w-[200px] flex flex-col items-center h-fit p-2 bg-slate-800 rounded-md font-bold`}>
          {loading ? (
            <LoaderComponent />
          ) : (
            <>
              <div className="w-full flex justify-end">
                <div className="absolute rounded-full bg-white text-black p-1 -translate-y-4 translate-x-4">
                  <IoClose onClick={() => setImageModal("none")} className=" cursor-pointer" />
                </div>
              </div>
              <div className="p-2  cursor-pointer hover:underline">
                <input
                  id="upload_image"
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handleImageUpload(e);
                  }}
                />
                <label htmlFor="upload_image">Upload</label>
              </div>
              {
                // delete image
                (imageModal === "profile" ? user.image : user.coverImage) && (
                  <>
                    <div className="h-[1px] w-full bg-slate-300" />
                    <div onClick={handleImageDelete} className="p-2 text-red-500 cursor-pointer hover:underline">
                      Delete
                    </div>
                  </>
                )
              }
            </>
          )}
        </div>
      </ReactModal>

      <div className="w-full h-fit rounded-md overflow-hidden">
        {canEdit && (
          <div
            className=" flex justify-end "
            onMouseEnter={() => setHover("coverImage")}
            onMouseLeave={() => setHover("none")}
          >
            {
              // edit profile image
              hover === "coverImage" && (
                <div className="flex items-center justify-center absolute p-4">
                  <MdOutlineModeEditOutline
                    className="text-white text-2xl  cursor-pointer"
                    onClick={() => setImageModal("coverImage")}
                  />
                </div>
              )
            }
          </div>
        )}
        <div
          className="w-full bg-slate-400 bg-cover bg-center bg-no-repeat flex items-end"
          style={{
            backgroundImage: user?.coverImage ? `url(${process.env.NEXT_PUBLIC_BASE_URL}${user.coverImage})` : null,
            height: (size.width > 1150 ? 1150 : size.width) * 0.3,
          }}
          onMouseEnter={() => setHover("coverImage")}
          onMouseLeave={() => setHover("none")}
        >
          <div
            style={{
              transform: "translateY(30%)",
            }}
            className={`rounded-full overflow-hidden ml-5 md:ml-8 lg:ml-10 border-[3px] md:border-[5px]  border-slate-800 ${
              canEdit && "cursor-pointer"
            }`}
            onMouseEnter={() => {
              if (canEdit) setHover("profile");
            }}
            onMouseLeave={() => {
              if (canEdit) setHover("none");
            }}
            onClick={() => {
              if (canEdit) setImageModal("profile");
            }}
          >
            {canEdit && (
              <div>
                <div
                  className={`absolute bg-slate-800  w-full h-full duration-300 ${
                    hover === "profile" ? "opacity-50" : "opacity-0"
                  }`}
                />
                {
                  // edit profile image
                  hover === "profile" && (
                    <div className="absolute w-full h-full flex items-center justify-center">
                      <MdOutlineModeEditOutline className="text-white text-2xl " />
                    </div>
                  )
                }
              </div>
            )}
            <Image
              src={
                user?.image ? `${process.env.NEXT_PUBLIC_BASE_URL}${user.image}` : "/images/profile-placeholder.avif"
              }
              style={{
                height: (size.width > 1150 ? 1150 : size.width) * 0.2,
                width: (size.width > 1150 ? 1150 : size.width) * 0.2,
              }}
              className="object-cover bg-slate-800"
              width={(size.width > 1150 ? 1150 : size.width) * 0.2}
              height={(size.width > 1150 ? 1150 : size.width) * 0.2}
              alt="profile"
            />
          </div>
        </div>
        <div className="w-full bg-slate-800 h-fit pb-5 px-4 md:px-8">
          <div
            style={{
              height: (size.width > 1150 ? 1150 : size.width) * 0.2 * 0.3,
            }}
            className="flex justify-end items-center mb-2"
          >
            {canEdit && (
              <Link href={`/profile/${user?.username}/edit`}>
                <MdOutlineModeEditOutline className="text-white text-2xl mr-5 cursor-pointer hover:scale-110 duration-300" />
              </Link>
            )}
          </div>

          {
            // fullname
            <div className="font-bold text-xl">{user.fullname}</div>
          }
          {
            // work
            user?.address && <p className="text-gray-400">{user.work}</p>
          }
          {
            // address
            user?.address && <p className="text-gray-400">{user.address}</p>
          }
          {user?.connections > 0 && (
            // connections
            <p className="text-blue-400">{`${user.connections} connection${user.connections !== 1 ? "s" : ""}`}</p>
          )}
          {
            // website
            user?.website && (
              <Link href={user.website} target="_blank">
                <p className="text-blue-400 hover:underline cursor-pointer">{user.website}</p>
              </Link>
            )
          }
          {user?.connectionWithMe?.status && <Connection user={user} />}
        </div>
      </div>
    </>
  );
};

export default UserCard;
