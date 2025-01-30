import React, { useCallback, useState } from "react";
import { formatTime } from "../../../../services/formatTime";

const MessageItem = ({ message, previousMessage, myId, openModal }) => {
  const [isImageError, setIsImageError] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);

  const getMessageMargin = (currentMessage, previousMessage) => {
    if (!previousMessage) return "5px";
    const currentTime = new Date(currentMessage.createdAt);
    const previousTime = new Date(previousMessage.createdAt);
    const timeDifference = (currentTime - previousTime) / (1000 * 60);
    return timeDifference > 5 ? "20px" : "5px";
  };

  const renderAttachments = useCallback(
    (attachments) => {
      if (!attachments || attachments.length === 0) return null;

      return (
        <div className="message-attachments">
          {attachments.map((attachment, index) => {
            if (attachment.type === "image" || attachment.type === "share") {
              return !isImageError ? (
                <img
                  key={index}
                  src={attachment.url}
                  alt={`attachment-${index}`}
                  className="attachment-image"
                  onError={() => setIsImageError(true)}
                  onClick={() => openModal(attachments)}
                />
              ) : (
                <video
                  key={index}
                  className="attachment-video"
                  onClick={() => openModal(attachments)}
                  controls
                >
                  <source src={attachment.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              );
            } else if (
              attachment.type === "video" ||
              attachment.type === "ig_reel"
            ) {
              return !isVideoError ? (
                <video
                  key={index}
                  className="attachment-video"
                  onClick={() => openModal(attachments)}
                  onError={() => setIsVideoError(true)}
                  controls
                >
                  <source src={attachment.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div key={index} className="warning-text">
                  Ошибка отображении видео {isVideoError}
                </div>
              );
            } else if (attachment.type === "audio") {
              return (
                <audio key={index} className="attachment-audio" controls>
                  <source src={attachment.url} type="audio/mpeg" />
                  Your browser does not support the audio tag.
                </audio>
              );
            }
            return null;
          })}
        </div>
      );
    },
    [openModal, isImageError, isVideoError]
  );

  return (
    <li
      className={`message-item ${
        message.sender_id === myId ? "my-message" : "their-message"
      }
      ${message.isDeleted && "message-deleted"}
      `}
      style={{ marginTop: getMessageMargin(message, previousMessage) }}
    >
      {message.isDeleted && (
        <div className="warning-text">Сообщение удалено</div>
      )}
      {message.attachments?.length > 0 ? (
        renderAttachments(message.attachments)
      ) : (
        <div className="message-content">{message.content}</div>
      )}
      <div className="message-time">{formatTime(message.createdAt)}</div>
    </li>
  );
};

export default MessageItem;
