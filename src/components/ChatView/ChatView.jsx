import React, { useState, useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MessageList from "../MessageList/MessageList";
import MessageInput from "../MessageInput/MessageInput";
import { fetchDialogueMessages } from "../../services/api";
import Drawer from "../Drawer/Drawer";
import ChatHeader from "../ChatHeader/ChatHeader";
import "./ChatView.css";

const ChatView = React.memo(({ client, onBack, folders }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const myId = "17841470770780990";
  const queryClient = useQueryClient();

  const {
    data: messages = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["messages", client.instagram_id], // Кешируем сообщения по ID клиента
    queryFn: () => fetchDialogueMessages(myId, client.instagram_id),
    staleTime: 60 * 1000, // Держим сообщения свежими 1 минуту
    cacheTime: 5 * 60 * 1000, // Кешируем сообщения на 5 минут
  });

  const markMessagesAsRead = useMutation({
    mutationFn: async () => {
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.setQueryData(["clients"], (oldClients) => {
        return oldClients?.map((client_) =>
          client_.instagram_id === client.instagram_id
            ? {
                ...client_,
                lastMessage: {
                  ...client_.lastMessage,
                  isRead: true,
                  readAt: Date.now(),
                },
              }
            : client_
        );
      });
    },
  });

  React.useEffect(() => {
    markMessagesAsRead.mutate();
  }, [client.instagram_id]);

  const drawerProps = useMemo(
    () => ({
      isOpen: isDrawerOpen,
      client,
      onClose: () => setIsDrawerOpen(false),
      folders,
    }),
    [isDrawerOpen, client, folders]
  );

  return (
    <div className="chat-view">
      <ChatHeader
        onBack={onBack}
        client={client}
        setIsDrawerOpen={setIsDrawerOpen}
      />

      {client.note && (
        <div className="note-wrapper">
          <div className="note-bar"></div>
          <div className="note-text">{client.note}</div>
        </div>
      )}

      <MessageList
        messages={messages}
        myId={myId}
        chatRoomId={client.instagram_id}
      />

      <MessageInput client={client} />
      <Drawer {...drawerProps} />
    </div>
  );
});

export default ChatView;
