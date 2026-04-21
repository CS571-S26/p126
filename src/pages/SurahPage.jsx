import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AyahModal from "../components/AyahModal";
import AyahList from "../components/AyahList";
import SurahNav from "../components/SurahNav";
import MushafPage from "../components/MushafPage";

function SurahPage() {
  const { id } = useParams();
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
    <div style={{background: "#f1fef5"}}>
      <SurahNav
        title={surahMeta.name.split(" ").slice(1).join(" ")}
        subtitle={surahMeta.englishName}
        showTranslation={showTranslation}
        onToggleTranslation={() => setShowTranslation((t) => !t)}
      />

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
        <MushafPage key={pageGroup.page} pageNumber={pageGroup.page} showTranslation={showTranslation}>
          {groupIndex === 0 && bismillah && <div className="bismillah">{bismillah}</div>}
          <AyahList
            ayahs={pageGroup.ayahs}
            showTranslation={showTranslation}
            onAyahClick={setSelectedAyah}
          />
        </MushafPage>
      ))}

      <AyahModal
        ayah={selectedAyah}
        onClose={() => setSelectedAyah(null)}
      />
    </div>
  );
}

export default SurahPage;