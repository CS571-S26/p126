import { useEffect, useState } from "react";
import { fetchSurahEditions } from "../lib/quran/api";
import { normalizeSurahData } from "../lib/quran/normalize";

function useSurahData(id) {
  const [surahMeta, setSurahMeta] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [pages, setPages] = useState([]);
  const [bismillah, setBismillah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSurah() {
      try {
        setLoading(true);
        setError(null);

        const editions = await fetchSurahEditions(id);
        const normalized = normalizeSurahData(editions, id);

        if (cancelled) return;

        setSurahMeta(normalized.surahMeta);
        setAyahs(normalized.ayahs);
        setPages(normalized.pages);
        setBismillah(normalized.bismillah);
      } catch (err) {
        if (cancelled) return;

        console.error(err);
        setError(err.message || "Failed to load surah.");
        setSurahMeta(null);
        setAyahs([]);
        setPages([]);
        setBismillah(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSurah();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { surahMeta, ayahs, pages, bismillah, loading, error };
}

export default useSurahData;
