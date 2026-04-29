import { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useParams, useNavigate } from "react-router-dom";
import AyahModal from "../components/AyahModal";
import AyahList from "../components/AyahList";
import MushafPage from "../components/MushafPage";
import MemorizationMode from "../components/MemorizationMode";
import Navbar from "../components/Navbar";
import ReadingControlsSidebar from "../components/ReadingControlsSidebar";
import useSurahData from "../hooks/useSurahData";
import useReadingHistory from "../hooks/useReadingHistory";

function SurahPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { surahMeta, pages, bismillah, loading, error } = useSurahData(id);
  const { recordVisit, isBookmarked, toggleBookmark } = useReadingHistory();
  const [selectedAyah, setSelectedAyah] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [viewMode, setViewMode] = useState("scroll");
  const [pageState, setPageState] = useState({ surahId: id, pageIndex: 0 });
  const currentPageIndex = pageState.surahId === id ? pageState.pageIndex : 0;
  const [jumpInput, setJumpInput] = useState("");
  const [memorizeState, setMemorizeState] = useState({ surahId: id, count: 0 });
  const memorizeRevealedCount = memorizeState.surahId === id ? memorizeState.count : 0;
  const [wordByWord, setWordByWord] = useState(false);
  const [partialReveal, setPartialReveal] = useState(false);

  const surahPath = `/surah/${id}`;

  // Record visit when surah loads
  useEffect(() => {
    if (loading || !surahMeta) return;
    const currentPage = pages[currentPageIndex]?.page;
    recordVisit({
      type: "surah",
      id: String(id),
      label: `${surahMeta.englishName}${currentPage ? ` (Page ${currentPage})` : ""}`,
      arabicLabel: surahMeta.name.split(" ").slice(1).join(" "),
      path: surahPath
    });
  }, [id, loading, surahMeta, currentPageIndex, pages]);

  useEffect(() => {
    setPartialReveal(false);
  }, [id]);

  // Create bookmark entry with current page information
  const currentPage = pages[currentPageIndex]?.page;
  const bookmarkEntry = {
    type: "surah",
    id: String(id),
    label: `${surahMeta?.englishName}${currentPage ? ` (Page ${currentPage})` : ""}`,
    arabicLabel: surahMeta?.name.split(" ").slice(1).join(" "),
    path: surahPath
  };

  function updateCurrentPageIndex(updater) {
    setPageState((prev) => {
      const previousIndex = prev.surahId === id ? prev.pageIndex : 0;
      const nextIndex = typeof updater === "function" ? updater(previousIndex) : updater;
      return { surahId: id, pageIndex: nextIndex };
    });
  }

  function handleJump() {
    const num = parseInt(jumpInput, 10);
    if (isNaN(num)) return;
    if (viewMode === "page") {
      const idx = pages.findIndex((p) => p.page === num);
      if (idx !== -1) updateCurrentPageIndex(idx);
    } else {
      document.getElementById(`mushaf-page-${num}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setJumpInput("");
  }

  function updateMemorizeRevealedCount(updater) {
    setMemorizeState((prev) => {
      const previousCount = prev.surahId === id ? prev.count : 0;
      const nextCount = typeof updater === "function" ? updater(previousCount) : updater;
      return { surahId: id, count: nextCount };
    });
  }

  if (loading) {
    return <div className="page-loading"><Spinner animation="border" variant="success" /></div>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!surahMeta) {
    return <div className="page-loading"><Spinner animation="border" variant="success" /></div>;
  }

  const pageNums = pages.map((p) => p.page);
  const memorizeTotal = pages.reduce((sum, pageGroup) => sum + pageGroup.ayahs.length, 0);

  function handleMemorizeReveal() {
    if (memorizeRevealedCount >= memorizeTotal) return;
    if (wordByWord && !partialReveal) {
      setPartialReveal(true);
    } else {
      updateMemorizeRevealedCount((c) => Math.min(memorizeTotal, c + 1));
      setPartialReveal(false);
    }
  }

  function handleMemorizeHide() {
    if (memorizeRevealedCount <= 0 && !partialReveal) return;
    if (partialReveal) {
      setPartialReveal(false);
    } else {
      updateMemorizeRevealedCount((c) => Math.max(0, c - 1));
    }
  }

  function toggleWordByWord() {
    setWordByWord((w) => !w);
    setPartialReveal(false);
  }

  return (
    <div style={{ background: "#f1fef5" }}>
      <Navbar />
      <ReadingControlsSidebar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showTranslation={showTranslation}
        onToggleTranslation={() => setShowTranslation((t) => !t)}
        jumpInput={jumpInput}
        onJumpInputChange={setJumpInput}
        onJump={handleJump}
        jumpPlaceholder={pageNums[0] ? `${pageNums[0]}–${pageNums[pageNums.length - 1]}` : ""}
        pageNav={viewMode === "page" ? {
          onPrev: () => updateCurrentPageIndex((i) => i - 1),
          onNext: () => updateCurrentPageIndex((i) => i + 1),
          prevDisabled: currentPageIndex === 0,
          nextDisabled: currentPageIndex === pages.length - 1,
          label: pages[currentPageIndex]?.page,
        } : undefined}
        memorizeControls={viewMode === "memorize" ? {
          onHide: handleMemorizeHide,
          onReveal: handleMemorizeReveal,
          hideDisabled: memorizeRevealedCount <= 0 && !partialReveal,
          revealDisabled: memorizeRevealedCount >= memorizeTotal,
          wordByWord,
          onToggleWordByWord: toggleWordByWord,
          revealed: memorizeRevealedCount,
          total: memorizeTotal,
        } : undefined}
        info={{
          number: parseInt(id),
          arabicName: surahMeta.name.split(" ").slice(1).join(" "),
          englishName: surahMeta.englishName,
          subtitle: surahMeta.englishNameTranslation,
          details: [
            { label: "Revelation", value: surahMeta.revelationType },
            { label: "Verses", value: surahMeta.numberOfAyahs },
          ],
        }}
        navLinks={[
          { label: "Home", icon: "⌂", onClick: () => navigate("/") },
          { label: "All Surahs", icon: "☰", onClick: () => navigate("/surah") },
        ]}
        bookmark={{
          isBookmarked: isBookmarked(surahPath),
          onToggle: () => toggleBookmark(bookmarkEntry),
        }}
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
        <MemorizationMode
          pages={pages}
          bismillah={bismillah}
          revealedCount={memorizeRevealedCount}
          onAyahClick={setSelectedAyah}
          showTranslation={showTranslation}
          wordByWord={wordByWord}
          partialReveal={partialReveal}
          onReveal={handleMemorizeReveal}
          onHide={handleMemorizeHide}
        />
      )}

      <AyahModal
        ayah={selectedAyah}
        onClose={() => setSelectedAyah(null)}
      />
    </div>
  );
}

export default SurahPage;
