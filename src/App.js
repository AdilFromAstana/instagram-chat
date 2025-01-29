import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ChatList from "./components/ChatList/ChatList";
import ChatView from "./components/ChatView/ChatView";
import { fetchClients, fetchFolders } from "./services/api";
import "./App.css";
import socket from "./services/socketClient";
import LoginPage from "./components/Login/LoginPage";

const fetchClientsByFolder = async (folder) => {
  return await fetchClients({ folder });
};

const App = () => {
  console.log("RENDER APP");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [folders, setFolders] = useState([{ code: "new" }]);
  const [selectedFolder, setSelectedFolder] = useState(folders[0].code);
  const [isUnreadOnly, setIsUnreadOnly] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const instagramToken = localStorage.getItem("instagramToken");

  const {
    data: clients = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["clients", selectedFolder],
    queryFn: () => fetchClientsByFolder(selectedFolder),
    staleTime: 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!isLoggedIn) return;

    console.log("Fetching folders...");

    fetchFolders()
      .then(setFolders)
      .catch((error) => console.error("Error loading folders:", error));
  }, [isLoggedIn]);

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
        <ChatView
          folders={folders}
          client={selectedClient}
          onBack={() => setSelectedClient(null)}
        />
      ) : (
        <ChatList
          setIsUnreadOnly={setIsUnreadOnly}
          isUnreadOnly={isUnreadOnly}
          setSelectedFolder={setSelectedFolder}
          selectedFolder={selectedFolder}
          clients={clients}
          folders={folders}
          isLoading={isLoading}
          isError={isError}
          onSelectClient={setSelectedClient}
        />
      )}
    </div>
  );
};

export default App;
