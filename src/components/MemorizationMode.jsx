import { useEffect, useEffectEvent } from "react";
import MushafPage from "./MushafPage";

function MemorizationMode({ pages, bismillah, revealedCount, onAyahClick, showTranslation, wordByWord, partialReveal, onReveal, onHide }) {
  const total = pages.reduce((sum, p) => sum + p.ayahs.length, 0);
  const pageStartIndexes = [];
  let runningAyahCount = 0;
  const effectiveRevealedCount = Math.min(revealedCount, total);

  const handleMemorizationKey = useEffectEvent((e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "Enter" || e.key === "Backspace") {
      e.preventDefault();
      e.stopPropagation();
    }
    if (e.key === "Enter") onReveal();
    if (e.key === "Backspace") onHide();
  });

  for (const pageGroup of pages) {
    pageStartIndexes.push(runningAyahCount);
    runningAyahCount += pageGroup.ayahs.length;
  }

  useEffect(() => {
    window.addEventListener("keydown", handleMemorizationKey, true);
    return () => window.removeEventListener("keydown", handleMemorizationKey, true);
  }, [total]);

  return (
    <div>
      {pages.map((pageGroup, groupIndex) => {
        const startIdx = pageStartIndexes[groupIndex];
        return (
          <MushafPage key={pageGroup.page} pageNumber={pageGroup.page} showTranslation={showTranslation}>
            {groupIndex === 0 && bismillah && <div className="bismillah">{bismillah}</div>}
            {pageGroup.ayahs.map((ayah, localIndex) => {
              const globalIndex = startIdx + localIndex;
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
          </MushafPage>
        );
      })}
    </div>
  );
}

export default MemorizationMode;
