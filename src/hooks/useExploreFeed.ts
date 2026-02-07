import { useState, useEffect, useCallback, useRef } from "react";
import { feedApi } from "@/lib/api";
import type { FeedItem } from "@/types/feed";

export const useExploreFeed = () => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingRef = useRef(false);

  const fetchFeed = useCallback(async (pageNum: number, isRefresh = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      if (isRefresh) {
        setIsLoading(true);
      }
      setError(null);

      // Call the discover-feed endpoint
      const data = await feedApi.discoverFeed(pageNum, 10);

      // Frontend Filter: Only keep items that have at least one upload of type 'video'
      const videoOnlyItems = data.results.filter(
        (item) =>
          item.uploads &&
          item.uploads.some((upload) => upload.type === "video"),
      );

      setItems((prev) => {
        // Deduplicate items based on ID
        const existingIds = new Set(isRefresh ? [] : prev.map((i) => i.id));
        const newItems = videoOnlyItems.filter(
          (item) => !existingIds.has(item.id),
        );
        return isRefresh ? videoOnlyItems : [...prev, ...newItems];
      });

      setHasMore(!!data.next_page);
      setPage(data.page);
    } catch (err: any) {
      console.error("Explore feed fetch error:", err);
      setError(err.message || "FAILED_TO_LOAD_DISCOVER_FEED");
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchFeed(1, true);
  }, [fetchFeed]);

  const loadMore = () => {
    if (!isLoading && hasMore && !isFetchingRef.current) {
      const nextPage = page + 1;
      fetchFeed(nextPage, false);
    }
  };

  return {
    items,
    isLoading,
    hasMore,
    error,
    loadMore,
    refresh: () => fetchFeed(1, true),
  };
};
