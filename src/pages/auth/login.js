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

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
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
    };

    setErrors(errorsFound);
    console.log(errorsFound);

    return Object.values(errorsFound).every((err) => err === undefined);
  };

  const handleSubmit = () => {
    setLoading(true);
    const payload = {
      email: state.email,
      password: state.password,
    };
    api
      .post(`${apiEndPoints.LOGIN}`, payload)
      .then((res) => {
        toast.success("Login successful");
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
      <div className="w-full max-w-md mx-4">
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
            value={state.email}
            className="w-full"
            label="Email"
            placeholder={"Enter your email"}
            type="email"
            onChange={(e) => handleChange("email", e)}
            error={errors.email}
          />

          <InputField
            value={state.password}
            className="w-full"
            label="Password"
            placeholder={"Enter your password"}
            type="password"
            onChange={(e) => handleChange("password", e)}
            error={errors.password}
          />
          <div className="flex mb-4 mt-2 text-sm">
            {`Don't have an account? `}
            <Link href="/auth/signup">
              <p className=" ml-1 text-blue-500 hover:text-blue-600 transition-colors duration-300">
                Sign Up
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
              "Login"
            )}
          </div>
        </form>
        <div className="flex text-xs right-0 bottom-0 absolute p-4">
          developed by
          <Link href="https://github.com/mubashiralikalhoro" target="_blank">
            <p className=" ml-1 text-blue-500 hover:text-blue-600 transition-colors duration-300">
              <u>Mubashir Ali Kalhoro</u>
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
