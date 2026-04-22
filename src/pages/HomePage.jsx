import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const HADITH_COLLECTIONS = [
  { name: "sahih-bukhari", count: 7563 },
  { name: "sahih-muslim", count: 3032 },
  { name: "abu-dawood", count: 3998 },
  { name: "ibn-e-majah", count: 4342 },
  { name: "al-tirmidhi", count: 3956 },
];

const API_KEY = import.meta.env.VITE_HADITH_API_KEY;

function HomePage() {
  const [pageNum, setPageNum] = useState("");
  const [pageError, setPageError] = useState("");
  const navigate = useNavigate();

  const [hadith, setHadith] = useState(null);
  const [hadithLoading, setHadithLoading] = useState(true);
  const [hadithError, setHadithError] = useState(false);

  useEffect(() => {
    const daysSinceEpoch = Math.floor(Date.now() / 86400000);
    const collection = HADITH_COLLECTIONS[daysSinceEpoch % HADITH_COLLECTIONS.length];
    const hadithNumber = (daysSinceEpoch % collection.count) + 1;

    const API_KEY = "$2y$10$pEbfRCeC3QQ29yAguJjT5kk0cDAg1UyF9Oh85JAybFK9VlpRGR92";

    // in useEffect:
    fetch(`/hadith-api/api/hadiths/?apiKey=${API_KEY}&book=${collection.name}&hadithNumber=${hadithNumber}&paginate=1`)

      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data) => {
        const fetched = data.hadiths?.data?.[0];
        if (!fetched) throw new Error("No hadith found");
        setHadith(fetched);
      })
      .catch(() => setHadithError(true))
      .finally(() => setHadithLoading(false));
  }, []);

  function handleGoToPage() {
    const num = parseInt(pageNum, 10);
    if (!pageNum || isNaN(num)) {
      setPageError("Please enter a page number.");
      return;
    }
    if (num < 1 || num > 604) {
      setPageError("Page must be between 1 and 604.");
      return;
    }
    setPageError("");
    navigate(`/page/${num}`);
  }

  function handlePageKeyDown(e) {
    if (e.key === "Enter") handleGoToPage();
  }

  return (
    <div className="home-page">
      <Navbar />

      <section className="home-hero">
        <h1 className="hero-arabic">القرآن الكريم</h1>
        <p className="hero-title">The Noble Quran</p>
        <p className="hero-subtitle">Choose your preferred way to read and explore the Holy Quran</p>
      </section>

      <section className="home-cards">
        {/* Browse by Surah */}
        <Link to="/surah" className="home-card home-card--clickable">
          <div className="home-card-icon home-card-icon--emerald">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          </div>
          <h3 className="home-card-title">Browse by Surah</h3>
          <p className="home-card-arabic">تصفح بالسورة</p>
          <p className="home-card-desc">
            Read the Quran organized by its 114 chapters (Surahs). Perfect for those who prefer the traditional chapter-based reading.
          </p>
          <span className="home-card-link home-card-link--emerald">Get Started →</span>
        </Link>

        {/* Browse by Juz */}
        <Link to="/juz" className="home-card home-card--clickable">
          <div className="home-card-icon home-card-icon--teal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <h3 className="home-card-title">Browse by Juz</h3>
          <p className="home-card-arabic">تصفح بالجزء</p>
          <p className="home-card-desc">
            Divide your reading into 30 equal parts (Juz). Ideal for completing the Quran in a month, one Juz per day.
          </p>
          <span className="home-card-link home-card-link--teal">Get Started →</span>
        </Link>

        {/* Jump to Page */}
        <div className="home-card home-card--no-hover">
          <div className="home-card-icon home-card-icon--cyan">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <h3 className="home-card-title">Jump to Page</h3>
          <p className="home-card-arabic">انتقل إلى صفحة</p>
          <p className="home-card-desc">
            Navigate directly to any of the 604 pages of the Mushaf. Enter a page number below.
          </p>
          <div className="page-jump-row">
            <input
              type="number"
              className="page-jump-input"
              placeholder="Page number (1-604)"
              value={pageNum}
              min={1}
              max={604}
              onChange={(e) => { setPageNum(e.target.value); setPageError(""); }}
              onKeyDown={handlePageKeyDown}
            />
            <button
              className="page-jump-btn"
              onClick={handleGoToPage}
              disabled={!pageNum}
            >
              Go to Page →
            </button>
          </div>
          {pageError && <p className="page-jump-error">{pageError}</p>}
        </div>
      </section>

      {/* Quick Reference Stats */}
      <section className="home-stats">
        <h3 className="home-stats-title">Quick Reference</h3>
        <div className="home-stats-grid">
          <div className="home-stat">
            <span className="home-stat-num">114</span>
            <span className="home-stat-label">Surahs</span>
          </div>
          <div className="home-stat">
            <span className="home-stat-num">30</span>
            <span className="home-stat-label">Juz</span>
          </div>
          <div className="home-stat">
            <span className="home-stat-num">604</span>
            <span className="home-stat-label">Pages</span>
          </div>
          <div className="home-stat">
            <span className="home-stat-num">6,236</span>
            <span className="home-stat-label">Verses</span>
          </div>
        </div>
      </section>

      {/* Hadith of the Day */}
      <section className="home-hadith">
        <h3 className="home-hadith-title">
          <span className="home-hadith-title-icon">☽</span>
          Hadith of the Day
        </h3>
        {hadithLoading && (
          <p className="home-hadith-loading">Loading hadith…</p>
        )}
        {hadith && !hadithLoading && (
          <div className="home-hadith-card">
            <div className="home-hadith-meta">
              <span className="home-hadith-book">{hadith.book?.bookName}</span>
              {hadith.chapter?.chapterEnglish && (
                <span className="home-hadith-chapter">{hadith.chapter.chapterEnglish}</span>
              )}
            </div>
            {hadith.headingEnglish && (
              <p className="home-hadith-narrator">{hadith.headingEnglish}</p>
            )}
            <p className="home-hadith-text">{hadith.hadithEnglish}</p>
            <p className="home-hadith-ref">
              Hadith #{hadith.hadithNumber}
              {hadith.status ? ` — ${hadith.status}` : ""}
            </p>
          </div>
        )}
      </section>

      <footer className="home-footer">
        <p>Read the Noble Quran with ease and understanding</p>
        <p>Explore by Surah, Juz, or Page</p>
      </footer>
    </div>
  );
}

export default HomePage;