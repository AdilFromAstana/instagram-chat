import { memo } from "react";

const ChatHeader = memo(({ onBack, client, setIsDrawerOpen }) => {
  return (
    <div className="chat-header">
      <button onClick={onBack} className="back-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          height="24"
          width="24"
          viewBox="0 0 476.213 476.213"
        >
          <polygon points="476.213,223.107 57.427,223.107 151.82,128.713 130.607,107.5 0,238.106 130.607,368.714 151.82,347.5   57.427,253.107 476.213,253.107 " />
        </svg>
      </button>
      <h2>{client.name || client.instagram_id}</h2>
      <button
        className="chat-drawer-button"
        onClick={() => {
          document.body.style.overflow = "hidden";
          setIsDrawerOpen(true);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          fill="white"
        >
          <path d="M4 6h16M4 12h16m-7 6h7" stroke="white" strokeWidth="2" />
        </svg>
      </button>
    </div>
  );
});
export default ChatHeader;
