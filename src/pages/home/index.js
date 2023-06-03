import AppLayout from "@/components/layout";
import Navbar from "@/components/navbar";
import AddPost from "@/components/posts/AddPost";
import Post from "@/components/posts/Post";
import apiEndPoints from "@/constants/apiEndpoints";
import UserContext from "@/context/UserContext";
import api from "@/util/api";
import getBearerAuth from "@/util/getBearerAuth";
import printLog from "@/util/printLog";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ReactModal from "react-modal";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [addNewPostModal, setAddNewPostModal] = useState(false);
  const user = useContext(UserContext);

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
  }, [addNewPostModal]);

  return (
    <>
      <div className="w-full">
        <div className="w-full flex flex-col items-center justify-center">
          <div
            className="w-full max-w-xl rounded-md bg-slate-800 mt-4 px-4 py-2 flex items-center"
            onClick={() => setAddNewPostModal(true)}
          >
            <Image
              className="rounded-full bg-slate-600"
              alt="user"
              height={50}
              width={50}
              src={
                user?.image
                  ? `${apiEndPoints.BASE_URL}${user.image}`
                  : "/images/profile-placeholder.avif"
              }
            />
            <div className="bg-inherit border border-slate-300 px-4 py-2 rounded-full ml-3 flex flex-1 text-slate-500">
              {"What's on your mind?"}
            </div>
          </div>
          {posts.map((item, index) => (
            <Post key={index} post={item} />
          ))}
        </div>
      </div>
      {/*Modal*/}
      <ReactModal
        ariaHideApp={false}
        isOpen={addNewPostModal}
        onRequestClose={() => setAddNewPostModal(false)}
        className="w-full h-full flex items-center justify-center"
        overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50"
      >
        <div
          className={`w-full max-w-xl flex flex-col items-center h-fit bg-slate-800 rounded-md`}
        >
          <AddPost setModal={setAddNewPostModal} />
        </div>
      </ReactModal>
    </>
  );
};

export default HomePage;

HomePage.layout = AppLayout;
