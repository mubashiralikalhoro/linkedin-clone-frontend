import apiEndPoints from "@/constants/apiEndpoints";
import Image from "next/image";
import React from "react";
import { format } from "timeago.js";

const MyMessage = ({ content, timestamp, isSending, userImage }) => {
  return (
    <div className="mb-4 w-full flex justify-end">
      <div className="flex flex-col items-end">
        <div className="max-w-xs bg-blue-600 text-end text-white rounded-l-md rounded-b-md p-2 ">
          <p className="text-sm">{content}</p>
        </div>
        <p className="text-[10px] text-gray-300 mt-1">
          {isSending ? "sending..." : format(timestamp)}
        </p>
      </div>
      <Image
        className="rounded-full bg-slate-600 object-fill h-7 w-7 ml-2"
        alt="user"
        height={50}
        width={50}
        src={
          userImage ? `${apiEndPoints.BASE_URL}${userImage}` : "/images/profile-placeholder.avif"
        }
      />
    </div>
  );
};

export default MyMessage;
