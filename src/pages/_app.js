import apiEndPoints from "@/constants/apiEndpoints";
import cookieKeys from "@/constants/cookieKeys";
import UserContext from "@/context/UserContext";
import "@/styles/globals.css";
import api from "@/util/api";
import printLog from "@/util/printLog";
import { getCookie } from "cookies-next";
import Head from "next/head";
import { BsLinkedin } from "react-icons/bs";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }) {
  const Layout = Component.layout || (({ children }) => <>{children}</>);

  const [user, setUser] = useState(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const jwt = getCookie(cookieKeys.JWT);
    if (jwt) {
      api
        .get(`${apiEndPoints.USER_ME}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((res) => {
          if (res.data.error) {
            setLoad(true);
          } else {
            setUser(res.data.data);
            setLoad(true);
          }
        })
        .catch((err) => {
          printLog("error getting user :", err);
          setLoad(true);
        });
    } else {
      setLoad(true);
    }
  }, []);

  useEffect(() => {
    printLog("user :", user);
  }, [user]);

  return (
    <>
      <Head>
        <title>LinkedIn</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <UserContext.Provider
        value={{
          ...user,
          setUser,
        }}
      >
        {load ? (
          // main app
          <Layout>
            <Component {...pageProps} />
            <Toaster />
          </Layout>
        ) : (
          // SplashScreen
          <div className="w-screen h-screen items-center flex justify-center">
            <BsLinkedin className="text-white text-[50px] animate-pulse" />
          </div>
        )}
      </UserContext.Provider>
    </>
  );
}
