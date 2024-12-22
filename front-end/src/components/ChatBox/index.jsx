import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPaperclip,
  FaRegSmileBeam,
  FaPaperPlane,
  FaCommentSlash,
  FaUserCircle,
} from "react-icons/fa";
// import { Button, FloatButton } from "antd";
// import { IoLogoSnapchat } from "react-icons/io";
// import { CommentOutlined, CustomerServiceOutlined } from "@ant-design/icons";
// import { BsChatRightHeart } from "react-icons/bs";
// import { GoHubot } from "react-icons/go";
// import { FaRobot } from "react-icons/fa";
// import { MdArrowForwardIos } from "react-icons/md";
import VoiceCommand from "../VoidCommand";

export default function ChatBox() {
  const [isChatBoxVisible, setIsChatBoxVisible] = useState(false);

  const toggleChatBox = () => {
   //console.log("object");
    setIsChatBoxVisible(!isChatBoxVisible);
  };

  return (
    <div className="fixed z-50 flex flex-col">
      <AnimatePresence>
        {/* {isChatBoxVisible && ( */}
          <>
            {/* Overlay mờ nền */}
            <motion.div
              className="fixed inset-0 z-40 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={toggleChatBox}
            />

            {/* Chatbox */}
            <motion.div
              className="flex flex-col h-[550px] max-w-md fixed bottom-1 right-16 m-4 rounded-2xl bg-gray-100 shadow-xl z-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col w-full h-full border shadow-lg rounded-2xl">
                <div className="flex items-center justify-between p-3 border-b rounded-t-2xl">
                  <h5 className="text-lg font-semibold">Chat</h5>
                  <button type="button" className="btn btn-primary btn-sm">
                    Let's Chat App
                  </button>
                </div>
                <div className="flex-1 p-2 overflow-auto">
                  <div className="flex items-start mb-4">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                      alt="avatar 1"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-3">
                      <p className="p-2 mb-1 bg-gray-200 rounded-lg">Hi</p>
                      <p className="text-sm text-gray-500">23:58</p>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="flex-grow mx-3 border-b border-gray-300"></div>
                    <span className="text-gray-400">Today</span>
                    <div className="flex-grow mx-3 border-b border-gray-300"></div>
                  </div>

                  <div className="flex items-start mb-4">
                    <div className="mr-3 text-left">
                      <p className="p-2 mb-1 rounded-lg text-white bg-[#6EACDA]">
                        Long time no see! Tomorrow office. will be free on
                        Sunday.
                      </p>
                      <p className="text-sm text-right text-gray-500">00:06</p>
                    </div>
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
                      alt="avatar 1"
                      className="w-10 h-10 rounded-full"
                    />
                  </div>

                  {/* Các tin nhắn khác */}
                  {/* Lặp lại các khối tin nhắn như trên với các dữ liệu khác */}
                </div>
                <div className="flex items-center p-3 bg-gray-100 border-t border-gray-200 rounded-b-2xl">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                    alt="avatar 3"
                    className="flex-shrink-0 w-10 h-10 rounded-full"
                  />
                  <input
                    type="text"
                    className="flex-grow p-2 mx-2 border-none rounded-lg form-control focus:ring-0"
                    placeholder="Type message"
                  />
                  <a className="flex-shrink-0 ml-2 text-gray-500" href="#!">
                    <FaPaperclip />
                  </a>
                  <a className="flex-shrink-0 ml-2 text-gray-500" href="#!">
                    <FaRegSmileBeam />
                  </a>
                  <a className="flex-shrink-0 ml-2 text-gray-500" href="#!">
                    <FaPaperPlane />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        {/* )} */}
      </AnimatePresence>
      {/* <motion.div
        className="fixed p-3 cursor-pointer bottom-1/2 -left-3 rounded-xl border-neutral-600"
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.3 }}
        onClick={toggleChatBox}
        style={{ width: "80px", height: "80px" }}
      >
        {!isChatBoxVisible && <MdArrowForwardIos size={30} />}
      </motion.div> */}
      {/* <motion.div
        className="fixed p-3 cursor-pointer bottom-16 right-6 rounded-xl border-neutral-600"
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.3 }}
        onClick={toggleChatBox}
        style={{ width: "80px", height: "80px" }}
      >
        {!isChatBoxVisible && (
          <BsChatRightHeart
            size={30}
            style={{
              position: "absolute",
              bottom: "70",
              right: "60",
              zIndex: 1,
            }}
          />
        )}
        <FaRobot
          size={50}
          style={{ position: "absolute", bottom: "30", right: "10" }}
        />
      </motion.div> */}
      <VoiceCommand/>
    </div>
  );
}
