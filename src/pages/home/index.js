import AppLayout from "@/components/layout";
import Navbar from "@/components/navbar";
import Post from "@/components/posts/Post";
import apiEndPoints from "@/constants/apiEndpoints";
import api from "@/util/api";
import getBearerAuth from "@/util/getBearerAuth";
import printLog from "@/util/printLog";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const HomePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api
      .get(apiEndPoints.POSTS, {
        headers: {
          Authorization: getBearerAuth(),
        },
      })
      .then((res) => {
        printLog("posts :", res.data);
        setPosts(res.data.data);
      })
      .catch((er) => {
        let error = er?.response?.data?.error || "Unable to fetch posts!";
        toast.error(error);
        setTimeout(() => {
          toast.error("Please refresh the page.");
        }, 2000);
      });
  }, []);

  return (
    <div className="w-full">
      <div className="w-full flex flex-col items-center justify-center">
        {posts.map((item, index) => (
          <Post key={index} post={item} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;

HomePage.layout = AppLayout;
