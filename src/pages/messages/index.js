import React, { useEffect, useRef, useState } from "react";
import AppLayout from "@/components/layout";
import api from "@/util/api";
import apiEndPoints from "@/constants/apiEndpoints";
import getBearerAuth from "@/util/getBearerAuth";
import printLog from "@/util/printLog";
import ChatPlaceHolder from "@/components/messages/ChatPlaceHolder";
import Chat from "@/components/messages/Chat";

const MessagesPage = ({}) => {
  const [messages, setMessages] = useState(null);
  // getting messages
  useEffect(() => {
    api
      .get(`${apiEndPoints.MESSAGES}`, {
        headers: {
          Authorization: getBearerAuth(),
        },
      })
      .then((res) => {
        printLog("res", res.data);
        setMessages(res.data.data);
      })
      .catch((err) => {
        printLog("err", err);
      })
      .finally(() => {});
  }, []);

  return (
    <div className="w-full pt-4 pb-10 px-0 md:px-4">
      {/* place holder */}
      {messages === null && [1, 2, 3, 4].map((item) => <ChatPlaceHolder key={item} />)}
      {/* messages */}
      {messages !== null && messages.map((item, index) => <Chat key={index} data={item} />)}
    </div>
  );
};

MessagesPage.layout = AppLayout;
export default MessagesPage;
