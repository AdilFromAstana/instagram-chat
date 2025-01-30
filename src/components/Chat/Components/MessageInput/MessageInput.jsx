import React, { useState, useEffect, useRef } from "react";
import "./MessageInput.css";

const MessageInput = ({
  client,
  sendMessage
}) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const isButtonDisabled = isSending || (!message.trim() && !file);
  const allowedExtensions = [".jpeg", ".png", ".gif"];
  const textareaRef = useRef(null);

  const handleTextareaChange = (e) => {
    setMessage(e);
    if (textareaRef.current) {
      textareaRef.current.style.height = `26px`;
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight - 10}px`;
    }
  }, [message]);

  const validateExtension = (fileName) => {
    const fileExtension = fileName
      .slice(fileName.lastIndexOf("."))
      .toLowerCase();
    return allowedExtensions.includes(fileExtension);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const maxSize = 8 * 1024 * 1024;

    if (!validateExtension(selectedFile.name)) {
      setError("Допустимы только изображения PNG, JPEG, GIF.");
      return;
    }

    if (selectedFile.size > maxSize) {
      setError("Размер файла не должен превышать 8 МБ.");
      return;
    }

    setError(null);
    setFile(selectedFile);
    setShowModal(true);
  };

  const handleSendMessage = (message) => {
    try {
      setIsSending(true);
      setError(null);

      const formData = new FormData();
      formData.append("messageText", message);
      formData.append("senderId", "17841470770780990");
      formData.append("recipientId", client.instagram_id);
      if (file) {
        formData.append("attachment", file);
      }

      sendMessage(formData);
      setMessage("");
      setFile(null);
      setShowModal(false);
    } catch (err) {
      console.error("Ошибка при отправке сообщения:", err);
      setError("Не удалось отправить сообщение. Попробуйте снова.");
    } finally {
      setIsSending(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() || file) {
      handleSendMessage(message);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="chat-input">
      {error && (
        <div className="error-notification">
          {error}
          <div className="progress-bar"></div>
        </div>
      )}
      <form className="message-input-form" onSubmit={handleSubmit}>
        <label className="file-upload" title="Прикрепить файлы">
          📷
          <input
            type="file"
            onChange={handleFileChange}
            disabled={isSending}
            accept="image/*"
          />
        </label>
        <textarea
          ref={textareaRef}
          type="text"
          placeholder="Введите сообщение..."
          value={message}
          onChange={(e) => handleTextareaChange(e.target.value)}
          disabled={isSending}
        />
        <button type="submit" disabled={isButtonDisabled} style={{ height: '38px', width: '36px', padding: 0 }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 26 26"
          >
            <g fill={`${isButtonDisabled ? "#212121" : "#007bff"}`}>
              <path d="M3.78963301,2.77233335 L24.8609339,12.8499121 C25.4837277,13.1477699 25.7471402,13.8941055 25.4492823,14.5168992 C25.326107,14.7744476 25.1184823,14.9820723 24.8609339,15.1052476 L3.78963301,25.1828263 C3.16683929,25.4806842 2.42050372,25.2172716 2.12264586,24.5944779 C1.99321184,24.3238431 1.96542524,24.015685 2.04435886,23.7262618 L4.15190935,15.9983421 C4.204709,15.8047375 4.36814355,15.6614577 4.56699265,15.634447 L14.7775879,14.2474874 C14.8655834,14.2349166 14.938494,14.177091 14.9721837,14.0981464 L14.9897199,14.0353553 C15.0064567,13.9181981 14.9390703,13.8084248 14.8334007,13.7671556 L14.7775879,13.7525126 L4.57894108,12.3655968 C4.38011873,12.3385589 4.21671819,12.1952832 4.16392965,12.0016992 L2.04435886,4.22889788 C1.8627142,3.56286745 2.25538645,2.87569101 2.92141688,2.69404635 C3.21084015,2.61511273 3.51899823,2.64289932 3.78963301,2.77233335 Z"></path>
            </g>
          </svg>
        </button>
      </form>

      {showModal && (
        <div className="file-modal-overlay">
          <div className="file-modal">
            <p>Вы уверены, что хотите отправить выбранное изображение?</p>
            {file && (
              <div className="file-modal-image-container">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="file-modal-image"
                />
              </div>
            )}
            <div className="file-modal-buttons">
              <button
                className="file-modal-cancel-button"
                onClick={handleCancel}
                disabled={isSending}
              >
                Отменить
              </button>
              <button
                className="file-modal-send-button"
                onClick={() => handleSendMessage(message)}
                disabled={isSending}
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
