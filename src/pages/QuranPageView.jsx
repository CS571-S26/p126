import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AyahModal from "../components/AyahModal";
import AyahList from "../components/AyahList";
import SurahNav from "../components/SurahNav";
import MushafPage from "../components/MushafPage";
import PageMemorizationMode from "../components/PageMemorizationMode";
import usePageData from "../hooks/usePageData";

const TOTAL_PAGES = 604;

function QuranPageView() {
  const { num } = useParams();
  const navigate = useNavigate();
  const pageNum = parseInt(num, 10);
  const { surahGroups, loading, error } = usePageData(pageNum);
  const [selectedAyah, setSelectedAyah] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [viewMode, setViewMode] = useState("page");

  function handlePageNav(nextPage) {
    return (e) => {
      e.currentTarget.blur();
      navigate(`/page/${nextPage}`);
    };
  }

  function renderPageNavigation() {
    return (
      <div className="page-nav-bar">
        <button
          className="page-nav-btn"
          onClick={handlePageNav(pageNum - 1)}
          disabled={pageNum <= 1}
        >
          ← Prev
        </button>
        <span className="page-nav-indicator">Page {pageNum} / {TOTAL_PAGES}</span>
        <button
          className="page-nav-btn"
          onClick={handlePageNav(pageNum + 1)}
          disabled={pageNum >= TOTAL_PAGES}
        >
          Next →
        </button>
      </div>
    );
  }

  return (
    <div>
      <SurahNav
        title={`Page ${pageNum}`}
        subtitle={`of ${TOTAL_PAGES}`}
        showTranslation={showTranslation}
        onToggleTranslation={() => setShowTranslation((t) => !t)}
      />

      {loading ? (
        <p className="page-loading">Loading page {pageNum}…</p>
      ) : error ? (
        <p className="page-loading">{error}</p>
      ) : viewMode === "memorize" ? (
        <>
          {renderPageNavigation()}
          <PageMemorizationMode
            key={pageNum}
            pageNum={pageNum}
            surahGroups={surahGroups}
          />
        </>
      ) : (
        <>
          {viewMode === "page" && renderPageNavigation()}

          <MushafPage pageNumber={pageNum} showTranslation={showTranslation}>
            {surahGroups.map((group) => (
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
        </>
      )}

      <AyahModal ayah={selectedAyah} onClose={() => setSelectedAyah(null)} />

      <div className="view-mode-bar">
        {["scroll", "page", "memorize"].map((mode) => (
          <button
            key={mode}
            className={`view-mode-toggle${viewMode === mode ? " view-mode-active" : ""}`}
            onClick={(e) => {
              e.currentTarget.blur();
              setViewMode(mode);
            }}
          >
            {mode === "scroll" ? "Scroll" : mode === "page" ? "Page" : "Memorize"}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuranPageView;
