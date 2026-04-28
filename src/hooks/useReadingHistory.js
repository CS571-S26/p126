import { useState, useCallback } from "react";

const MAX_HISTORY = 5;
const HISTORY_KEY = "quran-last-visited";
const BOOKMARKS_KEY = "quran-bookmarks";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export default function useReadingHistory() {
  const [lastVisited, setLastVisited] = useState(() => readJSON(HISTORY_KEY, []));
  const [bookmarks, setBookmarks] = useState(() => readJSON(BOOKMARKS_KEY, []));

  const recordVisit = useCallback((entry) => {
    setLastVisited((prev) => {
      const filtered = prev.filter((e) => e.path !== entry.path);
      const next = [{ ...entry, timestamp: Date.now() }, ...filtered].slice(0, MAX_HISTORY);
      writeJSON(HISTORY_KEY, next);
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (path) => bookmarks.some((b) => b.path === path),
    [bookmarks]
  );

  const toggleBookmark = useCallback((entry) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.path === entry.path);
      const next = exists
        ? prev.filter((b) => b.path !== entry.path)
        : [{ ...entry, timestamp: Date.now() }, ...prev];
      writeJSON(BOOKMARKS_KEY, next);
      return next;
    });
  }, []);

  return { lastVisited, bookmarks, recordVisit, isBookmarked, toggleBookmark };
}