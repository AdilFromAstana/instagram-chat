import { useCallback, useState, useRef, useEffect } from "react";
import { fetchDialogueMessages } from "../services/api";

export const useMessageScroll = (messages, setMessages, chatRoomId, myId) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const listRef = useRef(null);
  const prevScrollHeight = useRef(0); // Хранение высоты скролла до изменения данных
  const isFirstLoad = useRef(true); // Флаг, чтобы обработать первую загрузку
  const skipScrollHandling = useRef(false); // Флаг для пропуска обработки скролла

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
          setMessages((prevMessages) => [...olderMessages, ...prevMessages]);
        }
      } catch (error) {
        console.error("Error loading older messages:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [hasMore, isLoading, chatRoomId, myId, messages, setMessages]);

  useEffect(() => {
    if (listRef.current && isFirstLoad.current && messages.length > 0) {
      const current = listRef.current;
      current.scrollTop = current.scrollHeight; // Прокрутка в самый низ
      isFirstLoad.current = false; // Убираем флаг после первой загрузки
    }
  }, [messages]);

  useEffect(() => {
    if (listRef.current && !isLoading) {
      const current = listRef.current;
      const previousScrollHeight = prevScrollHeight.current;
      const newScrollHeight = current.scrollHeight;

      // Сохраняем текущую позицию относительно новой высоты
      if (!skipScrollHandling.current) {
        const scrollOffset =
          newScrollHeight - previousScrollHeight + current.scrollTop;
        current.scrollTop = scrollOffset;
      }
    }
  }, [messages, isLoading]);

  return { listRef, handleScroll, isLoading, hasMore, skipScrollHandling };
};
