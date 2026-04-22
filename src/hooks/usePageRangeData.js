import { useEffect, useState } from "react";
import { fetchPageArabic, fetchPageAudio, fetchPageTranslation } from "../lib/quran/api";
import { normalizePageData } from "../lib/quran/normalize";

const TOTAL_PAGES = 604;

function usePageRangeData(startPage, count) {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!startPage || !count || count <= 0) return;

    let cancelled = false;

    async function loadPages() {
      setLoading(true);
      setError(null);

      try {
        const end = Math.min(startPage + count - 1, TOTAL_PAGES);
        const pageNums = Array.from({ length: end - startPage + 1 }, (_, i) => startPage + i);

        const BATCH_SIZE = 5;
        const results = [];

        for (let i = 0; i < pageNums.length; i += BATCH_SIZE) {
          if (cancelled) return;
          const batch = pageNums.slice(i, i + BATCH_SIZE);
          const batchResults = await Promise.all(
            batch.map(async (pNum) => {
              const [arabic, english, audio] = await Promise.all([
                fetchPageArabic(pNum),
                fetchPageTranslation(pNum),
                fetchPageAudio(pNum),
              ]);
              return { pageNum: pNum, surahGroups: normalizePageData(arabic, english, audio) };
            })
          );
          results.push(...batchResults);
        }

        if (!cancelled) setPages(results);
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError(err.message || "Failed to load pages.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPages();
    return () => { cancelled = true; };
  }, [startPage, count]);

  return { pages, loading, error };
}

export default usePageRangeData;
