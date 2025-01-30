import React from "react";
import "./EditClientsBottomSheet.css";

const EditClientsBottomSheet = ({
  isOpen,
  onClose,
  folders,
  onSelectFolder,
  updateClients,
  updateFolder,
  selectedFolder,
}) => {
  return (
    <div
      className={`edit-clients-bottom-sheet ${isOpen ? "open" : ""}`}
      onClick={onClose}
    >
      <div
        className="edit-clients-bottom-sheet-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Выберите папку</h3>
        <ul className="folder-list">
          {folders.map((folder) => {
            const isCurrentFolder = folder.code === selectedFolder;
            return (
              <li
                key={folder.code}
                className={`folder-item ${
                  folder.code === updateFolder ? "selected" : ""
                }`}
                style={{
                  opacity: isCurrentFolder ? 0.5 : 1,
                }}
                disabled={isCurrentFolder}
                onClick={() => !isCurrentFolder && onSelectFolder(folder.code)}
              >
                {folder.title}
                {folder.code === updateFolder && (
                  <span className="selected-icon">✔</span>
                )}
              </li>
            );
          })}
        </ul>
        <div className="edit-clients-btns">
          <button
            className={`edit-clients-btn ${!updateFolder && "cancel"}`}
            onClick={() => updateFolder && updateClients()}
          >
            Переместить
          </button>
          <button className="edit-clients-btn cancel" onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditClientsBottomSheet;
