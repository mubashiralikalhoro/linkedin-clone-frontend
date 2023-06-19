/* eslint-disable @next/next/no-img-element */
import apiEndPoints from "@/constants/apiEndpoints";
import api from "@/util/api";
import getBearerAuth from "@/util/getBearerAuth";
import Image from "next/image";
import Link from "next/link";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { BiLike, BiMessageAdd } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import { format } from "timeago.js";
import LoaderComponent from "../loader/LoaderComponent";

const Post = ({ post, setPosts }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [commentSending, setCommentSending] = useState(false);

  const getNoOfLikes = () => {
    let likes = post?.likes;
    if (post.isLiked !== isLiked) {
      if (isLiked) {
        likes++;
      } else {
        likes--;
      }
    }

    return `${likes} Like${likes > 1 ? "s" : ""}`;
  };

  const handleLikePress = () => {
    const lastLiked = isLiked;
    setIsLiked(!isLiked);
    api
      .post(`${apiEndPoints.POSTS}/${post.id}/` + (lastLiked ? "unlike" : "like"), null, {
        headers: {
          Authorization: getBearerAuth(),
        },
      })
      .then((res) => {
        console.log(res);
        if (res?.data?.data?.ok) {
          setPosts((prev) => {
            const newPosts = prev.map((item) => {
              if (item.id === post.id) {
                return {
                  ...item,
                  isLiked: !item.isLiked,
                  likes: item.isLiked ? item.likes - 1 : item.likes + 1,
                };
              }
              return item;
            });
            return newPosts;
          });
        } else {
          setIsLiked(lastLiked);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLiked(lastLiked);
      });
  };

  const _loadComments = () => {
    api
      .get(`${apiEndPoints.POSTS}/${post.id}/comment`, {
        headers: {
          Authorization: getBearerAuth(),
        },
      })
      .then((res) => {
        console.log(res);
        setComments(res?.data?.data);
      });
  };

  const handleCommentPress = () => {
    if (comments === null) {
      _loadComments();
    }

    setShowComments(!showComments);
  };

  const handleCommentSubmit = () => {
    if (comment.trim().length === 0) {
      toast.error("Comment cannot be empty");
      return;
    }
    // post comment
    setCommentSending(true);
    api
      .post(
        `${apiEndPoints.POSTS}/${post.id}/comment`,
        {
          text: comment.trim(),
        },
        {
          headers: {
            Authorization: getBearerAuth(),
          },
        }
      )
      .then((res) => {
        console.log("commented successfully :", res.data);
        setComment("");
        // update comment count
        setPosts((prev) => {
          return prev.map((item) => {
            if (item.id === post.id) {
              return {
                ...item,
                comments: item.comments + 1,
              };
            }
            return item;
          });
        });
        _loadComments();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setCommentSending(false);
      });
  };

  return (
    <div className="w-full rounded-md bg-slate-800 flex flex-col mt-4 py-2 max-w-xl">
      <Link className="w-full " href={`/profile/${post?.user?.username}`}>
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
              <p className="font-bold text-sm md:text-base">{post?.user?.fullname}</p>
              {post?.user?.work && (
                <p className="text-slate-500 text-xs md:text-sm">{post?.user?.work}</p>
              )}
            </div>
            <p className="text-slate-500 text-xs md:text-sm">{format(post.createdAt)}</p>
          </div>
        </div>
      </Link>
      <div className="w-full px-4">
        <p className="text-sm md:text-base">{post?.title}</p>
        <p className="text-slate-500 text-xs md:text-sm">{post?.description}</p>
      </div>
      {post?.image && (
        <img src={`${apiEndPoints.BASE_URL}${post.image}`} className="mt-2" alt="post-image" />
      )}
      <div className="flex mx-4 mt-2 py-1 justify-between text-xs md:text-sm">
        <span className="text-slate-400">{getNoOfLikes()}</span>
        <span className="text-slate-400">
          {post?.comments} Comment{post?.comments > 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex border-t border-slate-600 mx-4 mt-2 py-1 justify-between">
        <div
          className={`flex font-bold items-center gap-2 p-3 hover:scale-110 rounded duration-100 cursor-pointer ${
            isLiked ? "text-blue-500" : "text-white"
          }`}
          onClick={handleLikePress}
        >
          <BiLike className={`text-2xl `} />
          Like
        </div>

        <div
          onClick={handleCommentPress}
          className="flex font-bold items-center gap-2 p-3 hover:scale-110 rounded duration-100 cursor-pointer"
        >
          <FaRegCommentDots className="text-2xl" />
          Comment
        </div>

        <div className="flex font-bold items-center gap-2 p-3 hover:scale-110 rounded duration-100 cursor-pointer">
          <BiMessageAdd className="text-2xl" />
          Share
        </div>
      </div>
      {showComments && (
        <div className="px-4 relative pb-[105px]">
          <div className={`w-full max-h-[350px] overflow-scroll border-t border-slate-600 py-4`}>
            {comments !== null
              ? comments.map((item, index) => (
                  // main comments
                  <div className="w-full bg-slate-700 rounded mb-2 p-2" key={index}>
                    <Link className="w-full " href={`/profile/${item?.user?.username}`}>
                      <div className="flex items-center cursor-pointer ">
                        <Image
                          className="w-10 h-10 rounded-full bg-slate-500"
                          alt="user"
                          height={50}
                          width={50}
                          src={
                            item?.user?.image
                              ? `${apiEndPoints.BASE_URL}${item.user.image}`
                              : "/images/profile-placeholder.avif"
                          }
                        />
                        <div className="ml-2">
                          <h1>{item.user.fullname}</h1>
                          <p className="text-xs text-slate-400">@{item.user.username}</p>
                        </div>
                        <div className="ml-auto">
                          <p className="text-xs text-slate-400">{format(item.createdAt)}</p>
                        </div>
                      </div>
                    </Link>
                    {/* comment */}
                    <div className="mt-2">
                      <p className="text-sm">{item.text}</p>
                    </div>
                  </div>
                ))
              : // placeholder
                (() => {
                  // for custom no of placeholder comments
                  const arr = [];
                  for (let i = 0; i < post.comments; i++) {
                    arr.push(i);
                  }
                  return arr;
                })().map((item) => (
                  <div className="w-full bg-slate-700 rounded mb-2 p-2 animate-pulse" key={item}>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-slate-500" />
                      <div className="ml-2">
                        <div className="w-32 h-4 bg-slate-500 rounded-full mb-1" />
                        <div className="w-20 h-3 bg-slate-500 rounded-full mb-1" />
                      </div>
                      <div className="ml-auto">
                        <div className="w-20 h-3 bg-slate-500 rounded-full mb-1" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full h-3 bg-slate-500 rounded-full mb-1" />
                      <div className="w-full h-3 bg-slate-500 rounded-full mb-1" />
                    </div>
                  </div>
                ))}
          </div>

          {/* Add comment */}
          <div className="h-[100px] flex absolute justify-between bottom-0 w-full left-0 px-4">
            <textarea
              className="w-[90%] h-full bg-slate-700 rounded p-2 focus:outline-none"
              placeholder="Add a comment"
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <div
              onClick={() => {
                if (!commentSending) {
                  handleCommentSubmit();
                }
              }}
              className="w-[9%] h-full flex items-center justify-center bg-blue-500 rounded cursor-pointer hover:bg-blue-600"
            >
              {commentSending ? <LoaderComponent /> : <MdSend className="text-white text-2xl" />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
