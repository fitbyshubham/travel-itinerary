"use client"
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { feedApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import type { FeedItem } from "@/types/feed";

export const useFeed = () => {
  const router = useRouter();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [likingIds, setLikingIds] = useState<Set<string>>(new Set());
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const isFetchingRef = useRef(false);

  const fetchFeed = useCallback(
    async (pageNum: number, isRefresh = false) => {
      if (isFetchingRef.current) return;

      // Check authentication via Store first, fallback to localStorage
      if (typeof window !== "undefined") {
        const token =
          useAuthStore.getState().token || localStorage.getItem("auth_token");
        if (!token) {
          router.replace("/login");
          return;
        }
      }

      isFetchingRef.current = true;

      try {
        if (isRefresh) {
          setIsLoading(true);
        } else {
          setIsFetchingMore(true);
        }
        setError(null);

        const data = await feedApi.getTailoredFeed(pageNum, 10);

        setItems((prev) => {
          const existingIds = new Set(isRefresh ? [] : prev.map((i) => i.id));
          const newItems = data.results.filter(
            (item) => !existingIds.has(item.id)
          );
          return isRefresh ? data.results : [...prev, ...newItems];
        });

        setHasMore(!!data.next_page);
        setPage(data.page);
      } catch (err: any) {
        console.error("Feed fetch error:", err);

        if (err.message === "SESSION_EXPIRED") {
          return;
        }

        setError(err.message || "SIGNAL_LOST // UNABLE_TO_RETRIEVE_FEED");
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
        isFetchingRef.current = false;
      }
    },
    [router]
  );

  // Initial fetch
  useEffect(() => {
    fetchFeed(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = () => {
    if (!isFetchingMore && !isLoading && hasMore && !isFetchingRef.current) {
      const nextPage = page + 1;
      fetchFeed(nextPage, false);
    }
  };

  const refresh = () => {
    setPage(1);
    fetchFeed(1, true);
  };

  const toggleLike = useCallback(async (postId: string) => {
    setLikingIds((prev) => {
      const next = new Set(prev);
      next.add(postId);
      return next;
    });

    try {
      const response = await feedApi.toggleLike(postId);

      setItems((prev) =>
        prev.map((item) => {
          if (item.id === postId) {
            const wasLiked = item.liked;
            const isLiked = response.liked;
            let newCount = item.like_count;

            if (isLiked && !wasLiked) newCount++;
            if (!isLiked && wasLiked) newCount--;

            return {
              ...item,
              liked: isLiked,
              like_count: Math.max(0, newCount),
            };
          }
          return item;
        })
      );
    } catch (err: any) {
      console.error("Failed to toggle like:", err);
      if (err.message === "SESSION_EXPIRED") return;
    } finally {
      setLikingIds((prev) => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    }
  }, []);

  const submitComment = useCallback(async (postId: string, text: string) => {
    setIsSubmittingComment(true);
    try {
      const response = await feedApi.addComment(postId, text);
      if (response.success) {
        setItems((prev) =>
          prev.map((item) => {
            if (item.id === postId) {
              return {
                ...item,
                comment_count: item.comment_count + 1,
              };
            }
            return item;
          })
        );
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Failed to post comment:", err);
      if (err.message === "SESSION_EXPIRED") throw err;
      throw err;
    } finally {
      setIsSubmittingComment(false);
    }
  }, []);

  return {
    items,
    isLoading,
    isFetchingMore,
    hasMore,
    error,
    refresh,
    loadMore,
    toggleLike,
    likingIds,
    submitComment,
    isSubmittingComment,
  };
};
