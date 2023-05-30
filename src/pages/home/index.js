import AppLayout from "@/components/layout";
import Navbar from "@/components/navbar";
import React from "react";

const HomePage = () => {
  return (
    <div>
      <div className="bg-red-500 w-full h-screen"></div>
      <div className="bg-white w-full h-screen"></div>
      <div className="bg-yellow-500 w-full h-screen"></div>
      <div className="bg-green-500 w-full h-screen"></div>
    </div>
  );
};

export default HomePage;

HomePage.layout = AppLayout;
