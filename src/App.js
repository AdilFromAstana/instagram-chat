import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  console.log("REDNER")
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("instagramToken"));
  const queryClient = useQueryClient();

  const {
    data: fetchedFolders = [{ code: "new" }],
    isLoading: isFoldersLoading,
    isError: isFoldersError,
  } = useQuery({
    queryKey: ["folders"],
    queryFn: fetchFolders,
    staleTime: 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    enabled: isLoggedIn,
    suspense: true,
  });

  const folders = fetchedFolders || [{ code: "new" }];

  const [selectedFolder, setSelectedFolder] = useState(() =>
    folders.length > 0 ? folders[0].code : "new"
  );

  const [isUnreadOnly, setIsUnreadOnly] = useState(false);
  const [selectedClient, setSelectedClient] = useState(() => null);

  const handleSelectClient = useCallback((client) => {
    setSelectedClient(client);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    const handleClientUpdate = (updatedClient) => {
      queryClient.setQueryData(["clients", selectedFolder], (oldClients) => {
        console.log("oldClients: ", oldClients);
        if (!oldClients || !oldClients.pages) return oldClients; // Если данных нет, возвращаем как есть
        return {
          ...oldClients, // Сохраняем остальные свойства (например, `pageParams`)
          pages: oldClients.pages.map((page) =>
            page.map((client_) =>
              client_.instagram_id === updatedClient.instagram_id
                ? { ...client_, lastMessage: updatedClient.lastMessage }
                : client_
            )
          ),
        };
      });

      handleSelectClient((prev) =>
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

  if (!isLoggedIn) {
    return <LoginPage setIsLoggedIn={setIsLoggedIn} />;
  }

  return (
    <div className="app-container">
      {selectedClient ? (
        <Chat
          folders={folders}
          client={selectedClient}
          setSelectedClient={handleSelectClient}
        />
      ) : (
        <Main
          setIsUnreadOnly={setIsUnreadOnly}
          isUnreadOnly={isUnreadOnly}
          setSelectedFolder={setSelectedFolder}
          selectedFolder={selectedFolder}
          folders={folders}
          onSelectClient={handleSelectClient}
          isFoldersLoading={isFoldersLoading}
          isFoldersError={isFoldersError}
        />
      )}
    </div>
  );
}

export default App;
