import { useEffect, useState } from "react";
import MushafPage from "./MushafPage";

function JuzMemorizationMode({ pages, onSurahNavigate }) {
  const total = pages.reduce(
    (sum, pageGroup) =>
      sum + pageGroup.sections.reduce((sectionSum, section) => sectionSum + section.ayahs.length, 0),
    0
  );
  const [revealedCount, setRevealedCount] = useState(0);
  const pageStartIndexes = [];
  let runningAyahCount = 0;

  for (const pageGroup of pages) {
    pageStartIndexes.push(runningAyahCount);
    runningAyahCount += pageGroup.sections.reduce((sum, section) => sum + section.ayahs.length, 0);
  }

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Enter" || e.key === "Backspace") {
        e.preventDefault();
      }

      if (e.key === "Enter") setRevealedCount((count) => Math.min(total, count + 1));
      if (e.key === "Backspace") setRevealedCount((count) => Math.max(0, count - 1));
    }

    window.addEventListener("keydown", handleKey, true);
    return () => window.removeEventListener("keydown", handleKey, true);
  }, [total]);

  return (
    <div>
      <div className="memorize-controls">
        <button
          className="page-nav-btn"
          onClick={(e) => {
            e.currentTarget.blur();
            setRevealedCount((count) => Math.max(0, count - 1));
          }}
          disabled={revealedCount <= 0}
        >
          ← Hide
        </button>
        <span className="page-nav-indicator">{revealedCount} / {total} revealed</span>
        <button
          className="page-nav-btn"
          onClick={(e) => {
            e.currentTarget.blur();
            setRevealedCount((count) => Math.min(total, count + 1));
          }}
          disabled={revealedCount >= total}
        >
          Reveal Next →
        </button>
      </div>

      {pages.map((pageGroup, pageIndex) => {
        let pageOffset = pageStartIndexes[pageIndex];

        return (
          <MushafPage
            key={pageGroup.page}
            pageNumber={pageGroup.page}
            showTranslation={false}
          >
            {pageGroup.sections.map((section) => {
              const sectionOffset = pageOffset;
              pageOffset += section.ayahs.length;

              return (
                <div key={`${pageGroup.page}-${section.surahNumber}-${section.ayahs[0].number}`}>
                  {section.ayahs[0].numberInSurah === 1 && (
                    <div
                      className="juz-surah-divider"
                      role="button"
                      onClick={() => onSurahNavigate(section.surahNumber)}
                    >
                      <div className="juz-surah-divider-number">{section.surahNumber}</div>
                      <div className="juz-surah-divider-info">
                        <span className="juz-surah-divider-english">{section.surah.englishName}</span>
                        <span className="juz-surah-divider-translation">{section.surah.englishNameTranslation}</span>
                      </div>
                      <div className="juz-surah-divider-arabic">{section.surah.name}</div>
                      <span className="juz-surah-divider-link">Read full surah {"→"}</span>
                    </div>
                  )}

                  {section.bismillah && <div className="bismillah">{section.bismillah}</div>}

                  {section.ayahs.map((ayah, ayahIndex) => {
                    const isRevealed = sectionOffset + ayahIndex < revealedCount;

                    return (
                      <span
                        key={ayah.number}
                        className={`ayah-clickable${isRevealed ? "" : " ayah-memorize-hidden"}`}
                      >
                        {ayah.text}
                        <span className="ayah-number">{ayah.numberInSurah}</span>
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </MushafPage>
        );
      })}
    </div>
  );
}

export default JuzMemorizationMode;
