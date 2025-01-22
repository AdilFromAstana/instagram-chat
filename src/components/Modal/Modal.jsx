import React, { useState } from "react";
import "./Modal.css"; // Создайте или обновите стили для модального окна
import AttachmentGallery from "../AttachmentGallery/AttachmentGallery";

const Modal = ({ isOpen, content, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen || !content) return null;

  const handleDownload = () => {
    if (!content || content.length === 0) return;
    const currentAttachment = content[0]; // Замените на активный элемент, если нужно
    const link = document.createElement("a");
    link.href = currentAttachment.url;
    link.download = `attachment_${currentAttachment.type}_${Date.now()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="modal-overlay">
      <AttachmentGallery
        attachments={content}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
      <div className="modal-header" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-content">
          <button
            className="modal-close"
            onClick={() => {
              onClose();
              setCurrentIndex(0);
            }}
            title="Закрыть"
          >
            ✕
          </button>
          <strong>
            {currentIndex + 1}/{content.length}
          </strong>
          <button
            className="modal-download"
            onClick={handleDownload}
            title="Скачать"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              style={{ width: "24px", height: "24px", color: "white" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v12m0 0l3.5-3.5M12 15l-3.5-3.5M4.5 20.25h15"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
