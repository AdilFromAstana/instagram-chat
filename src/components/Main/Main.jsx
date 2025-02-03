import React, { memo, useState } from "react";
import "./Main.css";
import MainFolders from "./Components/MainFolders/MainFolders";
import MainHeader from "./Components/MainHeader/MainHeader";
import Clients from "./Components/Clients/Clients";

const Main = memo(
  ({
    clients,
    onSelectClient,
    folders,
    selectedFolder,
    setSelectedFolder,
    setIsUnreadOnly,
    isUnreadOnly,
    isFoldersError,
    isFoldersLoading,
  }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    // const filteredClients = useMemo(() => {
    //   const folderFiltered = clients.filter(
    //     (client) =>
    //       !isUnreadOnly || client.lastMessage.sender_id !== "17841470770780990"
    //   );
    //   if (!searchTerm.trim()) return folderFiltered;

    //   return folderFiltered.filter((client) =>
    //     client.instagram_id.toLowerCase().includes(searchTerm.toLowerCase())
    //   );
    // }, [clients, searchTerm, isUnreadOnly]);

    return (
      <div className="chat-list-container">
        <MainHeader
          setIsSelectionMode={setIsSelectionMode}
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
          setIsUnreadOnly={setIsUnreadOnly}
          isUnreadOnly={isUnreadOnly}
          isSelectionMode={isSelectionMode}
        />
        <MainFolders
          isUnreadOnly={isUnreadOnly}
          isSelectionMode={isSelectionMode}
          isFoldersLoading={isFoldersLoading}
          isFoldersError={isFoldersError}
          folders={folders}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
        />

        <Clients
          isUnreadOnly={isUnreadOnly}
          setIsSelectionMode={setIsSelectionMode}
          folders={folders}
          onSelectClient={onSelectClient}
          isSelectionMode={isSelectionMode}
          selectedFolder={selectedFolder}
        />
      </div>
    );
  }
);

export default React.memo(Main);
