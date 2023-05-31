import InputField from "@/components/inputs/InputField";
import AppLayout from "@/components/layout";
import apiEndPoints from "@/constants/apiEndpoints";
import cookieKeys from "@/constants/cookieKeys";
import UserContext from "@/context/UserContext";
import { formateDateForInput } from "@/util/dateHelpers";
import printLog from "@/util/printLog";
import axios from "axios";
import { getCookie } from "cookies-next";
import Joi from "joi";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";

//  fullname, username,phone, dateOfBirth, website, about, address

const EditProfilePage = () => {
  const user = useContext(UserContext);
  const [state, setState] = useState({
    fullname: user.fullname,
    username: user.username,
    phone: user.phone,
    dateOfBirth: user?.dateOfBirth
      ? formateDateForInput(user.dateOfBirth)
      : null,
    website: user.website,
    about: user.about,
    address: user.address,
  });

  const [errors, setErrors] = useState({
    fullname: "",
    username: "",
    phone: "",
    website: "",
  });

  const handleChange = (propertyName, e) => {
    if (errors?.[propertyName]) {
      setErrors({ ...errors, [propertyName]: "" });
    }
    setState({ ...state, [propertyName]: e.target.value });
  };

  const validate = () => {
    const errorsFound = {
      fullname: Joi.string()
        .required()
        .messages({
          "string.empty": "Required",
          "any.required": "Required",
        })
        .validate(state.fullname).error?.message,
      username: Joi.string()
        .required()
        .messages({
          "string.empty": "Required",
          "any.required": "Required",
        })
        .validate(state.username).error?.message,
      phone: state?.phone
        ? Joi.number()
            .allow("")
            .messages({
              "number.base": "Phone must be a number",
            })
            .validate(state.phone).error?.message
        : undefined,
      website: state?.website
        ? Joi.string()
            .uri()
            .messages({
              "string.uri": "Website must be a valid URL",
            })
            .validate(state.website).error?.message
        : undefined,
    };

    setErrors(errorsFound);
    return Object.values(errorsFound).every((x) => x === undefined);
  };

  const handleSubmit = () => {
    console.log("submit");

    const payLoad = {};

    Object.keys(state).forEach((key) => {
      if (state[key] !== user[key]) {
        payLoad[key] = state[key];
      }
    });

    printLog("payload", payLoad);

    axios
      .put(`${apiEndPoints.BASE_URL}${apiEndPoints.USER_ME}`, payLoad, {
        headers: {
          Authorization: `Bearer ${getCookie(cookieKeys.JWT)}`,
        },
      })
      .then((res) => {
        printLog("updated data", res.data);
        // update user context
        user.setUser({
          ...res.data.data,
          setUser: user.setUser,
        });
        toast.success("Profile updated successfully");

        // go back
        goBack();
      })
      .catch((err) => {
        const error = err?.response?.data?.error || "Something went wrong";
        toast.error(error);
      });
  };

  const router = useRouter();
  const goBack = () => {
    router.back();
  };

  return (
    <div className="w-full min-h-full px-0 md:px-4 py-4">
      <div className="w-full min-h-full bg-slate-800 md:rounded-md p-4">
        <div className="mb-5 border-b border-slate-300 pb-2 flex justify-between items-center">
          <div>
            <div
              onClick={goBack}
              className="text-blue-600 hover:text-blue-700 flex items-center cursor-pointer"
            >
              <BiArrowBack className=" mr-2" />
              Back
            </div>
            <h1 className="text-2xl font-bold">Edit Profile</h1>
          </div>

          <div
            onClick={() => {
              if (validate()) {
                handleSubmit();
              }
            }}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 font-bold rounded cursor-pointer "
          >
            Save
          </div>
        </div>

        <div className="w-full flex flex-wrap justify-between pb-5">
          <InputField
            className=" w-full md:w-[49%]"
            label="Username"
            placeholder="Enter your username"
            type="text"
            name="username"
            required
            error={errors.username}
            value={state.username}
            onChange={(e) => handleChange("username", e)}
          />

          <InputField
            className=" w-full md:w-[49%]"
            label="Fullname"
            placeholder="Enter your fullname"
            type="text"
            name="fullname"
            required
            error={errors.fullname}
            value={state.fullname}
            onChange={(e) => handleChange("fullname", e)}
          />

          <InputField
            className=" w-full md:w-[49%]"
            label="Phone"
            placeholder="Enter your phone"
            type="number"
            name="phone"
            error={errors.phone}
            value={state.phone}
            onChange={(e) => handleChange("phone", e)}
          />

          <InputField
            className=" w-full md:w-[49%]"
            label="Date of birth"
            placeholder="Enter your date of birth"
            type="date"
            name="dateOfBirth"
            value={state.dateOfBirth}
            onChange={(e) => handleChange("dateOfBirth", e)}
          />

          <InputField
            className=" w-full md:w-[49%]"
            label="Website"
            placeholder="Enter your website"
            type="text"
            name="website"
            error={errors.website}
            value={state.website}
            onChange={(e) => handleChange("website", e)}
          />

          <InputField
            className=" w-full md:w-[49%]"
            label="Address"
            placeholder="Enter your address"
            type="text"
            name="address"
            value={state.address}
            onChange={(e) => handleChange("address", e)}
          />

          <label
            className="uppercase text-xs font-bold mb-2 flex "
            htmlFor="grid-password"
          >
            About
          </label>
          <textarea
            className="w-full h-32 bg-slate-800 rounded-md text-white focus:border-blue-500
            border-slate-300 border-[1px] focus:outline-none p-3"
            placeholder="Enter your about"
            name="about"
            value={state.about}
            onChange={(e) => handleChange("about", e)}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;

EditProfilePage.layout = AppLayout;
