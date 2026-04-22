import { useState } from "react";
import { useParams } from "react-router-dom";
import AyahModal from "../components/AyahModal";
import AyahList from "../components/AyahList";
import SurahNav from "../components/SurahNav";
import MushafPage from "../components/MushafPage";
import MemorizationMode from "../components/MemorizationMode";
import useSurahData from "../hooks/useSurahData";

function SurahPage() {
  const { id } = useParams();
  const { surahMeta, pages, bismillah, loading, error } = useSurahData(id);
  const [selectedAyah, setSelectedAyah] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [viewMode, setViewMode] = useState("scroll");
  const [pageState, setPageState] = useState({ surahId: id, pageIndex: 0 });
  const currentPageIndex = pageState.surahId === id ? pageState.pageIndex : 0;

  function updateCurrentPageIndex(updater) {
    setPageState((prev) => {
      const previousIndex = prev.surahId === id ? prev.pageIndex : 0;
      const nextIndex = typeof updater === "function" ? updater(previousIndex) : updater;

      return {
        surahId: id,
        pageIndex: nextIndex,
      };
    });
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!surahMeta) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ background: "#f1fef5", paddingBottom: "64px" }}>
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

      {viewMode === "scroll" && pages.map((pageGroup, groupIndex) => (
        <MushafPage key={pageGroup.page} pageNumber={pageGroup.page} showTranslation={showTranslation}>
          {groupIndex === 0 && bismillah && <div className="bismillah">{bismillah}</div>}
          <AyahList
            ayahs={pageGroup.ayahs}
            showTranslation={showTranslation}
            onAyahClick={setSelectedAyah}
          />
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
              Page {currentPageIndex + 1} of {pages.length}
            </span>
            <button
              className="page-nav-btn"
              onClick={() => updateCurrentPageIndex((index) => index + 1)}
              disabled={currentPageIndex === pages.length - 1}
            >
              Next →
            </button>
          </div>
          {pages[currentPageIndex] && (
            <MushafPage
              pageNumber={pages[currentPageIndex].page}
              showTranslation={showTranslation}
            >
              {currentPageIndex === 0 && bismillah && <div className="bismillah">{bismillah}</div>}
              <AyahList
                ayahs={pages[currentPageIndex].ayahs}
                showTranslation={showTranslation}
                onAyahClick={setSelectedAyah}
              />
            </MushafPage>
          )}
        </>
      )}

      {viewMode === "memorize" && (
        <MemorizationMode pages={pages} bismillah={bismillah} />
      )}

      <AyahModal
        ayah={selectedAyah}
        onClose={() => setSelectedAyah(null)}
      />

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

export default SurahPage;
