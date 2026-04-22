import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AyahModal from "../components/AyahModal";
import AyahList from "../components/AyahList";
import JuzMemorizationMode from "../components/JuzMemorizationMode";
import MushafPage from "../components/MushafPage";
import useJuzData from "../hooks/useJuzData";

function JuzDetailPage() {
  const { num } = useParams();
  const navigate = useNavigate();
  const { surahGroups, loading, error } = useJuzData(num);
  const [showTranslation, setShowTranslation] = useState(false);
  const [selectedAyah, setSelectedAyah] = useState(null);
  const [viewMode, setViewMode] = useState("scroll");
  const [pageState, setPageState] = useState({ juzNum: num, pageIndex: 0 });
  const currentPageIndex = pageState.juzNum === num ? pageState.pageIndex : 0;
  const [jumpInput, setJumpInput] = useState("");

  function handleJump(juzPages) {
    const num2 = parseInt(jumpInput, 10);
    if (isNaN(num2)) return;
    if (viewMode === "page") {
      const idx = juzPages.findIndex((p) => p.page === num2);
      if (idx !== -1) updateCurrentPageIndex(idx);
    } else {
      document.getElementById(`mushaf-page-${num2}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setJumpInput("");
  }

  function updateCurrentPageIndex(updater) {
    setPageState((prev) => {
      const previousIndex = prev.juzNum === num ? prev.pageIndex : 0;
      const nextIndex = typeof updater === "function" ? updater(previousIndex) : updater;

      return {
        juzNum: num,
        pageIndex: nextIndex,
      };
    });
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="error-container">
          <p className="error-message">⚠️ {error}</p>
          <button className="error-back-btn" onClick={() => navigate("/juz")}>
            ← Back to Juz List
          </button>
        </div>
      </div>
    );
  }

  if (loading || !surahGroups) {
    return (
      <div>
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="juz-loading">Loading Juz {num}...</p>
        </div>
      </div>
    );
  }

  const juzPages = surahGroups.reduce((pages, group) => {
    group.ayahs.forEach((ayah, index) => {
      let pageGroup = pages[pages.length - 1];

      if (!pageGroup || pageGroup.page !== ayah.page) {
        pageGroup = { page: ayah.page, sections: [] };
        pages.push(pageGroup);
      }

      const lastSection = pageGroup.sections[pageGroup.sections.length - 1];
      const startsNewSurahSection =
        !lastSection ||
        lastSection.surahNumber !== group.surahNumber ||
        (index === 0 && ayah.numberInSurah === 1);

      if (startsNewSurahSection) {
        pageGroup.sections.push({
          surahNumber: group.surahNumber,
          surah: group.surah,
          ayahs: [ayah],
          bismillah: index === 0 ? group.bismillah : null,
        });
      } else {
        lastSection.ayahs.push(ayah);
      }
    });

    return pages;
  }, []);

  function renderPageSection(section, pageNumber) {
    return (
      <div key={`${pageNumber}-${section.surahNumber}-${section.ayahs[0].number}`}>
        {section.ayahs[0].numberInSurah === 1 && (
          <div
            className="juz-surah-divider"
            role="button"
            onClick={() => navigate(`/surah/${section.surahNumber}`)}
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

        <AyahList
          ayahs={section.ayahs}
          showTranslation={showTranslation}
          onAyahClick={setSelectedAyah}
        />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <nav className="surah-nav">
        <button className="surah-nav-back" onClick={() => navigate("/juz")}>
          {"←"} Back to Juz List
        </button>
        <div className="surah-nav-title">
          <div className="surah-nav-english">Juz {num}</div>
          <div className="surah-nav-translation">{"الجزء"} {num}</div>
        </div>
        <button className="translation-toggle" onClick={() => setShowTranslation((t) => !t)}>
          {showTranslation ? "Hide Translation" : "Show Translation"}
        </button>
      </nav>

      <div className="scroll-range-bar">
        <span>Jump to page</span>
        <input
          type="text"
          inputMode="numeric"
          className="scroll-count-input"
          placeholder={juzPages.length ? `${juzPages[0].page}–${juzPages[juzPages.length - 1].page}` : ""}
          value={jumpInput}
          onChange={(e) => setJumpInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleJump(juzPages)}
        />
        <button className="page-nav-btn" onClick={() => handleJump(juzPages)}>Go</button>
      </div>

      {viewMode === "scroll" && juzPages.map((pageGroup) => (
        <MushafPage
          key={pageGroup.page}
          pageNumber={pageGroup.page}
          showTranslation={showTranslation}
        >
          {pageGroup.sections.map((section) => renderPageSection(section, pageGroup.page))}
        </MushafPage>
      ))}

      {viewMode === "page" && (
        <>
          <div className="page-nav-bar">
            <button
              className="page-nav-btn"
              onClick={() => updateCurrentPageIndex((index) => index - 1)}
              disabled={currentPageIndex === 0}
            >
              ← Prev
            </button>
            <span className="page-nav-indicator">
              Page {currentPageIndex + 1} of {juzPages.length}
            </span>
            <button
              className="page-nav-btn"
              onClick={() => updateCurrentPageIndex((index) => index + 1)}
              disabled={currentPageIndex === juzPages.length - 1}
            >
              Next →
            </button>
          </div>

          {juzPages[currentPageIndex] && (
            <MushafPage
              pageNumber={juzPages[currentPageIndex].page}
              showTranslation={showTranslation}
            >
              {juzPages[currentPageIndex].sections.map((section) =>
                renderPageSection(section, juzPages[currentPageIndex].page)
              )}
            </MushafPage>
          )}
        </>
      )}

      {viewMode === "memorize" && (
        <JuzMemorizationMode
          pages={juzPages}
          onSurahNavigate={(surahNumber) => navigate(`/surah/${surahNumber}`)}
        />
      )}

      <AyahModal ayah={selectedAyah} onClose={() => setSelectedAyah(null)} />

      <div className="view-mode-bar">
        {["scroll", "page", "memorize"].map((mode) => (
          <button
            key={mode}
            className={`view-mode-toggle${viewMode === mode ? " view-mode-active" : ""}`}
            onClick={() => setViewMode(mode)}
          >
            {mode === "scroll" ? "Scroll" : mode === "page" ? "Page" : "Memorize"}
          </button>
        ))}
      </div>
    </div>
  );
}

export default JuzDetailPage;
