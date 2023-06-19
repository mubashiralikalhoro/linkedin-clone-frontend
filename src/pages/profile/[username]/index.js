import AppLayout from "@/components/layout";
import Post from "@/components/posts/Post";
import AboutCard from "@/components/profile/AboutCard";
import SkillsCard from "@/components/profile/SkillsCard";
import UserCard from "@/components/profile/UserCard";
import apiEndPoints from "@/constants/apiEndpoints";
import cookieKeys from "@/constants/cookieKeys";
import UserContext from "@/context/UserContext";
import api from "@/util/api";
import getBearerAuth from "@/util/getBearerAuth";
import printLog from "@/util/printLog";

import React, { useContext, useEffect, useState } from "react";

const ProfilePage = ({ userFromServer, canEdit }) => {
  const [load, setLoad] = useState(false);
  const contextUser = useContext(UserContext);
  const [user, setUser] = useState(userFromServer);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (canEdit)
      setUser({
        ...contextUser,
        skills: userFromServer.skills,
      });
  }, [contextUser]);

  // getting user posts
  useEffect(() => {
    if (user?.id) {
      api
        .get(`${apiEndPoints.POSTS}?userId=${user.id}`, {
          headers: {
            Authorization: getBearerAuth(),
          },
        })
        .then((res) => {
          printLog("posts : ", res?.data?.data);
          setPosts(res?.data?.data);
        })
        .catch((err) => {
          printLog("error fetching posts : ", err?.response?.data);
        });
    }
  }, []);

  useEffect(() => {
    if (user) {
      setLoad("user");
    } else {
      setLoad("not found");
    }
  }, []);

  return (
    <>
      {load === "user" ? (
        <div className="w-full pt-5 px-0 md:px-4 pb-10">
          {/*User profile cart*/}
          <UserCard
            user={user}
            canEdit={canEdit}
            setUser={setUser}
            setContextUser={contextUser?.setUser}
          />
          {user?.about && <AboutCard user={user} />}
          {user?.skills?.length > 0 && <SkillsCard skills={user.skills} />}
          {posts?.length > 0 && (
            <div className="w-full flex flex-col items-center ">
              <div className="w-full bg-slate-800 mt-2 rounded-md p-4">
                <h1 className="font-bold text-xl ">Posts</h1>
              </div>
              <div className="w-full max-w-xl">
                {posts.map((post) => (
                  <Post post={post} setPosts={setPosts} key={post.id} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full pt-5 font-bold flex justify-center items-center">User Not Found</div>
      )}
    </>
  );
};

export default ProfilePage;

ProfilePage.layout = AppLayout;

export const getServerSideProps = async (context) => {
  const jwt = context.req.cookies?.[cookieKeys.JWT];
  const username = context?.query?.username;

  let user = null;
  let canEdit = false;
  try {
    const response = await api.get(apiEndPoints.USER_ME, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    printLog("response : ", response?.data);

    //  logged in user
    if (response?.data?.data.username === username) {
      user = response.data.data;
      canEdit = true;
    }
    // other user
    else {
      const otherUserResponse = await api.get(`${apiEndPoints.USER}/${username}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      user = otherUserResponse?.data?.data;
      if (user?.id) {
        const followResponse = await api.get(
          `${apiEndPoints.CONNECTIONS}/status?userId=${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );

        user.connectionWithMe = followResponse?.data?.data;
      }
    }

    const skillsResponse = await api.get(`${apiEndPoints.SKILLS}/user/${user.id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    printLog("skillsResponse : ", skillsResponse?.data);

    user.skills = skillsResponse?.data?.data;
  } catch (er) {
    printLog("api error :", er?.response?.data);
    user = null;
    canEdit = false;
  }

  printLog("canEdit", canEdit);
  printLog("user", user);

  return {
    props: {
      canEdit,
      userFromServer: user,
    },
  };
};
