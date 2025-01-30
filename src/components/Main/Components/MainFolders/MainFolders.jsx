import { memo } from "react";

const MainFolders = memo(
  ({
    folders,
    selectedFolder,
    setSelectedFolder,
    isFoldersError,
    isFoldersLoading,
    isSelectionMode,
  }) => {
    if (isFoldersLoading) {
      return (
        <div className="folder-scroll">
          {Array.from({ length: 3 }).map((_, index) => (
            <button key={index} className="folder-button-skeleton">
              Loading...
            </button>
          ))}
        </div>
      );
    }
    return (
      <div className="folder-scroll">
        {folders.slice().map((folder) => {
          const isSelectedFolder = folder.code === selectedFolder;
          return (
            <button
              key={folder.code}
              className={`folder-button ${isSelectedFolder ? "active" : ""}
              `}
              style={{
                opacity: isSelectionMode ? (isSelectedFolder ? 1 : 0.5) : 1,
              }}
              onClick={() => !isSelectionMode && setSelectedFolder(folder.code)}
            >
              {folder.title}
            </button>
          );
        })}
      </div>
    );
  }
);

export default MainFolders;
