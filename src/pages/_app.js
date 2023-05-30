import apiEndPoints from "@/constants/apiEndpoints";
import cookieKeys from "@/constants/cookieKeys";
import UserContext from "@/context/UserContext";
import "@/styles/globals.css";
import printLog from "@/util/printLog";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }) {
  const Layout = Component.layout || (({ children }) => <>{children}</>);

  const [user, setUser] = useState(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const jwt = getCookie(cookieKeys.JWT);
    if (jwt) {
      axios
        .get(`${apiEndPoints.BASE_URL}${apiEndPoints.USER_ME}`, {
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
    <UserContext.Provider value={user}>
      {load && (
        <Layout>
          <Component {...pageProps} />
          <Toaster />
        </Layout>
      )}
    </UserContext.Provider>
  );
}
