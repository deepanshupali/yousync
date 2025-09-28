"use client";
import React, { useState } from "react";
import OnlineUsers from "./OnlineUser";

const User = () => {
  const [showChat, setShowChat] = useState(true);
  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-lg shadow-lg m-4 overflow-hidden">
      <div className="flex p-4 bg-gray-900">
        <button
          onClick={() => setShowChat(true)}
          className={`flex-1 py-2 px-4 text-center ${
            showChat ? "bg-blue-700 font-bold" : "bg-gray-700"
          } rounded-l-lg transition-colors duration-300`}
        >
          Chat
        </button>
        <button
          onClick={() => setShowChat(false)}
          className={`flex-1 py-2 px-4 text-center ${
            !showChat ? "bg-blue-700 font-bold" : "bg-gray-700"
          } rounded-r-lg transition-colors duration-300`}
        >
          Online Users
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-800">
        {showChat ? //   <Chat
        //     messages={messages}
        //     setMessages={setMessages}
        //     roomId={roomId}
        //     profile={profile}
        //   />
        null : (
          <OnlineUsers onlineUsers={onlineUsers} />
        )}
      </div>
    </div>
  );
};

export default User;
