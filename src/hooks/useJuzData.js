import { useEffect, useState } from "react";
import { fetchJuzArabic, fetchJuzTranslation } from "../lib/quran/api";
import { normalizeJuzData } from "../lib/quran/normalize";

function useJuzData(num) {
  const [surahGroups, setSurahGroups] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadJuz() {
      try {
        setLoading(true);
        setError(null);

        const [arabic, english] = await Promise.all([
          fetchJuzArabic(num),
          fetchJuzTranslation(num),
        ]);
        const groups = normalizeJuzData(arabic, english);

        if (cancelled) return;

        setSurahGroups(groups);
      } catch (err) {
        if (cancelled) return;

        console.error("Error fetching Juz data:", err);
        setError(err.message || "Failed to load Juz. Please try again.");
        setSurahGroups(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadJuz();

    return () => {
      cancelled = true;
    };
  }, [num]);

  return { surahGroups, loading, error };
}

export default useJuzData;
