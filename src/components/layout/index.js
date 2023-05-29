import React from "react";
import Navbar from "../navbar";

const AppLayout = ({ children }) => {
  return (
    <div className="w-screen min-h-screen">
      <div className="max-w-6xl flex flex-col items-center mx-auto">
        <Navbar />
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default AppLayout;
