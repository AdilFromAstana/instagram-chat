import React, { useState, useEffect, memo, useCallback, useMemo } from "react";
import MessageList from "../MessageList/MessageList";
import MessageInput from "../MessageInput/MessageInput";
import { fetchDialogueMessages } from "../../services/api";
import "./ChatView.css";
import Drawer from "../Drawer/Drawer";

const ChatView = memo(({ client, onBack, folders, setClients }) => {
  const [messages, setMessages] = useState(() => []);
  const [isDrawerOpen, setIsDrawerOpen] = useState(() => false);
  const myId = "17841470770780990";

  const loadMessages = useCallback(async () => {
    try {
      const data = await fetchDialogueMessages(myId, client.instagram_id);
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [myId, client.instagram_id]);

  const markMessagesAsRead = useCallback(() => {
    setClients((prevClients) => {
      return prevClients.map((client_) => {
        return client_.instagram_id === client.instagram_id
          ? {
            ...client_,
            lastMessage: {
              ...client_.lastMessage,
              isRead: true,
              readAt: Date.now(),
            },
          }
          : client_;
      });
    });
  }, [setClients, client.instagram_id]);

  useEffect(() => {
    markMessagesAsRead();
    loadMessages();
  }, [markMessagesAsRead, loadMessages]);

  const drawerProps = useMemo(
    () => ({
      isOpen: isDrawerOpen,
      client,
      onClose: () => setIsDrawerOpen(false),
      folders,
      submitTag: () => { }, // Функция-заглушка
    }),
    [isDrawerOpen, client, folders]
  );

  return (
    <div className="chat-view">
      <div className="chat-header">
        <button onClick={onBack} className="back-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            height="24"
            width="24"
            viewBox="0 0 476.213 476.213"
          >
            <polygon points="476.213,223.107 57.427,223.107 151.82,128.713 130.607,107.5 0,238.106 130.607,368.714 151.82,347.5   57.427,253.107 476.213,253.107 " />
          </svg>
        </button>
        <h2>{client.name || client.instagram_id}</h2>
        <button className="drawer-button" onClick={() => setIsDrawerOpen(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            fill="white"
          >
            <path d="M4 6h16M4 12h16m-7 6h7" stroke="white" strokeWidth="2" />
          </svg>
        </button>
      </div>
      {client.note && (
        <div className="note-wrapper">
          <div className="note-bar"></div>
          <div className="note-text">{client.note}</div>
        </div>
      )}
      <MessageList
        setMessages={setMessages}
        messages={messages}
        myId={myId}
        chatRoomId={client.instagram_id}
      />

      <MessageInput
        client={client}
        setMessages={setMessages}
        messages={messages}
      />
      <Drawer {...drawerProps} />
    </div>
  );
});

export default ChatView;
