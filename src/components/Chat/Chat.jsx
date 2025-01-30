import React, { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MessageList from "./Components/MessageList/MessageList";
import MessageInput from "./Components/MessageInput/MessageInput";
import { fetchDialogueMessages, sendMessage } from "../../services/api";
import ChatHeader from "./Components/ChatHeader/ChatHeader";
import ChatDrawer from "./Components/ChatDrawer/ChatDrawer";
import "./Chat.css";

const Chat = React.memo(({ client, onBack, folders }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const myId = "17841470770780990";
  const queryClient = useQueryClient();

  const {
    data: messages = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["messages", client.instagram_id],
    queryFn: () => fetchDialogueMessages(myId, client.instagram_id),
    staleTime: 60 * 1000,
    cacheTime: 5 * 60 * 1000,
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

  const sendMessageMutation = useMutation({
    mutationFn: async (newMessage) => {
      return await sendMessage(newMessage);
    },
    onSuccess: (sentMessage) => {
      const now = new Date();
      const isoDate = now.toISOString();
      const createdMessage = {
        isUnsupported: false,
        isDeleted: false,
        isRead: true,
        content: sentMessage.result.content,
        _id: sentMessage.result.message_id,
        mid: sentMessage.result.message_id,
        senderId: "17841470770780990",
        sender_id: "17841470770780990",
        recipient_id: sentMessage.result.recipient_id,
        recipientId: sentMessage.result.recipient_id,
        createdAt: isoDate
      };
      queryClient.setQueryData(["messages", client.instagram_id], (oldMessages = []) => {
        return [...oldMessages, createdMessage];
      });
    },
  });

  React.useEffect(() => {
    markMessagesAsRead.mutate();
  }, []);

  const drawerProps = useMemo(
    () => ({
      isOpen: isDrawerOpen,
      client,
      onClose: () => {
        document.body.style.overflow = "";
        setIsDrawerOpen(false);
      },
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
        isFirstMessagesLoading={isLoading}
      />

      <MessageInput client={client} sendMessage={sendMessageMutation.mutate} />
      <ChatDrawer {...drawerProps} />
    </div>
  );
});

export default Chat;
