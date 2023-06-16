import apiEndPoints from "@/constants/apiEndpoints";
import Image from "next/image";
import React from "react";

const AddPostComponent = ({ user, onClick }) => {
  return (
    <div className="w-full max-w-xl rounded-md bg-slate-800 mt-4 px-4 py-2 flex items-center" onClick={onClick}>
      <Image
        className="rounded-full bg-slate-600 object-contain"
        alt="user"
        height={50}
        width={50}
        src={user?.image ? `${apiEndPoints.BASE_URL}${user.image}` : "/images/profile-placeholder.avif"}
      />
      <div className="bg-inherit border border-slate-300 px-4 py-2 rounded-full ml-3 flex flex-1 text-slate-500">
        {"What's on your mind?"}
      </div>
    </div>
  );
};

export default AddPostComponent;
