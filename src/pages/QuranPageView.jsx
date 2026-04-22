import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AyahModal from "../components/AyahModal";
import AyahList from "../components/AyahList";
import SurahNav from "../components/SurahNav";
import MushafPage from "../components/MushafPage";
import PageMemorizationMode from "../components/PageMemorizationMode";
import usePageData from "../hooks/usePageData";
import usePageRangeData from "../hooks/usePageRangeData";

const TOTAL_PAGES = 604;

function QuranPageView() {
  const { num } = useParams();
  const navigate = useNavigate();
  const pageNum = parseInt(num, 10);

  const { surahGroups, loading, error } = usePageData(pageNum);
  const [selectedAyah, setSelectedAyah] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [viewMode, setViewMode] = useState("page");
  const [scrollCount, setScrollCount] = useState("10");
  const [committedCount, setCommittedCount] = useState(10);

  const { pages: scrollPages, loading: scrollLoading, error: scrollError } = usePageRangeData(
    pageNum,
    viewMode === "scroll" ? committedCount : 0
  );

  function handlePageNav(nextPage) {
    return (e) => {
      e.currentTarget.blur();
      navigate(`/page/${nextPage}`);
    };
  }

  function commitScrollCount() {
    const parsed = parseInt(scrollCount, 10);
    const clamped = Math.max(1, Math.min(isNaN(parsed) ? 1 : parsed, TOTAL_PAGES - pageNum + 1));
    setScrollCount(String(clamped));
    setCommittedCount(clamped);
  }

  function renderPageNavigation() {
    return (
      <div className="page-nav-bar">
        <button className="page-nav-btn" onClick={handlePageNav(pageNum - 1)} disabled={pageNum <= 1}>
          ← Prev
        </button>
        <span className="page-nav-indicator">Page {pageNum} / {TOTAL_PAGES}</span>
        <button className="page-nav-btn" onClick={handlePageNav(pageNum + 1)} disabled={pageNum >= TOTAL_PAGES}>
          Next →
        </button>
      </div>
    );
  }

  function renderGroups(groups) {
    return groups.map((group) => (
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
    ));
  }

  return (
    <div style={{ paddingBottom: "64px" }}>
      <SurahNav
        title={`Page ${pageNum}`}
        subtitle={`of ${TOTAL_PAGES}`}
        showTranslation={showTranslation}
        onToggleTranslation={() => setShowTranslation((t) => !t)}
      />

      {viewMode === "scroll" ? (
        <>
          <div className="scroll-range-bar">
            <span>Load</span>
            <input
              type="text"
              inputMode="numeric"
              className="scroll-count-input"
              value={scrollCount}
              onChange={(e) => setScrollCount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && commitScrollCount()}
            />
            <span>pages from page {pageNum}</span>
            <button className="page-nav-btn" onClick={commitScrollCount}>
              Load
            </button>
          </div>

          {scrollLoading ? (
            <p className="page-loading">Loading {committedCount} pages…</p>
          ) : scrollError ? (
            <p className="page-loading">{scrollError}</p>
          ) : (
            scrollPages.map(({ pageNum: pNum, surahGroups: groups }) => (
              <MushafPage key={pNum} pageNumber={pNum} showTranslation={showTranslation}>
                {renderGroups(groups)}
              </MushafPage>
            ))
          )}
        </>
      ) : loading ? (
        <p className="page-loading">Loading page {pageNum}…</p>
      ) : error ? (
        <p className="page-loading">{error}</p>
      ) : viewMode === "memorize" ? (
        <>
          {renderPageNavigation()}
          <PageMemorizationMode key={pageNum} pageNum={pageNum} surahGroups={surahGroups} />
        </>
      ) : (
        <>
          {renderPageNavigation()}
          <MushafPage pageNumber={pageNum} showTranslation={showTranslation}>
            {renderGroups(surahGroups)}
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
