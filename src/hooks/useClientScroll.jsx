import { useCallback, useState, useRef, useEffect } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { fetchClients } from "../services/api";
import { io } from "socket.io-client";

export const useClientScroll = ({ selectedFolder }) => {
  const queryClient = useQueryClient();
  const listRef = useRef(null);
  const prevScrollHeight = useRef(0);
  const isFirstLoad = useRef(true);
  const [isLoading, setIsLoading] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["clients", selectedFolder],
    queryFn: ({ pageParam = null }) =>
      fetchClients({ folder: selectedFolder, lastClientId: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.length > 0 ? lastPage[lastPage.length - 1].instagram_id : null, // Берём ID последнего клиента
    refetchOnWindowFocus: false,
  });

  const allClients = data?.pages.flat() || [];

  useEffect(() => {
    const socket = io("wss://www.melek-crm.kz", {
      path: "/socket.io/",
      transports: ["websocket"],
    });

    socket.on("new_client", (newClient) => {
      queryClient.setQueryData(["clients", selectedFolder], (oldData = { pages: [] }) => ({
        ...oldData,
        pages: [...oldData.pages, [newClient]], // Добавляем нового клиента в конец списка
      }));
    });

    return () => socket.close();
  }, [queryClient, selectedFolder]);

  const handleScroll = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage || !listRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    prevScrollHeight.current = scrollHeight;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setIsLoading(true);
      try {
        await fetchNextPage();
      } catch (error) {
        console.error("Error fetching more clients:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
    isFirstLoad.current = true;
  }, [selectedFolder]);

  useEffect(() => {
    if (listRef.current && isFirstLoad.current && allClients.length > 0) {
      listRef.current.scrollTop = 0;
      isFirstLoad.current = false;
    }
  }, [allClients]);

  return { listRef, handleScroll, isLoading, hasNextPage, allClients };
};
