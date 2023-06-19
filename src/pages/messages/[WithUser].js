import React, { useState, useRef, useEffect, useContext } from "react";
import AppLayout from "@/components/layout";
import FromMessage from "@/components/messages/FromMessage";
import MyMessage from "@/components/messages/MyMessage";
import apiEndPoints from "@/constants/apiEndpoints";
import cookieKeys from "@/constants/cookieKeys";
import api from "@/util/api";
import printLog from "@/util/printLog";
import { MdSend } from "react-icons/md";
import getBearerAuth from "@/util/getBearerAuth";

import UserContext from "@/context/UserContext";

const ChatWithUserPage = ({ chat, totalMessages, chatWith }) => {
  const user = useContext(UserContext);

  const [messages, setMessages] = useState(chat);
  const [message, setMessage] = useState("");
  const scrollRef = useRef(null);

  const sendMessage = () => {
    const text = message.trim();
    if (text.length === 0) return;
    setMessage("");
    // send message
    setMessages([
      // temporary message for ui
      ...messages,
      {
        by: "you",
        text: text,
        createdAt: new Date().toISOString(),
        sending: true,
      },
    ]);

    api
      .post(
        `${apiEndPoints.MESSAGES}/chat/${chatWith.id}`,
        {
          text: text,
        },
        {
          headers: {
            Authorization: getBearerAuth(),
          },
        }
      )
      .then((res) => {
        _getMessages();
      })
      .catch((err) => {
        printLog("err", err);
      });
  };

  const _getMessages = () => {
    api
      .get(`${apiEndPoints.MESSAGES}/chat/${chatWith.id}`, {
        headers: {
          Authorization: getBearerAuth(),
        },
      })
      .then((res) => {
        printLog("messages from api", res.data);
        if (res.data.data.length !== messages.length) {
          setMessages((prev) => {
            return res.data.data;
          });
          setTimeout(() => {
            scrollToBottom("smooth");
          }, 10);
        }
      })
      .catch((err) => {
        printLog("err", err);
      })
      .finally(() => {});
  };

  const scrollToBottom = (b = "instant") => {
    scrollRef.current.scrollIntoView({
      behavior: b,
    });
  };
  // scroll to bottom on messages change
  useEffect(() => {
    if (messages[messages.length - 1]?.sending) {
      scrollToBottom("smooth");
    }
  }, [messages]);

  // scroll to bottom on mount
  useEffect(scrollToBottom, []);

  // get messages after every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      _getMessages();
      printLog("getting messages");
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto py-5 pb-20 px-2">
      {messages?.map((item, index) =>
        item.by === "you" ? (
          <MyMessage
            key={index}
            content={item.text}
            timestamp={item.createdAt}
            isSending={item?.sending}
            userImage={user?.image}
          />
        ) : (
          <FromMessage
            key={index}
            content={item.text}
            timestamp={item.createdAt}
            userImage={chatWith?.image}
          />
        )
      )}
      <div ref={scrollRef} />
      <div className="flex w-full h-20 fixed bottom-0 right-0 justify-center">
        <div className="w-full max-w-xl h-full bg-black p-2 flex justify-between items-center">
          <textarea
            className="w-[85%] text-white p-2 bg-slate-800 mr-1
            focus:outline-none rounded-md"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div
            onClick={sendMessage}
            className="bg-slate-800 p-4 rounded-md cursor-pointer hover:border-white border border-slate-800"
          >
            <MdSend className="text-white text-[30px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

ChatWithUserPage.layout = AppLayout;
export default ChatWithUserPage;

// getting chat from server side
export const getServerSideProps = async (context) => {
  const jwt = context.req.cookies[cookieKeys.JWT];
  const chatWith = context.params.WithUser;
  let chat = null;
  let totalMessages = 0;
  let chatWithUser;

  // get chat
  try {
    const apiResponse = await api.get(`${apiEndPoints.MESSAGES}/chat/${chatWith}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    chatWithUser = apiResponse.data.user;
    totalMessages = apiResponse.data.metaData.total;
    chat = apiResponse.data.data;
  } catch (err) {
    printLog("err :::", err);
  }

  printLog("chat", chat);
  printLog("totalMessages", totalMessages);
  printLog("chatWithUser", chatWithUser);
  return {
    props: {
      chat,
      totalMessages,
      chatWith: chatWithUser,
    }, // will be passed to the page component as props
  };
};
