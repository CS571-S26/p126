import { useEffect, useState } from "react";
import MushafPage from "./MushafPage";

function PageMemorizationMode({ pageNum, surahGroups }) {
  const total = surahGroups.reduce((sum, group) => sum + group.ayahs.length, 0);
  const [revealedCount, setRevealedCount] = useState(0);
  const pageStartIndexes = [];
  let runningAyahCount = 0;

  for (const group of surahGroups) {
    pageStartIndexes.push(runningAyahCount);
    runningAyahCount += group.ayahs.length;
  }

  const effectiveRevealedCount = Math.min(revealedCount, total);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Enter" || e.key === "Backspace") {
        e.preventDefault();
      }

      if (e.key === "Enter") setRevealedCount((c) => Math.min(total, c + 1));
      if (e.key === "Backspace") setRevealedCount((c) => Math.max(0, c - 1));
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
            setRevealedCount((c) => Math.max(0, c - 1));
          }}
          disabled={effectiveRevealedCount <= 0}
        >
          ← Hide
        </button>
        <span className="page-nav-indicator">{effectiveRevealedCount} / {total} revealed</span>
        <button
          className="page-nav-btn"
          onClick={(e) => {
            e.currentTarget.blur();
            setRevealedCount((c) => Math.min(total, c + 1));
          }}
          disabled={effectiveRevealedCount >= total}
        >
          Reveal Next →
        </button>
      </div>

      <div className="memorize-page-shell">
        <div className="memorize-page-content">
          {surahGroups.map((group, groupIndex) => {
            const startIdx = pageStartIndexes[groupIndex] ?? 0;
            return (
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

                {group.ayahs.map((ayah, localIndex) => {
                  const isRevealed = startIdx + localIndex < effectiveRevealedCount;
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
        </div>
        <div className="memorize-page-number">{pageNum}</div>
      </div>
    </div>
  );
}

export default PageMemorizationMode;
