import { useEffect, useEffectEvent } from "react";
import MushafPage from "./MushafPage";

function MemorizationMode({ pages, bismillah, revealedCount, onRevealedCountChange, onAyahClick }) {
  const total = pages.reduce((sum, p) => sum + p.ayahs.length, 0);
  const pageStartIndexes = [];
  let runningAyahCount = 0;
  const effectiveRevealedCount = Math.min(revealedCount, total);

  function updateRevealedCount(updater) {
    const currentValue = Math.min(revealedCount, total);
    const nextValue = typeof updater === "function" ? updater(currentValue) : updater;
    onRevealedCountChange(nextValue);
  }

  const handleMemorizationKey = useEffectEvent((e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "Enter" || e.key === "Backspace") {
      e.preventDefault();
      e.stopPropagation();
    }
    if (e.key === "Enter") updateRevealedCount((c) => Math.min(total, c + 1));
    if (e.key === "Backspace") updateRevealedCount((c) => Math.max(0, c - 1));
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
          <MushafPage key={pageGroup.page} pageNumber={pageGroup.page} showTranslation={false}>
            {groupIndex === 0 && bismillah && <div className="bismillah">{bismillah}</div>}
            {pageGroup.ayahs.map((ayah, localIndex) => {
              const isRevealed = startIdx + localIndex < effectiveRevealedCount;
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
          </MushafPage>
        );
      })}
    </div>
  );
}

export default MemorizationMode;
