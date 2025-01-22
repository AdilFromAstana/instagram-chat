import React, { useState, useEffect } from "react";
import ChatList from "./components/ChatList/ChatList";
import ChatView from "./components/ChatView/ChatView";
import { fetchClients, fetchFolders } from "./services/api";
import "./App.css";
import socket from "./services/socketClient";
import LoginPage from "./components/Login/LoginPage";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clients, setClients] = useState([]);
  const [folders, setFolders] = useState([{ code: "new" }]);
  const [selectedFolder, setSelectedFolder] = useState(folders[0].code);
  const [isUnreadOnly, setIsUnreadOnly] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const instagramToken = localStorage.getItem("instagramToken");

  useEffect(() => {
    if (isLoggedIn) {
      const loadData = async () => {
        try {
          const [foldersData, clientsData] = await Promise.all([
            fetchFolders(),
            fetchClients(),
          ]);
          setFolders(foldersData);
          setClients(clientsData);
        } catch (error) {
          console.error("Error loading data:", error);
        }
      };

      loadData();

      const handleClientUpdate = (updatedClient) => {
        setClients((clients) =>
          clients.map((client) => {
            if (client.instagram_id === updatedClient.instagram_id) {
              if (selectedClient?.instagram_id === updatedClient.instagram_id) {
                setSelectedClient({
                  ...client,
                  lastMessage: updatedClient.lastMessage,
                  tag: updatedClient.tag,
                  note: updatedClient.note,
                  folder: updatedClient.folder,
                  isDeleted: updatedClient.isDeleted,
                });
              }
              return {
                ...client,
                lastMessage: updatedClient.lastMessage,
                tag: updatedClient.tag ?? client.tag,
                note: updatedClient.note ?? client.note,
                folder: updatedClient.folder ?? client.folder,
                isDeleted: updatedClient.isDeleted ?? client.folder,
              };
            }
            return client;
          })
        );
      };

      socket.on("clientUpdate", handleClientUpdate);

      return () => {
        socket.off("clientUpdate", handleClientUpdate);
      };
    }
  }, [isLoggedIn, selectedClient]);

  useEffect(() => {
    setIsLoggedIn(instagramToken);
  }, [instagramToken]);

  if (!isLoggedIn) {
    return <LoginPage setIsLoggedIn={setIsLoggedIn} />;
  }

  return (
    <div className="app-container">
      {selectedClient ? (
        <ChatView
          setClients={setClients}
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
          onSelectClient={setSelectedClient}
          folders={folders}
        />
      )}
    </div>
  );
};

export default App;
