import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Main from "./components/Main/Main";
import Chat from "./components/Chat/Chat";
import LoginPage from "./components/Login/LoginPage";
import { fetchClients, fetchFolders } from "./services/api";
import "./App.css";
import socket from "./services/socketClient";

const fetchClientsByFolder = async (folder) => {
  return await fetchClients({ folder });
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [folders, setFolders] = useState([{ code: "new" }]);
  const [selectedFolder, setSelectedFolder] = useState(folders[0].code);
  const [isUnreadOnly, setIsUnreadOnly] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const instagramToken = localStorage.getItem("instagramToken");

  const {
    data: fetchedFolders = [],
    isLoading: isFoldersLoading,
    isError: isFoldersError,
  } = useQuery({
    queryKey: ["folders"],
    queryFn: fetchFolders,
    staleTime: 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    enabled: isLoggedIn,
  });

  useEffect(() => {
    if (fetchedFolders.length > 0) {
      setFolders(fetchedFolders);
    }
  }, [fetchedFolders]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const handleClientUpdate = (updatedClient) => {
      setSelectedClient((prev) =>
        prev?.instagram_id === updatedClient.instagram_id
          ? { ...prev, ...updatedClient }
          : prev
      );
    };

    socket.on("clientUpdate", handleClientUpdate);

    return () => {
      socket.off("clientUpdate", handleClientUpdate);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (instagramToken && !isLoggedIn) {
      setIsLoggedIn(true);
    }
  }, [instagramToken, isLoggedIn]);

  if (!isLoggedIn) {
    return <LoginPage setIsLoggedIn={setIsLoggedIn} />;
  }

  return (
    <div className="app-container">
      {selectedClient ? (
        <Chat
          folders={folders}
          client={selectedClient}
          onBack={() => setSelectedClient(null)}
        />
      ) : (
        <Main
          setIsUnreadOnly={setIsUnreadOnly}
          isUnreadOnly={isUnreadOnly}
          setSelectedFolder={setSelectedFolder}
          selectedFolder={selectedFolder}
          folders={folders}
          onSelectClient={setSelectedClient}
          isFoldersLoading={isFoldersLoading}
          isFoldersError={isFoldersError}
        />
      )}
    </div>
  );
};

export default App;
