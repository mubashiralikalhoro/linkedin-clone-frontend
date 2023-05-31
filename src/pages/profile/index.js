import AppLayout from "@/components/layout";
import UserCard from "@/components/profile/UserCard";
import UserContext from "@/context/UserContext";

import React, { useContext } from "react";

const ProfilePage = () => {
  const user = useContext(UserContext);

  return (
    <div className="w-full pt-5 px-0 md:px-4 ">
      {/*User profile cart*/}
      <UserCard user={user} />
    </div>
  );
};

export default ProfilePage;

ProfilePage.layout = AppLayout;
