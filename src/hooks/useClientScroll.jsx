import { useCallback, useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fetchClients } from "../services/api";

export const useClientScroll = ({ clients, selectedFolder }) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const listRef = useRef(null);
  const prevScrollHeight = useRef(0);
  const isFirstLoad = useRef(true);
  const skipScrollHandling = useRef(false);

  const handleScroll = useCallback(async () => {
    if (!hasMore || isLoading || !listRef.current || skipScrollHandling.current)
      return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;

    prevScrollHeight.current = scrollHeight;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setIsLoading(true);
      try {
        const newClients = await fetchClients({
          folder: selectedFolder,
          lastClientId: clients[clients.length - 1]?.instagram_id,
        });

        if (newClients.length === 0) {
          setHasMore(false);
        } else {
          queryClient.setQueryData(
            ["clients", selectedFolder],
            (prevClients = []) => [...prevClients, ...newClients]
          );
        }
      } catch (error) {
        console.error("Error loading more clients:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [hasMore, isLoading, selectedFolder, clients, queryClient]);

  useEffect(() => {
    setHasMore(true);
    listRef.current.scrollTop = 0;
  }, [selectedFolder]);

  useEffect(() => {
    if (listRef.current && isFirstLoad.current && clients.length > 0) {
      listRef.current.scrollTop = 0;
      isFirstLoad.current = false;
    }
  }, [clients]);

  return { listRef, handleScroll, isLoading };
};
