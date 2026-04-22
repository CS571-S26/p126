import { useState, useEffect } from "react";
import MushafPage from "./MushafPage";

function MemorizationMode({ pages, bismillah }) {
  const total = pages.reduce((sum, p) => sum + p.ayahs.length, 0);
  const [revealedCount, setRevealedCount] = useState(0);
  const pageStartIndexes = [];
  let runningAyahCount = 0;

  for (const pageGroup of pages) {
    pageStartIndexes.push(runningAyahCount);
    runningAyahCount += pageGroup.ayahs.length;
  }

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Enter") setRevealedCount((c) => Math.min(total, c + 1));
      if (e.key === "Backspace") setRevealedCount((c) => Math.max(0, c - 1));
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [total]);
  return (
    <div>
      <div className="memorize-controls">
        <button
          className="page-nav-btn"
          onClick={() => setRevealedCount((c) => Math.max(0, c - 1))}
          disabled={revealedCount <= 0}
        >
          ← Hide
        </button>
        <span className="page-nav-indicator">{revealedCount} / {total} revealed</span>
        <button
          className="page-nav-btn"
          onClick={() => setRevealedCount((c) => Math.min(total, c + 1))}
          disabled={revealedCount >= total}
        >
          Reveal Next →
        </button>
      </div>

      {pages.map((pageGroup, groupIndex) => {
        const startIdx = pageStartIndexes[groupIndex];
        return (
          <MushafPage key={pageGroup.page} pageNumber={pageGroup.page} showTranslation={false}>
            {groupIndex === 0 && bismillah && <div className="bismillah">{bismillah}</div>}
            {pageGroup.ayahs.map((ayah, localIndex) => {
              const isRevealed = startIdx + localIndex < revealedCount;
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
          </MushafPage>
        );
      })}
    </div>
  );
}

export default MemorizationMode;
