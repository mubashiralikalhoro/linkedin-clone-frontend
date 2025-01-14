import apiEndPoints from "@/constants/apiEndpoints";
import Image from "next/image";
import React from "react";
import { format } from "timeago.js";

const FromMessage = ({ content, timestamp, userImage }) => {
  return (
    <div className="mb-4 w-full flex">
      <Image
        className="rounded-full bg-slate-600 object-fill h-7 w-7 mr-2"
        alt="user"
        height={50}
        width={50}
        src={
          userImage ? `${apiEndPoints.BASE_URL}${userImage}` : "/images/profile-placeholder.avif"
        }
      />
      <div>
        <div className="max-w-xs bg-slate-800 text-white rounded-r-md rounded-b-md p-2 ">
          <p className="text-sm">{content}</p>
        </div>
        <p className="text-[10px] text-gray-300 mt-1">{format(timestamp)}</p>
      </div>
    </div>
  );
};

export default FromMessage;
