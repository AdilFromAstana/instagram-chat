import React, { useState, useMemo, memo, useRef } from "react";
import "./MessageList.css";
import { useMessageScroll } from "../../hooks/useMessageScroll";
import MessageItem from "../MessageItem/MessageItem";
import Modal from "../Modal/Modal";

const MessageList = memo(({ messages, myId, chatRoomId }) => {
  const { listRef, handleScroll, isLoading } = useMessageScroll(
    messages,
    chatRoomId,
    myId
  );
  const messageListRef = useRef();

  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNewMessageNotification, setShowNewMessageNotification] =
    useState(false);

  const openModal = (attachments) => {
    setModalContent(attachments);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Запрещаем прокрутку страницы
  };

  const closeModal = () => {
    setModalContent(null);
    setIsModalOpen(false);
    document.body.style.overflow = ""; // Разрешаем прокрутку страницы
  };

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth", // Добавляем плавную анимацию
      });
      setShowNewMessageNotification(false); // Скрываем уведомление
    }
  };

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
  }, [messages, myId]);

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
