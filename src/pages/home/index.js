import AppLayout from "@/components/layout";
import Navbar from "@/components/navbar";
import AddPost from "@/components/posts/AddPost";
import AddPostComponent from "@/components/posts/AddPostComponent";
import Post from "@/components/posts/Post";
import PostPlaceHolder from "@/components/posts/PostPlaceHolder";
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
  const [posts, setPosts] = useState(null);
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
        <div className="w-full flex flex-col items-center justify-center pb-20">
          {/* add post */}
          <AddPostComponent user={user} onClick={() => setAddNewPostModal(true)} />

          {posts !== null ? (
            posts.length == 0 ? (
              <div className="mt-5 py-3 bg-slate-800 rounded-md flex items-center justify-center max-w-xl w-full mx-auto">
                No Posts
              </div>
            ) : (
              // posts
              posts.map((item, index) => <Post key={index} post={item} setPosts={setPosts} />)
            )
          ) : (
            // posts placeholder
            <PostPlaceHolder />
          )}
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
        <div className={`w-full max-w-xl flex flex-col items-center h-fit bg-slate-800 rounded-md`}>
          <AddPost setModal={setAddNewPostModal} />
        </div>
      </ReactModal>
    </>
  );
};

export default HomePage;

HomePage.layout = AppLayout;
