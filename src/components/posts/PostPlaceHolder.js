/* eslint-disable @next/next/no-img-element */
import apiEndPoints from "@/constants/apiEndpoints";
import Image from "next/image";
import Link from "next/link";

import React from "react";
import { BiLike, BiMessageAdd } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import { format } from "timeago.js";

const PostPlaceHolder = ({}) => {
  return (
    <div className="w-full rounded-md bg-slate-800 flex flex-col mt-4 py-2 max-w-xl">
      <div className="flex mx-4 items-center cursor-pointer border-b pb-2 border-slate-600 mb-2">
        <Image
          className="rounded-full bg-slate-600"
          alt="user"
          height={50}
          width={50}
          src={"/images/profile-placeholder.avif"}
        />
        <div className="ml-3 w-full flex items-center justify-between">
          <div>
            <div className="font-bold text-sm md:text-base text-slate-500 h-4 w-28  bg-slate-500 rounded-full animate-pulse mb-1" />
            <div className="font-bold text-sm md:text-base text-slate-500 h-4 w-20  bg-slate-500 rounded-full animate-pulse mb-1" />
          </div>
          <div className="font-bold text-sm md:text-base text-slate-500 h-4 w-20  bg-slate-500 rounded-full animate-pulse mb-1" />
        </div>
      </div>

      <div className="w-full h-[200px] bg-slate-500 animate-pulse" />

      <div className="flex border-t border-slate-600 mx-4 mt-2 py-1 justify-between">
        <div className="flex font-bold h-10 w-20 items-center gap-2 p-3 hover:scale-110  duration-100 cursor-pointer bg-slate-500 text-slate-500 animate-pulse rounded-full" />
        <div className="flex font-bold h-10 w-20 items-center gap-2 p-3 hover:scale-110  duration-100 cursor-pointer bg-slate-500 text-slate-500 animate-pulse rounded-full" />
        <div className="flex font-bold h-10 w-20 items-center gap-2 p-3 hover:scale-110  duration-100 cursor-pointer bg-slate-500 text-slate-500 animate-pulse rounded-full" />
      </div>
    </div>
  );
};

export default PostPlaceHolder;
