import { useEffect, useState } from "react";
import { fetchPageArabic, fetchPageAudio, fetchPageTranslation } from "../lib/quran/api";
import { normalizePageData } from "../lib/quran/normalize";

function usePageData(pageNum) {
  const [surahGroups, setSurahGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPage() {
      try {
        setLoading(true);
        setError(null);

        const [arabic, english, audio] = await Promise.all([
          fetchPageArabic(pageNum),
          fetchPageTranslation(pageNum),
          fetchPageAudio(pageNum),
        ]);
        const groups = normalizePageData(arabic, english, audio);

        if (cancelled) return;

        setSurahGroups(groups);
      } catch (err) {
        if (cancelled) return;

        console.error(err);
        setError(err.message || "Failed to load page.");
        setSurahGroups([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPage();

    return () => {
      cancelled = true;
    };
  }, [pageNum]);

  return { surahGroups, loading, error };
}

export default usePageData;
