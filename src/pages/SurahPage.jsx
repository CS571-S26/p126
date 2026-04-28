import { useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useParams, useNavigate } from "react-router-dom";
import AyahModal from "../components/AyahModal";
import AyahList from "../components/AyahList";
import MushafPage from "../components/MushafPage";
import MemorizationMode from "../components/MemorizationMode";
import Navbar from "../components/Navbar";
import ReadingControlsSidebar from "../components/ReadingControlsSidebar";
import useSurahData from "../hooks/useSurahData";

function SurahPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { surahMeta, pages, bismillah, loading, error } = useSurahData(id);
  const [selectedAyah, setSelectedAyah] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [viewMode, setViewMode] = useState("scroll");
  const [pageState, setPageState] = useState({ surahId: id, pageIndex: 0 });
  const currentPageIndex = pageState.surahId === id ? pageState.pageIndex : 0;
  const [jumpInput, setJumpInput] = useState("");
  const [memorizeState, setMemorizeState] = useState({ surahId: id, count: 0 });
  const memorizeRevealedCount = memorizeState.surahId === id ? memorizeState.count : 0;

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
          onHide: () => updateMemorizeRevealedCount((count) => Math.max(0, count - 1)),
          onReveal: () => updateMemorizeRevealedCount((count) => Math.min(memorizeTotal, count + 1)),
          hideDisabled: memorizeRevealedCount <= 0,
          revealDisabled: memorizeRevealedCount >= memorizeTotal,
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
          onRevealedCountChange={updateMemorizeRevealedCount}
          onAyahClick={setSelectedAyah}
          showTranslation={showTranslation}
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
