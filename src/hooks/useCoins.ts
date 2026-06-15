import { useState, useEffect, useCallback, useRef } from "react";
import type { Coin } from "../types";
import { fetchCoins } from "../api";

export function useCoins() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const totalPages = pageRef.current;
      const results = await Promise.all(
        Array.from({ length: totalPages }, (_, i) => fetchCoins(i + 1)),
      );
      setCoins(results.flat());
      setHasMore(results[totalPages - 1].length === 50);
    } catch {
      setError("Failed to load coins. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, [load]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = pageRef.current + 1;
      const data = await fetchCoins(nextPage);
      setCoins((prev) => [...prev, ...data]);
      pageRef.current = nextPage;
      setPage(nextPage);
      setHasMore(data.length === 50);
    } catch {
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore]);

  return { coins, loading, loadingMore, error, retry: load, loadMore, hasMore, page };
}
