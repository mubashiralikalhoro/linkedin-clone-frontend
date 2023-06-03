import AppLayout from "@/components/layout";
import AboutCard from "@/components/profile/AboutCard";
import UserCard from "@/components/profile/UserCard";
import apiEndPoints from "@/constants/apiEndpoints";
import cookieKeys from "@/constants/cookieKeys";
import UserContext from "@/context/UserContext";
import api from "@/util/api";
import printLog from "@/util/printLog";

import React, { useContext, useEffect, useState } from "react";

const ProfilePage = ({ userFromServer, canEdit }) => {
  const [load, setLoad] = useState(false);
  const contextUser = useContext(UserContext);
  const [user, setUser] = useState(userFromServer);

  useEffect(() => {
    if (canEdit) setUser(contextUser);
  }, [contextUser]);

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
        <div className="w-full pt-5 px-0 md:px-4 ">
          {/*User profile cart*/}
          <UserCard
            user={user}
            canEdit={canEdit}
            setUser={setUser}
            setContextUser={contextUser?.setUser}
          />
          {user?.about && <AboutCard user={user} />}
        </div>
      ) : (
        <div className="w-full pt-5 font-bold flex justify-center items-center">
          User Not Found
        </div>
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
      const otherUserResponse = await api.get(
        `${apiEndPoints.USER}/${username}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      printLog("response : ", otherUserResponse?.data);

      user = otherUserResponse?.data?.data;
    }
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
