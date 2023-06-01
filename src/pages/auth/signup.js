import InputField from "@/components/inputs/InputField";
import apiEndPoints from "@/constants/apiEndpoints";
import cookieKeys, { cookieConfig } from "@/constants/cookieKeys";
import api from "@/util/api";

import { setCookie } from "cookies-next";
import Joi from "joi";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { BiLoaderAlt } from "react-icons/bi";

const SignUpPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    email: "",
    password: "",
    username: "",
    fullname: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    username: "",
    fullname: "",
    confirmPassword: "",
  });

  const handleChange = (propertyName, e) => {
    setErrors({
      ...errors,
      [propertyName]: "",
    });
    setState({
      ...state,
      [propertyName]: e.target.value,
    });
  };

  const validate = () => {
    const errorsFound = {
      email: Joi.string()
        .email({
          tlds: { allow: false },
        })
        .required()
        .label("Email")
        .validate(state.email).error?.message,

      password: Joi.string()
        .min(8)
        .max(16)
        .required()
        .label("Password")
        .validate(state.password).error?.message,

      confirmPassword: Joi.string()
        .min(8)
        .max(16)
        .required()
        .label("Confirm Password")
        .validate(state.confirmPassword).error?.message,

      username: Joi.string()
        .min(3)
        .max(255)
        .required()
        .label("Username")
        .validate(state.username).error?.message,

      fullname: Joi.string()
        .min(3)
        .max(255)
        .required()
        .label("Fullname")
        .validate(state.fullname).error?.message,
    };

    if (state.username.trim().includes(" ")) {
      errorsFound.username = "Username cannot contain spaces";
    }

    if (state.password !== state.confirmPassword) {
      errorsFound.confirmPassword = "Passwords do not match";
    }

    setErrors(errorsFound);
    console.log(errorsFound);

    return Object.values(errorsFound).every((err) => err === undefined);
  };

  const handleSubmit = () => {
    setLoading(true);
    const payload = {
      email: state.email?.trim(),
      password: state.password?.trim(),
      username: state.username?.trim(),
      fullname: state.fullname?.trim(),
    };
    api
      .post(`${apiEndPoints.SIGNUP}`, payload)
      .then((res) => {
        toast.success("Account created successfully");
        console.log("api res", res);
        setCookie(cookieKeys.JWT, res.data.data.jwt, {
          maxAge: cookieConfig.MAX_AGE,
        });

        router.reload();
      })
      .catch((err) => {
        const error = err?.response?.data?.error ?? "Something went wrong";
        toast.error(error);
        setLoading(false);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md px-4">
        <form
          className="rounded-lg w-full  shadow-lg p-4 flex flex-col items-center justify-center bg-slate-800 py-8"
          onSubmit={handleSubmit}
        >
          <Image
            className="mb-4"
            src="/images/linkedIn-logo.png"
            alt="logo"
            width={200}
            height={50}
          />
          <InputField
            value={state.username}
            className="w-full"
            label="username"
            placeholder={"mubashirali"}
            type="username"
            onChange={(e) => handleChange("username", e)}
            error={errors.username}
          />
          <InputField
            value={state.fullname}
            className="w-full"
            label="Full name"
            placeholder={"Mubashir Ali"}
            type="fullname"
            onChange={(e) => handleChange("fullname", e)}
            error={errors.fullname}
          />

          <InputField
            value={state.email}
            className="w-full"
            label="Email"
            placeholder={"mubashiralikalhoro@gmail.com"}
            type="email"
            onChange={(e) => handleChange("email", e)}
            error={errors.email}
          />

          <InputField
            value={state.password}
            className="w-full"
            label="Password"
            placeholder={"Password"}
            type="password"
            onChange={(e) => handleChange("password", e)}
            error={errors.password}
          />

          <InputField
            value={state.confirmPassword}
            className="w-full"
            label="confirm Password"
            placeholder={"Confirm Password"}
            type="confirmPassword"
            onChange={(e) => handleChange("confirmPassword", e)}
            error={errors.confirmPassword}
          />

          <div className="flex mb-4 mt-2 text-sm">
            {`Already have an account? `}
            <Link href="/auth/login">
              <p className=" ml-1 text-blue-500 hover:text-blue-600 transition-colors duration-300">
                Log in
              </p>
            </Link>
          </div>

          <div
            className="w-full cursor-pointer bg-blue-500 text-white font-semibold py-2 px-4 text-center rounded hover:bg-blue-600 transition-colors duration-300"
            onClick={() => {
              if (validate()) {
                handleSubmit();
              }
            }}
          >
            {loading ? (
              <div>
                <BiLoaderAlt className="animate-spin inline-block mr-2" />
              </div>
            ) : (
              "Sign up"
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
