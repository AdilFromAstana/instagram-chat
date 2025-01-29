import React, { memo, useState, useMemo, useCallback } from "react";
import "./ChatList.css";
import { formatTime } from "../../services/formatTime";
import ChatListHeader from "../ChatListHeader/ChatListHeader";

const ChatList = memo(
  ({
    clients,
    onSelectClient,
    folders,
    selectedFolder,
    setSelectedFolder,
    setIsUnreadOnly,
    isUnreadOnly,
  }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredClients = useMemo(() => {
      const folderFiltered = clients.filter(
        (client) =>
          !isUnreadOnly || client.lastMessage.sender_id !== "17841470770780990"
      );
      if (!searchTerm.trim()) return folderFiltered;

      return folderFiltered.filter((client) =>
        client.instagram_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [clients, selectedFolder, searchTerm, isUnreadOnly]);

    const handleSelectClient = useCallback((client) => {
      onSelectClient(client);
    }, []);

    return (
      <div className="chat-list-container">
        <ChatListHeader
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
          setIsUnreadOnly={setIsUnreadOnly}
          isUnreadOnly={isUnreadOnly}
        />
        <div className="folder-scroll">
          {folders
            .slice()
            .sort((a, b) => a.priority - b.priority)
            .map((folder) => (
              <button
                key={folder.code}
                className={`folder-button ${
                  folder.code === selectedFolder ? "active" : ""
                }`}
                onClick={() => setSelectedFolder(folder.code)}
              >
                {folder.title}
              </button>
            ))}
        </div>

        <div className="chat-list">
          {filteredClients.length === 0 ? (
            <div className="empty-list">Нет доступных чатов в этой папке.</div>
          ) : (
            <ul>
              {filteredClients.map((client) => (
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

export default React.memo(ChatList);
