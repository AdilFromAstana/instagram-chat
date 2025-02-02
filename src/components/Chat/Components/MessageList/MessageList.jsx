import React, { useState, memo, useRef } from "react";
import MessageItem from "../MessageItem/MessageItem";
import Modal from "../Modal/Modal";
import { useMessageScroll } from "../../../../hooks/useMessageScroll";
import "./MessageList.css";

const MessageList = memo(({ myId, chatRoomId }) => {
  const { listRef, handleScroll, isFetchingNextPage, messages, isFetching } = useMessageScroll({
    chatRoomId,
    myId,
  });
  const messageListRef = useRef();
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNewMessageNotification, setShowNewMessageNotification] = useState(false);

  const openModal = (attachments) => {
    setModalContent(attachments);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalContent(null);
    setIsModalOpen(false);
    document.body.style.overflow = "";
  };

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
      setShowNewMessageNotification(false);
    }
  };

  return (
    <div className="chat-messages" ref={listRef} onScroll={handleScroll}>
      {isFetchingNextPage && (
        <div className="loading-indicator">
          <div className="spinner"></div>
        </div>
      )}
      {isFetching && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <ul className="message-list" ref={messageListRef}>
        {messages.map((message, index) => {
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
        })}
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
