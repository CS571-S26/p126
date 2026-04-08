import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AyahModal from "../components/AyahModal";

function SurahPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [surahMeta, setSurahMeta] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [bismillah, setBismillah] = useState(null);
  const [selectedAyah, setSelectedAyah] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    // Fetch Arabic text and English translation in one request
    fetch(`https://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,en.sahih,ar.alafasy`)
      .then((res) => res.json())
      .then((data) => {
        const [arabic, english, audio] = data.data;

        setSurahMeta({
          englishName: arabic.englishName,
          englishNameTranslation: arabic.englishNameTranslation,
          name: arabic.name,
          numberOfAyahs: arabic.numberOfAyahs,
          revelationType: arabic.revelationType,
        });

        // Combine Arabic, translation, and audio into a single array
        const combined = arabic.ayahs.map((ayah, i) => ({
          number: ayah.number,
          numberInSurah: ayah.numberInSurah,
          page: ayah.page,
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
<<<<<<< HEAD
      <div className="surah-header">
        <h2>{surahMeta.englishName}</h2>
        <h3>{surahMeta.name}</h3>
      </div>
=======
      <nav className="surah-nav">
        <button className="surah-nav-back" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
        <div className="surah-nav-title">
          <div className="surah-nav-english">{surahMeta.name.split(" ").slice(1).join(" ")}</div>
          <div className="surah-nav-translation">{surahMeta.englishName}</div>
        </div>
        <button
          className="translation-toggle"
          onClick={() => setShowTranslation((t) => !t)}
        >
          {showTranslation ? "Hide Translation" : "Show Translation"}
        </button>
      </nav>
>>>>>>> 18abb10 (reorganize based on pages in surahs. add sticky nav bar to SurahPage with back button and translation toggle. redesign some styling.)

      <div className="surah-header">
        <div className="surah-header-arabic">{surahMeta.name.split(" ").slice(1).join(" ")}</div>
        <div className="surah-header-english">{surahMeta.englishName}</div>
        <div className="surah-header-translation">{surahMeta.englishNameTranslation}</div>
        <div className="surah-header-meta">
          {surahMeta.numberOfAyahs} Verses &nbsp;•&nbsp; {surahMeta.revelationType}
        </div>
      </div>

      {ayahs.reduce((pages, ayah) => {
        const last = pages[pages.length - 1];
        if (!last || last.page !== ayah.page) pages.push({ page: ayah.page, ayahs: [ayah] });
        else last.ayahs.push(ayah);
        return pages;
      }, []).map((pageGroup, groupIndex) => (
        <div key={pageGroup.page} className={`mushaf-page${showTranslation ? " mushaf-bilingual" : ""}`}>
          {groupIndex === 0 && bismillah && <div className="bismillah">{bismillah}</div>}
          {showTranslation
            ? pageGroup.ayahs.map((ayah) => (
                <div key={ayah.number} className="ayah-row" onClick={() => setSelectedAyah(ayah)}>
                  <div className="ayah-english-col">{ayah.translation}</div>
                  <div className="ayah-arabic-col">
                    {ayah.text}
                    <span className="ayah-number">{ayah.numberInSurah}</span>
                  </div>
                </div>
              ))
            : pageGroup.ayahs.map((ayah) => (
                <span
                  key={ayah.number}
                  className="ayah-clickable"
                  onClick={() => setSelectedAyah(ayah)}
                >
                  {ayah.text}
                  <span className="ayah-number">{ayah.numberInSurah}</span>
                </span>
              ))}
          <div className="page-number">{pageGroup.page}</div>
        </div>
      ))}

      <AyahModal
        ayah={selectedAyah}
        onClose={() => setSelectedAyah(null)}
      />
    </div>
  );
}

export default SurahPage;
