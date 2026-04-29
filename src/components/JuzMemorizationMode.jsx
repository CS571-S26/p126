import { useEffect, useEffectEvent } from "react";
import MushafPage from "./MushafPage";

function JuzMemorizationMode({
  pages,
  onSurahNavigate,
  revealedCount,
  onAyahClick,
  showTranslation,
  wordByWord,
  partialReveal,
  onReveal,
  onHide,
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

  const handleKey = useEffectEvent((e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "Enter" || e.key === "Backspace") {
      e.preventDefault();
      e.stopPropagation();
    }
    if (e.key === "Enter") onReveal();
    if (e.key === "Backspace") onHide();
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
            showTranslation={showTranslation}
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
                    const globalIndex = sectionOffset + ayahIndex;
                    const isRevealed = globalIndex < effectiveRevealedCount;
                    const isPartial = wordByWord && partialReveal && globalIndex === effectiveRevealedCount;
                    const hiddenClass = isRevealed || isPartial ? "" : " ayah-memorize-hidden";
                    const words = ayah.text.split(" ");
                    const ayahContent = isPartial ? (
                      <>{words[0]}{words.length > 1 && <span style={{ visibility: "hidden" }}>{" " + words.slice(1).join(" ")}</span>}</>
                    ) : ayah.text;
                    if (showTranslation) {
                      return (
                        <div key={ayah.number} className="ayah-row" onClick={() => onAyahClick(ayah)}>
                          <div className={`ayah-arabic-col${hiddenClass}`}>
                            {ayahContent}
                            <span className="ayah-number">{ayah.numberInSurah}</span>
                          </div>
                          <div className="ayah-english-col">{ayah.translation}</div>
                        </div>
                      );
                    }
                    return (
                      <span
                        key={ayah.number}
                        className={`ayah-clickable${hiddenClass}`}
                        onClick={() => onAyahClick(ayah)}
                      >
                        {ayahContent}
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
