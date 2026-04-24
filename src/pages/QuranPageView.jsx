import { useState, useRef, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useParams, useNavigate } from "react-router-dom";
import AyahModal from "../components/AyahModal";
import AyahList from "../components/AyahList";
import MushafPage from "../components/MushafPage";
import Navbar from "../components/Navbar";
import PageMemorizationMode from "../components/PageMemorizationMode";
import ReadingControlsSidebar from "../components/ReadingControlsSidebar";
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
  const [memorizeState, setMemorizeState] = useState({ pageNum, count: 0 });
  const memorizeRevealedCount = memorizeState.pageNum === pageNum ? memorizeState.count : 0;
  const [visiblePageNum, setVisiblePageNum] = useState(pageNum);
  const visiblePagesRef = useRef(new Set());

  const { pages: scrollPages, loading: scrollLoading, error: scrollError } = usePageRangeData(
    pageNum,
    viewMode === "scroll" ? committedCount : 0
  );

  useEffect(() => {
    setVisiblePageNum(pageNum);
    visiblePagesRef.current.clear();
  }, [pageNum]);

  useEffect(() => {
    if (viewMode !== "scroll" || !scrollPages.length) return;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const num = parseInt(entry.target.id.replace("mushaf-page-", ""), 10);
        if (entry.isIntersecting) {
          visiblePagesRef.current.add(num);
        } else {
          visiblePagesRef.current.delete(num);
        }
      }
      if (visiblePagesRef.current.size > 0) {
        setVisiblePageNum(Math.min(...visiblePagesRef.current));
      }
    }, { threshold: 0 });

    document.querySelectorAll("[id^='mushaf-page-']").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [viewMode, scrollPages]);

  function commitScrollCount() {
    const parsed = parseInt(scrollCount, 10);
    const clamped = Math.max(1, Math.min(isNaN(parsed) ? 1 : parsed, TOTAL_PAGES - pageNum + 1));
    setScrollCount(String(clamped));
    setCommittedCount(clamped);
  }

  function updateMemorizeRevealedCount(updater) {
    setMemorizeState((prev) => {
      const previousCount = prev.pageNum === pageNum ? prev.count : 0;
      const nextCount = typeof updater === "function" ? updater(previousCount) : updater;
      return { pageNum, count: nextCount };
    });
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

  const memorizeTotal = surahGroups.reduce((sum, group) => sum + group.ayahs.length, 0);

  return (
    <div>
      <Navbar />
      <ReadingControlsSidebar
        viewMode={viewMode}
        onViewModeChange={(mode) => { setViewMode(mode); }}
        showTranslation={showTranslation}
        onToggleTranslation={() => setShowTranslation((t) => !t)}
        scrollCount={scrollCount}
        onScrollCountChange={setScrollCount}
        onCommitScrollCount={commitScrollCount}
        info={{
          number: viewMode === "scroll" ? visiblePageNum : pageNum,
          englishName: `Page ${viewMode === "scroll" ? visiblePageNum : pageNum}`,
          subtitle: `of ${TOTAL_PAGES}`,
        }}
        pageNav={viewMode !== "scroll" ? {
          onPrev: () => navigate(`/page/${pageNum - 1}`),
          onNext: () => navigate(`/page/${pageNum + 1}`),
          prevDisabled: pageNum <= 1,
          nextDisabled: pageNum >= TOTAL_PAGES,
          label: pageNum,
        } : undefined}
        memorizeControls={viewMode === "memorize" ? {
          onHide: () => updateMemorizeRevealedCount((count) => Math.max(0, count - 1)),
          onReveal: () => updateMemorizeRevealedCount((count) => Math.min(memorizeTotal, count + 1)),
          hideDisabled: memorizeRevealedCount <= 0,
          revealDisabled: memorizeRevealedCount >= memorizeTotal,
        } : undefined}
        navLinks={[
          { label: "Home", icon: "⌂", onClick: () => navigate("/") },
        ]}
      />

      {viewMode === "scroll" ? (
        <>
          {scrollLoading ? (
            <p className="page-loading"><Spinner animation="border" variant="success" size="sm" /> Loading {committedCount} pages…</p>
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
        <p className="page-loading"><Spinner animation="border" variant="success" size="sm" /> Loading page {pageNum}…</p>
      ) : error ? (
        <p className="page-loading">{error}</p>
      ) : viewMode === "memorize" ? (
        <PageMemorizationMode
          key={pageNum}
          pageNum={pageNum}
          surahGroups={surahGroups}
          revealedCount={memorizeRevealedCount}
          onRevealedCountChange={updateMemorizeRevealedCount}
          onAyahClick={setSelectedAyah}
        />
      ) : (
        <MushafPage pageNumber={pageNum} showTranslation={showTranslation}>
          {renderGroups(surahGroups)}
        </MushafPage>
      )}

      <AyahModal ayah={selectedAyah} onClose={() => setSelectedAyah(null)} />
    </div>
  );
}

export default QuranPageView;
