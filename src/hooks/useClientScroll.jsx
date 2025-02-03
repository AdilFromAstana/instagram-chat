import { useCallback, useState, useRef, useEffect } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { fetchClients } from "../services/api";
import { io } from "socket.io-client";

export const useClientScroll = ({ selectedFolder, clientsListRef, isUnreadOnly }) => {
  const queryClient = useQueryClient();
  const listRef = useRef(null);
  const lastFetchedClientId = useRef(null);
  const isFirstLoad = useRef(true);
  const [isLoading, setIsLoading] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["clients", selectedFolder], // ❌ Убрали isUnreadOnly из key
    queryFn: async ({ pageParam = null }) => {
      return fetchClients({ folder: selectedFolder, lastClientId: pageParam }); // ❌ Убрали isUnreadOnly из запроса
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length === 0) {
        return null;
      }
      return lastPage[lastPage.length - 1].instagram_id;
    },
    refetchOnWindowFocus: false,
  });

  const allClients = (data?.pages.flat() || []).filter(client =>
    isUnreadOnly ? !client.isRead : true
  );

  useEffect(() => {
    const socket = io("wss://www.melek-crm.kz", {
      path: "/socket.io/",
      transports: ["websocket"],
    });

    socket.on("new_client", (newClient) => {
      queryClient.setQueryData(["clients", selectedFolder], (oldData = { pages: [] }) => ({
        ...oldData,
        pages: [[newClient], ...oldData.pages],
      }));
    });

    return () => socket.close();
  }, [queryClient, selectedFolder]);

  const handleScroll = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage || !listRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setIsLoading(true);
      try {
        await fetchNextPage();
      } catch (error) {
        console.error("❌ Ошибка загрузки клиентов:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


  useEffect(() => {
    if (!clientsListRef?.current || !isUnreadOnly) return;

    const loadMoreIfNeeded = async () => {
      while (true) {
        const ulElement = clientsListRef.current;
        if (!ulElement) return;

        const { scrollHeight } = ulElement;
        const { clientHeight } = listRef.current || {};

        const queryState = queryClient.getQueryState(["clients", selectedFolder]);
        const realHasNextPage = queryState?.data?.pages?.length
          ? queryState.data.pages[queryState.data.pages.length - 1]?.length > 0
          : false;
        if (!realHasNextPage) {
          break; // ⛔ Выходим из цикла
        }

        if (scrollHeight > clientHeight) {
          return;
        }

        const lastClientId = allClients.length > 0 ? allClients[allClients.length - 1].instagram_id : null;

        lastFetchedClientId.current = lastClientId;
        setIsLoading(true);

        try {
          await fetchNextPage();
        } catch (error) {
          console.error("❌ Ошибка загрузки клиентов:", error);
          return;
        } finally {
          setIsLoading(false);
        }

        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
    };

    loadMoreIfNeeded();
  }, [clientsListRef?.current, isUnreadOnly, hasNextPage]); // 👈 hasNextPage теперь влияет на `useEffect`

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
    isFirstLoad.current = true;
  }, [selectedFolder]);

  return { listRef, handleScroll, isLoading, hasNextPage, allClients };
};
