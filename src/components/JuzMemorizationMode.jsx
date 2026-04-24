import { useEffect, useEffectEvent } from "react";
import MushafPage from "./MushafPage";

function JuzMemorizationMode({
  pages,
  onSurahNavigate,
  revealedCount,
  onRevealedCountChange,
  onAyahClick,
}) {
  const total = pages.reduce(
    (sum, pageGroup) =>
      sum + pageGroup.sections.reduce((sectionSum, section) => sectionSum + section.ayahs.length, 0),
    0
  );
  const pageStartIndexes = [];
  let runningAyahCount = 0;
  const effectiveRevealedCount = Math.min(revealedCount, total);

  for (const pageGroup of pages) {
    pageStartIndexes.push(runningAyahCount);
    runningAyahCount += pageGroup.sections.reduce((sum, section) => sum + section.ayahs.length, 0);
  }

  function updateRevealedCount(updater) {
    const currentValue = Math.min(revealedCount, total);
    const nextValue = typeof updater === "function" ? updater(currentValue) : updater;
    onRevealedCountChange(nextValue);
  }

  const handleKey = useEffectEvent((e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "Enter" || e.key === "Backspace") {
      e.preventDefault();
      e.stopPropagation();
    }

    if (e.key === "Enter") updateRevealedCount((count) => Math.min(total, count + 1));
    if (e.key === "Backspace") updateRevealedCount((count) => Math.max(0, count - 1));
  });

  useEffect(() => {
    window.addEventListener("keydown", handleKey, true);
    return () => window.removeEventListener("keydown", handleKey, true);
  }, [total]);

  return (
    <div>
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
                    const isRevealed = sectionOffset + ayahIndex < effectiveRevealedCount;

                    return (
                      <span
                        key={ayah.number}
                        className={`ayah-clickable${isRevealed ? "" : " ayah-memorize-hidden"}`}
                        onClick={() => onAyahClick(ayah)}
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
