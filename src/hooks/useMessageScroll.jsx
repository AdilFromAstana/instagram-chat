import { useCallback, useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fetchDialogueMessages } from "../services/api";

export const useMessageScroll = ({ messages, chatRoomId, myId }) => {
  const queryClient = useQueryClient(); // Доступ к React Query кешу
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const listRef = useRef(null);
  const prevScrollHeight = useRef(0); // Храним высоту перед обновлением данных
  const isFirstLoad = useRef(true); // Флаг для первой загрузки
  const skipScrollHandling = useRef(false); // Флаг для пропуска скролла

  const handleScroll = useCallback(async () => {
    if (!hasMore || isLoading || !listRef.current || skipScrollHandling.current)
      return;

    prevScrollHeight.current = listRef.current.scrollHeight;

    if (listRef.current.scrollTop === 0) {
      setIsLoading(true);
      try {
        const olderMessages = await fetchDialogueMessages(
          chatRoomId,
          myId,
          messages[0]?._id
        );

        if (olderMessages.length === 0) {
          setHasMore(false);
        } else {
          queryClient.setQueryData(
            ["messages", chatRoomId],
            (prevMessages = []) => [...olderMessages, ...prevMessages]
          );
        }
      } catch (error) {
        console.error("Error loading older messages:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [hasMore, isLoading, chatRoomId, myId, messages, queryClient]);

  useEffect(() => {
    if (listRef.current && isFirstLoad.current && messages.length > 0) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
      isFirstLoad.current = false;
    }
  }, [messages]);

  useEffect(() => {
    if (listRef.current && !isLoading) {
      const current = listRef.current;
      const previousScrollHeight = prevScrollHeight.current;
      const newScrollHeight = current.scrollHeight;

      if (!skipScrollHandling.current) {
        const scrollOffset =
          newScrollHeight - previousScrollHeight + current.scrollTop;
        current.scrollTop = scrollOffset;
      }
    }
  }, [messages, isLoading]);

  return { listRef, handleScroll, isLoading, hasMore, skipScrollHandling };
};
