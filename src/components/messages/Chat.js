import apiEndPoints from "@/constants/apiEndpoints";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { format } from "timeago.js";

const Chat = ({ data }) => {
  return (
    <Link href={`/messages/${data?.id}`}>
      <div className="p-4 rounded-lg bg-slate-800 shadow-lg mb-2 cursor-pointer">
        <div className="flex">
          <Image
            className="rounded-full bg-slate-600 object-fill h-12 w-12"
            alt="user"
            height={50}
            width={50}
            src={
              data?.image
                ? `${apiEndPoints.BASE_URL}${data.image}`
                : "/images/profile-placeholder.avif"
            }
          />

          <div className="ml-4 w-[80%]">
            <div className="flex items-center">
              <h1 className="font-medium">{data.fullname}</h1>

              {data?.lastMessage?.createdAt && ( // if last message is there
                <div className="font-normal text-slate-400 text-sm ml-2">
                  {format(data?.lastMessage?.createdAt)}
                </div>
              )}
            </div>

            {data?.lastMessage !== null ? ( // if last message is there
              <div
                className={`text-sm ${data?.lastMessage?.isRead ? "text-slate-400" : "text-white"}`}
              >
                {data?.lastMessage?.text}
              </div>
            ) : (
              <div className={`text-sm text-slate-400 italic underline`}>Start a conversation</div>
            )}
          </div>

          {!!data?.lastMessage &&
            !data?.lastMessage?.isRead && ( // if last message is there
              <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto" />
            )}
        </div>
      </div>
    </Link>
  );
};

export default Chat;
