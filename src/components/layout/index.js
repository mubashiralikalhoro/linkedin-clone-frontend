import React from "react";
import Navbar from "../navbar";

const AppLayout = ({ children }) => {
  return (
    <div className="w-screen min-h-screen">
      <Navbar />
      <div className="max-w-6xl flex flex-col items-center mx-auto">
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default AppLayout;
