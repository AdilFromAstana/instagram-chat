import React, { useState, useMemo, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MessageList from "./Components/MessageList/MessageList";
import MessageInput from "./Components/MessageInput/MessageInput";
import { fetchDialogueMessages, sendMessage } from "../../services/api";
import ChatHeader from "./Components/ChatHeader/ChatHeader";
import ChatDrawer from "./Components/ChatDrawer/ChatDrawer";
import "./Chat.css";
import socket, { joinRoom } from "../../services/socketClient";

const Chat = React.memo(({ client, setSelectedClient, folders }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const myId = "17841470770780990";
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const markMessagesAsRead = useMutation({
    mutationFn: async () => {
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.setQueryData(["clients", client?.folder], (oldClients) => {
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
        createdAt: isoDate,
      };
      queryClient.setQueryData(
        ["messages", client.instagram_id],
        (oldMessages = []) => {
          return [...oldMessages, createdMessage];
        }
      );
    },
    onError: (error) => {
      console.log("error: ", error);
      setErrorMessage("Ошибка отправки сообщения!");
      return;
    },
  });

  useEffect(() => {
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

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  useEffect(() => {
    joinRoom(client?.instagram_id)

    const addNewMessage = (newMessage) => {
      if (newMessage?.sender_id === client?.instagram_id) {
        queryClient.setQueryData(
          ["messages", client.instagram_id],
          (oldMessages = []) => {
            return oldMessages.some(msg => msg.mid === newMessage.mid)
              ? oldMessages.map(msg => msg.mid === newMessage.mid ? newMessage : msg)
              : [...oldMessages, newMessage];
          }
        );
      }
    }

    socket.on("newMessage", addNewMessage);

    return () => {
      socket.off("newMessage", addNewMessage);
    };
  }, []);

  return (
    <div className="chat-view">
      <ChatHeader
        onBack={() => setSelectedClient(() => null)}
        client={client}
        setIsDrawerOpen={setIsDrawerOpen}
      />

      {successMessage && (
        <div className="success-message">
          {successMessage}
          <div className="success-bar" />
        </div>
      )}
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
          <div className="error-bar" />
        </div>
      )}

      {client.note && (
        <div className="note-wrapper">
          <div className="note-bar"></div>
          <div className="note-text">{client.note}</div>
        </div>
      )}

      <MessageList
        myId={myId}
        chatRoomId={client.instagram_id}
      />

      <MessageInput
        client={client}
        sendMessage={sendMessageMutation.mutateAsync}
      />
      <ChatDrawer {...drawerProps} />
    </div>
  );
});

export default Chat;
