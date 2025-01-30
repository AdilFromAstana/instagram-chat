import { memo, useState } from "react";
import { logout } from "../../../../services/api";

const UnreadMessageIcon = memo(({ isUnreadOnly }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 48 48"
      fill="none"
    >
      <path
        d="M44 16V36H29L24 41L19 36H4V6H34"
        stroke={!isUnreadOnly ? "white" : "#4caf50"}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 20H25.0025"
        stroke={!isUnreadOnly ? "white" : "#4caf50"}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M33.0011 20H35"
        stroke={!isUnreadOnly ? "white" : "#4caf50"}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M13.001 20H14.9999"
        stroke={!isUnreadOnly ? "white" : "#4caf50"}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="43" cy="7" r="5" fill={!isUnreadOnly ? "white" : "#4caf50"} />
    </svg>
  );
});

const LogoutIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M9 4.5H8C5.64298 4.5 4.46447 4.5 3.73223 5.23223C3 5.96447 3 7.14298 3 9.5V10M9 19.5H8C5.64298 19.5 4.46447 19.5 3.73223 18.7678C3 18.0355 3 16.857 3 14.5V14"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M13.6576 2.34736C11.4955 1.97026 10.4145 1.78171 9.70725 2.4087C9 3.03569 9 4.18259 9 6.4764V17.5236C9 19.8174 9 20.9643 9.70725 21.5913C10.4145 22.2183 11.4955 22.0297 13.6576 21.6526L15.9864 21.2465C18.3809 20.8288 19.5781 20.62 20.2891 19.7417C21 18.8635 21 17.5933 21 15.0529V8.94711C21 6.40672 21 5.13652 20.2891 4.25826C19.814 3.67133 19.1217 3.38338 18 3.13228"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 11V13"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

const MainHeader = memo(
  ({
    setSearchTerm,
    searchTerm,
    setIsUnreadOnly,
    isUnreadOnly,
    setIsSelectionMode,
    isSelectionMode,
  }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
      <div className="search-bar">
        {!isSearchOpen ? (
          <div className="header">
            <span className="title">Melek CRM</span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <button
                className="search-button"
                onClick={() =>
                  !isSelectionMode && setIsUnreadOnly((value) => !value)
                }
                style={{ opacity: isSelectionMode ? 0.5 : 1 }}
                title="Непрочитанные сообщения"
              >
                <UnreadMessageIcon isUnreadOnly={isUnreadOnly} />
              </button>
              <button
                className="search-button"
                onClick={() => setIsSelectionMode(!isSelectionMode)}
              >
                <svg
                  fill="none"
                  height="24"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button
                style={{ opacity: isSelectionMode ? 0.5 : 1 }}
                className="search-button"
                onClick={() => !isSelectionMode && setIsSearchOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="white"
                >
                  <path d="M10 2a8 8 0 105.293 14.707l5.5 5.5 1.414-1.414-5.5-5.5A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4z"></path>
                </svg>
              </button>
              <button
                style={{ opacity: isSelectionMode ? 0.5 : 1 }}
                className="search-button"
                onClick={() => !isSelectionMode && logout}
              >
                <LogoutIcon />
              </button>
            </div>
          </div>
        ) : (
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Поиск по Instagram ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.replace(/\D/g, ""))}
              className="search-input"
            />
            <button
              className="close-button"
              onClick={() => {
                setSearchTerm("");
                setIsSearchOpen(false);
              }}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    );
  }
);

export default MainHeader;
