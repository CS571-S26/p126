import { useState } from "react";
import { Spinner, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AyahModal from "../components/AyahModal";
import AyahList from "../components/AyahList";
import JuzMemorizationMode from "../components/JuzMemorizationMode";
import MushafPage from "../components/MushafPage";
import ReadingControlsSidebar from "../components/ReadingControlsSidebar";
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
  const [memorizeState, setMemorizeState] = useState({ juzNum: num, count: 0 });
  const memorizeRevealedCount = memorizeState.juzNum === num ? memorizeState.count : 0;
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

  function updateMemorizeRevealedCount(updater) {
    setMemorizeState((prev) => {
      const previousCount = prev.juzNum === num ? prev.count : 0;
      const nextCount = typeof updater === "function" ? updater(previousCount) : updater;

      return {
        juzNum: num,
        count: nextCount,
      };
    });
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="error-container">
          <Alert variant="danger" className="error-message">{error}</Alert>
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
          <Spinner animation="border" variant="success" />
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

      <ReadingControlsSidebar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showTranslation={showTranslation}
        onToggleTranslation={() => setShowTranslation((t) => !t)}
        jumpInput={jumpInput}
        onJumpInputChange={setJumpInput}
        onJump={() => handleJump(juzPages)}
        jumpPlaceholder={juzPages.length ? `${juzPages[0].page}–${juzPages[juzPages.length - 1].page}` : ""}
        pageNav={viewMode === "page" ? {
          onPrev: () => updateCurrentPageIndex((i) => i - 1),
          onNext: () => updateCurrentPageIndex((i) => i + 1),
          prevDisabled: currentPageIndex === 0,
          nextDisabled: currentPageIndex === juzPages.length - 1,
          label: juzPages[currentPageIndex]?.page,
        } : undefined}
        memorizeControls={viewMode === "memorize" ? {
          onHide: () => updateMemorizeRevealedCount((count) => Math.max(0, count - 1)),
          onReveal: () => updateMemorizeRevealedCount((count) => Math.min(
            juzPages.reduce(
              (sum, pageGroup) =>
                sum + pageGroup.sections.reduce(
                  (sectionSum, section) => sectionSum + section.ayahs.length,
                  0
                ),
              0
            ),
            count + 1
          )),
          hideDisabled: memorizeRevealedCount <= 0,
          revealDisabled: memorizeRevealedCount >= juzPages.reduce(
            (sum, pageGroup) =>
              sum + pageGroup.sections.reduce(
                (sectionSum, section) => sectionSum + section.ayahs.length,
                0
              ),
            0
          ),
        } : undefined}
        info={{
          number: parseInt(num),
          arabicName: `الجزء ${num}`,
          englishName: `Juz ${num}`,
          details: [
            { label: "Pages", value: juzPages.length },
          ],
        }}
        navLinks={[
          { label: "Home", icon: "⌂", onClick: () => navigate("/") },
          { label: "All Juzs", icon: "☰", onClick: () => navigate("/juz") },
        ]}
      />

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
          revealedCount={memorizeRevealedCount}
          onRevealedCountChange={updateMemorizeRevealedCount}
        />
      )}

      <AyahModal ayah={selectedAyah} onClose={() => setSelectedAyah(null)} />
    </div>
  );
}

export default JuzDetailPage;
