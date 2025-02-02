import { useCallback, useRef, useEffect } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { fetchDialogueMessages } from "../services/api";

export const useMessageScroll = ({ chatRoomId, myId }) => {
  const queryClient = useQueryClient();
  const listRef = useRef(null);
  const prevScrollHeight = useRef(0);
  const isFirstLoad = useRef(true);
  const skipScrollHandling = useRef(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching
  } = useInfiniteQuery({
    queryKey: ["messages", chatRoomId],
    queryFn: ({ pageParam = null }) => fetchDialogueMessages(chatRoomId, myId, pageParam),
    getNextPageParam: (lastPage) => lastPage.length > 0 ? lastPage[0]._id : null,
    refetchOnWindowFocus: false,
  });

  const messages = data?.pages.flat() || [];

  const handleScroll = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage || !listRef.current) return;

    prevScrollHeight.current = listRef.current.scrollHeight;

    if (listRef.current.scrollTop === 0) {
      await fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (listRef.current && isFirstLoad.current && messages.length > 0) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
      isFirstLoad.current = false;
    }
  }, [messages]);

  useEffect(() => {
    if (listRef.current && !isFetchingNextPage) {
      const current = listRef.current;
      const previousScrollHeight = prevScrollHeight.current;
      const newScrollHeight = current.scrollHeight;

      if (!skipScrollHandling.current) {
        const scrollOffset =
          newScrollHeight - previousScrollHeight + current.scrollTop;
        current.scrollTop = scrollOffset;
      }
    }
  }, [messages, isFetchingNextPage]);

  return {
    listRef,
    handleScroll,
    isFetchingNextPage,
    hasNextPage,
    messages, // Возвращаем сообщения, так как они теперь внутри хука
    isFetching
  };
};
