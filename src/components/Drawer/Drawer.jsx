import React, { useEffect, useState } from "react";
import "./Drawer.css";
import {
  updateClientFolder,
  updateClientNote,
  updateClientTag,
} from "../../services/api";

const Drawer = ({ isOpen, onClose, folders, client }) => {
  const [selectedFolder, setSelectedFolder] = useState(client.folder);
  const [tag, setTag] = useState(client.tag);
  const [note, setNote] = useState(client.note);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmitFolder = async (folderCode) => {
    if (folderCode !== selectedFolder) {
      setIsSubmitting(true);
      setSelectedFolder(folderCode);

      try {
        await updateClientFolder(client.instagram_id, folderCode);
        setSuccessMessage("Изменения успешно сохранены!");
      } catch (error) {
        setErrorMessage("Произошла ошибка при сохранении изменений.");
        setSelectedFolder(client.folder);
        console.error("Error saving folder:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSubmitTag = async () => {
    setIsSubmitting(true);
    try {
      await updateClientTag(client.instagram_id, tag);
      setSuccessMessage("Тег успешно изменен!");
    } catch (error) {
      setErrorMessage("Произошла ошибка при сохранении изменений.");
      setTag(client.tag);
      console.error("Error saving tag:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitNote = async () => {
    setIsSubmitting(true);
    try {
      await updateClientNote(client.instagram_id, note);
      setSuccessMessage("Заметка успешно изменена!");
    } catch (error) {
      setErrorMessage("Произошла ошибка при сохранении изменений.");
      setTag(client.tag);
      console.error("Error saving tag:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 5000); // Сообщения исчезают через 5 секунд

      return () => clearTimeout(timer); // Очистка таймера при размонтировании
    }
  }, [successMessage, errorMessage]);

  return (
    <>
      <div
        className={`drawer-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />
      <div className={`drawer ${isOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <h2 className="drawer-title">Manage Folders</h2>
          <button className="drawer-close" onClick={onClose}>
            ✕
          </button>
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

        <h3>Папка</h3>
        <ul className="folder-list">
          {folders.map((folder) => (
            <li
              key={folder.code}
              className={`folder-item ${
                folder.code === selectedFolder ? "selected" : ""
              }`}
              disabled={folder.code === selectedFolder}
              onClick={() => handleSubmitFolder(folder.code)}
            >
              {folder.title}
              {folder.code === selectedFolder && (
                <span className="selected-icon">✔</span>
              )}
            </li>
          ))}
        </ul>

        <h3>Тег</h3>
        <div className="tag-input-container">
          <input
            disabled={isSubmitting}
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Добавить тег"
            className="tag-input"
          />
          <button
            onClick={handleSubmitTag}
            className="add-tag-button"
            disabled={tag === client.tag}
          >
            Добавить
          </button>
        </div>

        <h3>Заметка</h3>
        <div className="tag-input-container">
          <input
            disabled={isSubmitting}
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Добавить заметку"
            className="tag-input"
          />
          <button
            onClick={handleSubmitNote}
            className="add-tag-button"
            // disabled={note === client.note}
          >
            Добавить
          </button>
        </div>
      </div>
    </>
  );
};

export default Drawer;
