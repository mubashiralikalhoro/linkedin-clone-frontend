import React from "react";

const AboutCard = ({ user }) => {
  return (
    <div className="bg-slate-800 rounded-md w-full h-fit p-4 lg:px-8 md:px-6 px-4 mt-2 ">
      <h1 className="font-bold text-xl">About</h1>
      <p className="text-sm"> {user.about}</p>
    </div>
  );
};

export default AboutCard;
