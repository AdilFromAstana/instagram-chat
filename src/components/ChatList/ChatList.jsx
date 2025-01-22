import React, { memo, useState, useMemo, useCallback } from "react";
import "./ChatList.css";
import { formatTime } from "../../services/formatTime";

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
