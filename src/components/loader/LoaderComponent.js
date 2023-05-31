import React from "react";
import { BiLoaderAlt } from "react-icons/bi";

const LoaderComponent = () => {
  return (
    <div>
      <BiLoaderAlt className="animate-spin inline-block mr-2" />
    </div>
  );
};

export default LoaderComponent;
