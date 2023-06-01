/* eslint-disable @next/next/no-img-element */
import apiEndPoints from "@/constants/apiEndpoints";
import Image from "next/image";
import Link from "next/link";

import React from "react";
import { BiLike, BiMessageAdd } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import { format } from "timeago.js";

const Post = ({ post }) => {
  return (
    <div className="w-full rounded-md bg-slate-800 flex flex-col mt-4 py-2 max-w-xl">
      <Link className="w-full " href={`/${post?.user?.username}`}>
        <div className="flex mx-4 items-center cursor-pointer border-b pb-2 border-slate-600 mb-2">
          <Image
            className="rounded-full bg-slate-600"
            alt="user"
            height={50}
            width={50}
            src={
              post?.user?.image
                ? `${apiEndPoints.BASE_URL}${post.user.image}`
                : "/images/profile-placeholder.avif"
            }
          />
          <div className="ml-3 w-full flex items-center justify-between">
            <div>
              <p className="font-bold text-sm md:text-base">
                {post?.user?.fullname}
              </p>
              {post?.user?.work && (
                <p className="text-slate-500 text-xs md:text-sm">
                  {post?.user?.work}
                </p>
              )}
            </div>
            <p className="text-slate-500 text-xs md:text-sm">
              {format(post.createdAt)}
            </p>
          </div>
        </div>
      </Link>
      <div className="w-full px-4">
        <p className="text-sm md:text-base">{post?.title}</p>
        <p className="text-slate-500 text-xs md:text-sm">{post?.description}</p>
      </div>
      {post?.image && (
        <img
          src={`${apiEndPoints.BASE_URL}${post.image}`}
          className="mt-2"
          alt="post-image"
        />
      )}
      <div className="flex border-t border-slate-600 mx-4 mt-2 py-1 justify-between">
        <div className="flex font-bold items-center gap-2 p-3 hover:scale-110 rounded duration-100 cursor-pointer">
          <BiLike className="text-2xl" />
          Like
        </div>

        <div className="flex font-bold items-center gap-2 p-3 hover:scale-110 rounded duration-100 cursor-pointer">
          <FaRegCommentDots className="text-2xl" />
          Comment
        </div>

        <div className="flex font-bold items-center gap-2 p-3 hover:scale-110 rounded duration-100 cursor-pointer">
          <BiMessageAdd className="text-2xl" />
          Share
        </div>
      </div>
    </div>
  );
};

export default Post;
