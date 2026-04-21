import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AyahModal from "../components/AyahModal";
import AyahList from "../components/AyahList";
import SurahNav from "../components/SurahNav";
import MushafPage from "../components/MushafPage";

const TOTAL_PAGES = 604;

function QuranPageView() {
  const { num } = useParams();
  const navigate = useNavigate();
  const pageNum = parseInt(num);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAyah, setSelectedAyah] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    setLoading(true);
    setAyahs([]);
    Promise.all([
      fetch(`https://api.alquran.cloud/v1/page/${pageNum}/quran-uthmani`).then((r) => r.json()),
      fetch(`https://api.alquran.cloud/v1/page/${pageNum}/en.sahih`).then((r) => r.json()),
      fetch(`https://api.alquran.cloud/v1/page/${pageNum}/ar.alafasy`).then((r) => r.json()),
    ])
      .then(([arabicRes, englishRes, audioRes]) => {
        const arabic = arabicRes.data;
        const english = englishRes.data;
        const audio = audioRes.data;
        const combined = arabic.ayahs.map((ayah, i) => ({
          number: ayah.number,
          numberInSurah: ayah.numberInSurah,
          text: ayah.text,
          translation: english.ayahs[i].text,
          audio: audio.ayahs[i].audioSecondary,
          surah: ayah.surah,
        }));
        setAyahs(combined);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [pageNum]);

  // Group ayahs by surah
  const surahGroups = ayahs.reduce((groups, ayah) => {
    const last = groups[groups.length - 1];
    if (!last || last.surahNumber !== ayah.surah.number) {
      groups.push({ surahNumber: ayah.surah.number, surah: ayah.surah, ayahs: [ayah] });
    } else {
      last.ayahs.push(ayah);
    }
    return groups;
  }, []);

  // Strip prepended bismillah from the first ayah of each new surah (except 1 and 9)
  const processedGroups = surahGroups.map((group) => {
    const { surahNumber, ayahs: groupAyahs } = group;
    const firstAyah = groupAyahs[0];
    let bismillah = null;
    let processedAyahs = groupAyahs;

    if (firstAyah.numberInSurah === 1 && surahNumber !== 1 && surahNumber !== 9) {
      const clean = firstAyah.text.replace(/[\u200f\u200e\ufeff\u200b]/g, "").trim();
      const words = clean.split(/\s+/);
      if (words[0].startsWith("بِسْمِ")) {
        bismillah = words.slice(0, 4).join(" ");
        processedAyahs = [{ ...firstAyah, text: words.slice(4).join(" ") }, ...groupAyahs.slice(1)];
      }
    }

    return { ...group, bismillah, ayahs: processedAyahs };
  });

  return (
    <div>
      <SurahNav
        title={`Page ${pageNum}`}
        subtitle={`of ${TOTAL_PAGES}`}
        showTranslation={showTranslation}
        onToggleTranslation={() => setShowTranslation((t) => !t)}
      />

      <div className="page-nav-bar">
        <button
          className="page-nav-btn"
          onClick={() => navigate(`/page/${pageNum - 1}`)}
          disabled={pageNum <= 1}
        >
          ← Prev
        </button>
        <span className="page-nav-indicator">Page {pageNum} / {TOTAL_PAGES}</span>
        <button
          className="page-nav-btn"
          onClick={() => navigate(`/page/${pageNum + 1}`)}
          disabled={pageNum >= TOTAL_PAGES}
        >
          Next →
        </button>
      </div>

      {loading ? (
        <p className="page-loading">Loading page {pageNum}…</p>
      ) : (
        <MushafPage pageNumber={pageNum} showTranslation={showTranslation}>
          {processedGroups.map((group) => (
            <div key={group.surahNumber} className="surah-inline-section">
              {group.ayahs[0].numberInSurah === 1 && (
                <div className="surah-page-header">
                  <div className="surah-page-header-arabic">
                    {group.surah.name.split(" ").slice(1).join(" ")}
                  </div>
                  <div className="surah-page-header-english">{group.surah.englishName}</div>
                  <div className="surah-page-header-meta">
                    {group.surah.englishNameTranslation} &nbsp;•&nbsp; {group.surah.numberOfAyahs} Verses &nbsp;•&nbsp; {group.surah.revelationType}
                  </div>
                </div>
              )}

              {group.bismillah && <div className="bismillah">{group.bismillah}</div>}

              <AyahList
                ayahs={group.ayahs}
                showTranslation={showTranslation}
                onAyahClick={setSelectedAyah}
              />
            </div>
          ))}
        </MushafPage>
      )}

      <AyahModal ayah={selectedAyah} onClose={() => setSelectedAyah(null)} />
    </div>
  );
}

export default QuranPageView;
