import React, { memo, useState } from "react";
import { useSwipeable } from "react-swipeable";
import "./AttachmentGallery.css";

const AttachmentGallery = memo(
  ({ attachments, setCurrentIndex, currentIndex }) => {
    const [isImageError, setIsImageError] = useState(false);

    const handleNext = () => {
      if (currentIndex < attachments.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    };

    const handlePrev = () => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    };

    const handlers = useSwipeable({
      onSwipedLeft: handleNext,
      onSwipedRight: handlePrev,
      preventDefaultTouchmoveEvent: true,
      trackMouse: true,
    });

    const currentAttachmemnt = () => {
      if (
        attachments[currentIndex].type === "image" ||
        attachments[currentIndex].type === "share"
      ) {
        return !isImageError ? (
          <img
            src={attachments[currentIndex].url}
            alt={`attachment`}
            className="attachment"
            onError={() => setIsImageError(true)}
          />
        ) : (
          <video className="attachment" controls>
            <source src={attachments[currentIndex].url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      } else if (
        attachments[currentIndex].type === "video" ||
        attachments[currentIndex].type === "ig_reel"
      ) {
        return (
          <video className="attachment" controls>
            <source src={attachments[currentIndex].url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      } else if (attachments[currentIndex].type === "audio") {
        return (
          <audio className="attachment" controls>
            <source src={attachments[currentIndex].url} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        );
      }
      return null;
    };

    return (
      <div
        {...handlers}
        className="attachment-container"
        onClick={(e) => e.stopPropagation()}
      >
        {currentAttachmemnt()}
      </div>
    );
  }
);

export default AttachmentGallery;
