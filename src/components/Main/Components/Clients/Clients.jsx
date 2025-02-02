import { memo, useCallback, useEffect, useRef, useState } from "react";
import EditClientsBottomSheet from "../EditClientsBottomSheet/EditClientsBottomSheet";
import { useClientScroll } from "../../../../hooks/useClientScroll";
import { formatTime } from "../../../../services/formatTime";
import { updateClientsFolder } from "../../../../services/api";
import { useQueryClient } from "@tanstack/react-query";

const Clients = memo(
  ({
    setIsSelectionMode,
    folders,
    onSelectClient,
    isSelectionMode,
    selectedFolder,
  }) => {
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [selectedClients, setSelectedClients] = useState([]);
    const [updateFolder, setUpdateFolder] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const cleintsListRef = useRef();
    const queryClient = useQueryClient();
    const { listRef, handleScroll, isFetchingNextPage, allClients } = useClientScroll({
      selectedFolder,
    });

    const onClientSelect = (client) => {
      isSelectionMode ? toggleSelectClient(client) : handleSelectClient(client);
    };

    const handleScrollWithSave = (event) => {
      handleScroll(event);
    };

    const toggleSelectClient = useCallback((client) => {
      setSelectedClients((prev) =>
        prev.includes(client.instagram_id)
          ? prev.filter((id) => id !== client.instagram_id)
          : [...prev, client.instagram_id]
      );
    }, []);

    const handleSelectClient = useCallback((client) => {
      onSelectClient(client);
    }, []);

    const handleMoveClients = () => {
      setIsBottomSheetOpen(true);
    };

    const updateClients = async () => {
      try {
        await updateClientsFolder(selectedClients, updateFolder);
        setSuccessMessage("Клиенты обновились!");
        setSelectedClients([]);
        setIsSelectionMode(false);
        setIsBottomSheetOpen(false);

        queryClient.invalidateQueries(["clients", selectedFolder]);
        queryClient.invalidateQueries(["clients", updateFolder]);
      } catch (e) {
        console.error(e);
        setErrorMessage("Произошла ошибка при сохранении изменений.");
      } finally {
      }
    };

    useEffect(() => {
      if (successMessage || errorMessage) {
        const timer = setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
        }, 5000);

        return () => clearTimeout(timer);
      }
    }, [successMessage, errorMessage]);

    return (
      <>
        <div
          className="chat-list"
          ref={listRef}
          onScroll={handleScrollWithSave}
        >
          {allClients.length === 0 ? (
            <div className="empty-list">Нет доступных чатов в этой папке.</div>
          ) : (
            <ul ref={cleintsListRef}>
              {/* {isFetching && (
                <div className="loading-overlay">
                  <div className="spinner"></div>
                </div>)} */}
              {allClients.map((client) => (
                <li
                  key={client.instagram_id}
                  className="chat-item"
                  onClick={() => onClientSelect(client)}
                >
                  {isSelectionMode && (
                    <input
                      type="checkbox"
                      checked={selectedClients.includes(client.instagram_id)}
                      onChange={() => toggleSelectClient(client)}
                      className="chat-checkbox"
                    />
                  )}
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
                  {client.lastMessage && !client.lastMessage.isRead && (
                    <div className="unread-indicator" title="Не прочитано" />
                  )}
                </li>
              ))}
              {isFetchingNextPage && (
                <div className="loading-overlay">
                  <div className="spinner" style={{ margin: "10px" }}></div>
                </div>
              )}
            </ul>
          )}
        </div>

        {successMessage && (
          <div className="success-message">
            {successMessage}
            <div className="success-bar" />
          </div>
        )}
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
            <div className="error-bar" />
          </div>
        )}

        {isSelectionMode && (
          <div className="selection-footer">
            <span>{selectedClients.length} выбрано</span>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className={`selection-footer-button ${selectedClients.length === 0 && "disabled"
                  }`}
                onClick={() =>
                  selectedClients.length > 0 && handleMoveClients()
                }
              >
                Переместить в папку
              </button>
              <button
                className="selection-footer-button cancel"
                onClick={() => setIsSelectionMode(false)}
              >
                Отменить
              </button>
            </div>
          </div>
        )}

        <EditClientsBottomSheet
          updateFolder={updateFolder}
          selectedFolder={selectedFolder}
          updateClients={updateClients}
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          folders={folders}
          onSelectFolder={setUpdateFolder}
        />
      </>
    );
  }
);

export default Clients;
