import React, {
  useState,
  useEffect,
  useMemo,
  memo,
  useCallback,
  useRef,
} from "react";
import "./MessageList.css";
import { useMessageScroll } from "../../hooks/useMessageScroll";
import MessageItem from "../MessageItem/MessageItem";
import Modal from "../Modal/Modal";
import socket from "../../services/socketClient";

const MessageList = memo(({ messages, setMessages, myId, chatRoomId }) => {
  const { listRef, handleScroll, isLoading, skipScrollHandling } =
    useMessageScroll(messages, setMessages, chatRoomId, myId);
  const messageListRef = useRef();

  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNewMessageNotification, setShowNewMessageNotification] =
    useState(false);

  const openModal = useCallback((attachments) => {
    setModalContent(attachments);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setModalContent(null);
    setIsModalOpen(false);
    document.body.style.overflow = "";
  }, []);

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
      setShowNewMessageNotification(false);
    }
  };

  useEffect(() => {
    socket.emit("joinRoom", chatRoomId);
    const handleNewMessage = (newMessage) => {
      if (newMessage.recipient_id === chatRoomId || newMessage.sender_id === chatRoomId) {

        skipScrollHandling.current = true;

        setMessages((prevMessages) => {
          const isMessageExists = prevMessages.some(
            (message) => message.mid === newMessage.mid
          );
          if (isMessageExists) {
            return prevMessages.map((message) => {
              message.isRead = true;
              message.readAt = Date.now();
              if (message.mid === newMessage.mid) {
                return { ...message, isDeleted: newMessage.isDeleted };
              }
              return message;
            });
          }
          return [...prevMessages, newMessage];
        });

        if (
          listRef.current &&
          listRef.current.scrollTop + listRef.current.clientHeight <
          listRef.current.scrollHeight - 10
        ) {
          setShowNewMessageNotification(true);
        } else {
          scrollToBottom();
        }

        skipScrollHandling.current = false;
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.emit("leaveRoom", chatRoomId);
    };
  }, [setMessages, listRef]);

  const renderedMessages = useMemo(() => {
    return messages.map((message, index) => {
      const previousMessage = index > 0 ? messages[index - 1] : null;
      return (
        <MessageItem
          key={message._id}
          message={message}
          previousMessage={previousMessage}
          myId={myId}
          openModal={openModal}
        />
      );
    });
  }, [messages, myId, openModal]);

  return (
    <div className="chat-messages" ref={listRef} onScroll={handleScroll}>
      {isLoading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
        </div>
      )}
      <ul className="message-list" ref={messageListRef}>
        {renderedMessages}
      </ul>
      {showNewMessageNotification && (
        <button className="scroll-to-bottom" onClick={scrollToBottom}>
          Новое сообщение ↓
        </button>
      )}

      <Modal isOpen={isModalOpen} content={modalContent} onClose={closeModal} />
    </div>
  );
});

export default MessageList;
