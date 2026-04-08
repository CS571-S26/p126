import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AyahModal from "../components/AyahModal";

function SurahPage() {
  const { id } = useParams();
  const [surahMeta, setSurahMeta] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [bismillah, setBismillah] = useState(null);
  const [selectedAyah, setSelectedAyah] = useState(null);

  useEffect(() => {
    // Fetch Arabic text and English translation in one request
    fetch(`https://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,en.sahih,ar.alafasy`)
      .then((res) => res.json())
      .then((data) => {
        const [arabic, english, audio] = data.data;

        setSurahMeta({
          englishName: arabic.englishName,
          name: arabic.name,
        });

        // Combine Arabic, translation, and audio into a single array
        const combined = arabic.ayahs.map((ayah, i) => ({
          number: ayah.number,
          numberInSurah: ayah.numberInSurah,
          text: ayah.text,
          translation: english.ayahs[i].text,
          audio: audio.ayahs[i].audioSecondary,
        }));

        // Surahs 2–114 (except 9) have Bismillah prepended to ayah 1 — slice it off.
        const surahNumber = parseInt(id);
        if (surahNumber !== 1 && surahNumber !== 9 && combined.length > 0) {
          const clean = combined[0].text.replace(/[\u200f\u200e\ufeff\u200b]/g, "").trim();
          const words = clean.split(/\s+/);
          if (words[0].startsWith("بِسْمِ")) {
            setBismillah(words.slice(0, 4).join(" "));
            combined[0] = { ...combined[0], text: words.slice(4).join(" ") };
          }
        }

        setAyahs(combined);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!surahMeta) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="surah-header">
        <h2>{surahMeta.englishName}</h2>
        <h3>{surahMeta.name}</h3>
      </div>

      <div className="mushaf-page">
        {bismillah && <div className="bismillah">{bismillah}</div>}

        {ayahs.map((ayah) => (
          <span
            key={ayah.number}
            className="ayah-clickable"
            onClick={() => setSelectedAyah(ayah)}
          >
            {ayah.text}
            <span className="ayah-number">{ayah.numberInSurah}</span>
          </span>
        ))}
      </div>

      <AyahModal
        ayah={selectedAyah}
        onClose={() => setSelectedAyah(null)}
      />
    </div>
  );
}

export default SurahPage;
