import apiEndPoints from "@/constants/apiEndpoints";
import api from "@/util/api";
import getBearerAuth from "@/util/getBearerAuth";
import printLog from "@/util/printLog";
import React, { useState } from "react";

const Connection = ({ user }) => {
  const [userConnectionStatus, setUserConnectionStatus] = useState(user.connectionWithMe.status);
  printLog("user.connectionWithMe ", user.connectionWithMe);
  const [loading, setLoading] = useState(false);
  const handleConnect = () => {
    if (loading) return;
    setLoading(true);
    api
      .post(
        `${apiEndPoints.CONNECTIONS}/send-request`,
        {
          to: user.id,
        },
        {
          headers: {
            Authorization: getBearerAuth(),
          },
        }
      )
      .then((res) => {
        if (res.data.ok) {
          setUserConnectionStatus("pending");
        }
      })
      .catch((err) => {
        printLog("error", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRemoveConnection = () => {
    if (loading) return;
    setLoading(true);
    api
      .post(
        `${apiEndPoints.CONNECTIONS}/remove-connection`,
        {
          connectionId: user.connectionWithMe.connectionId,
        },
        {
          headers: {
            Authorization: getBearerAuth(),
          },
        }
      )
      .then((res) => {
        if (res.data.ok) {
          setUserConnectionStatus("not-connected");
        }
      })
      .catch((err) => {
        printLog("error", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (userConnectionStatus === "pending") {
    return (
      <div className={`text-blue-500 border-blue-500 border-2 px-2 w-fit rounded-full mt-2 text-sm `}>
        Request Pending
      </div>
    );
  } else if (userConnectionStatus === "accepted") {
    return (
      <div
        className={`text-blue-500 border-blue-500 border-2 px-2 w-fit rounded-full mt-2 
        text-sm cursor-pointer hover:scale-110 hover:bg-blue-500 hover:text-white duration-300`}
        onClick={handleRemoveConnection}
      >
        {loading ? "Loading..." : "Remove Connection"}
      </div>
    );
  } else if (userConnectionStatus === "not-connected") {
    return (
      <div
        className={`text-blue-500 border-blue-500 border-2 px-2 w-fit rounded-full mt-2 
        text-sm cursor-pointer hover:scale-110 hover:bg-blue-500 hover:text-white duration-300`}
        onClick={handleConnect}
      >
        {loading ? "Loading..." : "Connect"}
      </div>
    );
  }
};

export default Connection;
