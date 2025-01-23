import React, { memo, useState, useMemo, useCallback } from "react";
import "./ChatList.css";
import { formatTime } from "../../services/formatTime";
import { logout } from "../../services/api";

const ChatList = memo(
  ({ clients, onSelectClient, folders, selectedFolder, setSelectedFolder, setIsUnreadOnly, isUnreadOnly }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const filteredClients = useMemo(() => {
      const folderFiltered = clients.filter(
        (client) =>
          client.folder === selectedFolder &&
          (!isUnreadOnly || client.lastMessage.sender_id !== "17841470770780990")
      );
      if (!searchTerm.trim()) return folderFiltered;

      return folderFiltered.filter((client) =>
        client.instagram_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [clients, selectedFolder, searchTerm, isUnreadOnly]);

    const sortedClients = useMemo(() => {
      return [...filteredClients].sort((a, b) => {
        const timeA = new Date(a.lastMessage?.createdAt || 0);
        const timeB = new Date(b.lastMessage?.createdAt || 0);
        return timeB - timeA;
      });
    }, [filteredClients]);

    const handleSelectClient = useCallback(
      (client) => {
        onSelectClient(client);
      },
      [onSelectClient]
    );

    return (
      <div className="chat-list-container">
        <div className="search-bar">
          {!isSearchOpen ? (
            <div className="header">
              <span className="title">Melek CRM</span>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <button
                  className="search-button"
                  onClick={() => setIsUnreadOnly((value) => !value)}
                  title="Непрочитанные сообщения"
                >
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
                    <circle
                      cx="43"
                      cy="7"
                      r="5"
                      fill={!isUnreadOnly ? "white" : "#4caf50"}
                    />
                  </svg>
                </button>
                <button
                  className="search-button"
                  onClick={() => setIsSearchOpen(true)}
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
                <button className="search-button" onClick={logout}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                    <path d="M9 4.5H8C5.64298 4.5 4.46447 4.5 3.73223 5.23223C3 5.96447 3 7.14298 3 9.5V10M9 19.5H8C5.64298 19.5 4.46447 19.5 3.73223 18.7678C3 18.0355 3 16.857 3 14.5V14" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                    <path d="M13.6576 2.34736C11.4955 1.97026 10.4145 1.78171 9.70725 2.4087C9 3.03569 9 4.18259 9 6.4764V17.5236C9 19.8174 9 20.9643 9.70725 21.5913C10.4145 22.2183 11.4955 22.0297 13.6576 21.6526L15.9864 21.2465C18.3809 20.8288 19.5781 20.62 20.2891 19.7417C21 18.8635 21 17.5933 21 15.0529V8.94711C21 6.40672 21 5.13652 20.2891 4.25826C19.814 3.67133 19.1217 3.38338 18 3.13228" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                    <path d="M12 11V13" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Поиск по Instagram ID..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value.replace(/\D/g, ""))
                }
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
        <div className="folder-scroll">
          {folders
            .slice()
            .sort((a, b) => a.priority - b.priority)
            .map((folder) => (
              <button
                key={folder.code}
                className={`folder-button ${folder.code === selectedFolder ? "active" : ""
                  }`}
                onClick={() => setSelectedFolder(folder.code)}
              >
                {folder.title}
              </button>
            ))}
        </div>

        <div className="chat-list">
          {sortedClients.length === 0 ? (
            <div className="empty-list">Нет доступных чатов в этой папке.</div>
          ) : (
            <ul>
              {sortedClients.map((client) => (
                <li
                  key={client.instagram_id}
                  className="chat-item"
                  onClick={() => handleSelectClient(client)}
                >
                  <div className="avatar">
                    {client.instagram_id[0].toUpperCase()}
                  </div>
                  <div className="chat-info">
                    <div className="chat-name">
                      {client.name || client.instagram_id}
                    </div>
                    <div className="chat-message">
                      {client.lastMessage
                        ? client.lastMessage.attachments?.length > 0
                          ? "Медиа"
                          : client.lastMessage.content
                        : "No messages yet"}
                    </div>
                    <div className="chat-time">
                      {client.lastMessage
                        ? formatTime(client.lastMessage.createdAt)
                        : "N/A"}
                      {client.tag && (
                        <span className="chat-tag">{client.tag}</span>
                      )}
                    </div>
                  </div>
                  <div className="chat-status">
                    {client.lastMessage && !client.lastMessage.isRead && (
                      <div className="unread-indicator" title="Не прочитано" />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }
);

export default ChatList;
