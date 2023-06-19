import AppLayout from "@/components/layout";
import Connection from "@/components/profile/Connection";
import apiEndPoints from "@/constants/apiEndpoints";
import cookieKeys from "@/constants/cookieKeys";
import api from "@/util/api";
import getBearerAuth from "@/util/getBearerAuth";
import Image from "next/image";
import React, { useState } from "react";
import { LoaderIcon } from "react-hot-toast";

const ConnectionsPage = ({ connectionRequestFromServer }) => {
  const [connectionRequest, setConnectionRequest] = useState(
    connectionRequestFromServer.map((req) => ({ ...req, loading: false }))
  );

  const handleAccept = (id, index) => {
    if (connectionRequest[index].loading) return;

    setConnectionRequest(
      connectionRequest.map((req) => {
        if (req.id === id) {
          return {
            ...req,
            loading: true,
          };
        }
        return req;
      })
    );

    api
      .post(
        `${apiEndPoints.CONNECTIONS}/accept-request`,
        { connectionId: id },
        {
          headers: {
            Authorization: getBearerAuth(),
          },
        }
      )
      .then((res) => {
        if (res.data.ok) {
          setConnectionRequest((prev) => prev.filter((req) => req.id !== id));
        }
      })
      .catch((err) => {
        setConnectionRequest(
          connectionRequest.map((req) => {
            if (req.id === id) {
              return {
                ...req,
                loading: false,
              };
            }
            return req;
          })
        );
      });
  };

  const handleReject = (id, index) => {
    if (connectionRequest[index].loading) return;

    setConnectionRequest(
      connectionRequest.map((req) => {
        if (req.id === id) {
          return {
            ...req,
            loading: true,
          };
        }
        return req;
      })
    );
    api
      .post(
        `${apiEndPoints.CONNECTIONS}/remove-connection`,
        { connectionId: id },
        {
          headers: {
            Authorization: getBearerAuth(),
          },
        }
      )
      .then((res) => {
        if (res.data.ok) {
          setConnectionRequest((prev) => prev.filter((req) => req.id !== id));
        }
      })
      .catch((err) => {
        setConnectionRequest(
          connectionRequest.map((req) => {
            if (req.id === id) {
              return {
                ...req,
                loading: false,
              };
            }
            return req;
          })
        );
      });
  };

  return (
    <div className="md:px-4  py-4">
      <div className="rounded-md  w-full bg-slate-800 p-4">
        <h1 className=" font-bold text-lg">Connection Requests</h1>

        <div className="flex flex-wrap gap-2 mt-2 w-full justify-center md:justify-start ">
          {connectionRequest.map((request, index) => (
            <div
              className="flex flex-col justify-center items-center mb-2 w-[48%] max-w-[150px] h-[62dvw]  max-h-[200px]  bg-slate-700 rounded-md"
              key={index}
            >
              <Image
                src={
                  request.user?.image
                    ? `${apiEndPoints.BASE_URL}${request.user.image}`
                    : "/images/profile-placeholder.avif"
                }
                className="rounded-full bg-slate-600 object-contain"
                alt="user"
                height={60}
                width={60}
              />
              <div className="text-center text-sm font-semibold text-white mt-1">
                {request.user?.fullname}
              </div>
              <div className="text-center text-sm font-semibold text-slate-400 text-xs">
                {request.user?.work}
              </div>

              {request.loading ? (
                <div className="mt-4">
                  <LoaderIcon />
                </div>
              ) : (
                <>
                  <div
                    className={` border-blue-500 border-2 px-2 w-fit rounded-full mt-2 
                text-sm cursor-pointer hover:scale-110 bg-blue-500 text-white duration-300`}
                    onClick={() => {
                      handleAccept(request.id, index);
                    }}
                  >
                    Accept
                  </div>
                  <div
                    className={` border-red-500 border-2 px-2 w-fit rounded-full mt-2 
                text-sm cursor-pointer hover:scale-110 bg-red-500 text-white duration-300`}
                    onClick={() => {
                      handleReject(request.id, index);
                    }}
                  >
                    Reject
                  </div>
                </>
              )}
            </div>
          ))}

          {connectionRequest.length === 0 && <div>No connection requests</div>}
        </div>
      </div>
    </div>
  );
};

ConnectionsPage.layout = AppLayout;
export default ConnectionsPage;

export const getServerSideProps = async (context) => {
  const jwt = context.req.cookies[cookieKeys.JWT];

  let connectionRequest;

  try {
    connectionRequest = await api.get(`${apiEndPoints.CONNECTIONS}/get-requests`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    connectionRequest = connectionRequest.data.data;
    console.log(connectionRequest);
  } catch (err) {
    console.log("Error fetching connection requests", err);
  }

  return {
    props: {
      connectionRequestFromServer: connectionRequest || [],
    },
  };
};
