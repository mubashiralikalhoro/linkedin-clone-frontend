/* eslint-disable @next/next/no-img-element */
import apiEndPoints from "@/constants/apiEndpoints";
import React, { useState } from "react";
import ImageInput from "../inputs/ImageInput";
import InputField from "../inputs/InputField";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-hot-toast";
import LoaderComponent from "../loader/LoaderComponent";
import api from "@/util/api";
import getBearerAuth from "@/util/getBearerAuth";

const AddPost = ({ setModal }) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    title: "",
    description: "",
    image: "",
  });

  const handleChange = (propertyName, e) => {
    setState({ ...state, [propertyName]: e.target.value });
  };

  const handleSubmit = () => {
    if (!state.title && !state.description && !state.image) {
      toast.error("All Field can't be empty.");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append("description", state.description);
    formData.append("title", state.title);
    if (state.image) {
      formData.append("image", state.image);
    }

    api
      .post(apiEndPoints.POSTS, formData, {
        headers: {
          Authorization: getBearerAuth(),
        },
      })
      .then((res) => {
        setState({
          title: "",
          description: "",
          image: "",
        });
        setModal(false);
        toast.success("Posted Successfully");
      })
      .catch((er) => {
        let error = er?.response?.data?.message || "Something went wrong";
        toast.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-full rounded-md bg-slate-800 flex flex-col mt-4 max-w-xl px-4">
      <div className="flex justify-between mb-5 w-full border-b border-slate-300 py-2 items-center">
        <p className="font-bold text-xl ">New Post</p>
        <RxCross2
          className="text-xl hover:scale-110 cursor-pointer"
          onClick={() => {
            if (window.confirm("are you sure?")) setModal(false);
          }}
        />
      </div>
      <InputField placeholder={"What's on your mind"} value={state.title} onChange={(e) => handleChange("title", e)} />

      <textarea
        className="w-full h-32 bg-slate-800 rounded-md text-white focus:border-blue-500 mb-3
            border-slate-300 border-[1px] focus:outline-none p-3"
        placeholder="Description"
        value={state.description}
        onChange={(e) => handleChange("description", e)}
      />
      <ImageInput
        onChange={(file) =>
          setState({
            ...state,
            image: file,
          })
        }
      />
      <div
        onClick={handleSubmit}
        className="bg-white text-slate-800 hover:scale-110 px-7 py-2 font-bold rounded-md cursor-pointer w-fit h-fit mt-2 mb-2 mx-auto"
      >
        {loading ? <LoaderComponent /> : "Post"}
      </div>
    </div>
  );
};

export default AddPost;
