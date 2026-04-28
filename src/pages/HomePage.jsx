import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import Navbar from "../components/Navbar";

const HADITH_COLLECTIONS = [
  { slug: "eng-bukhari",  bookName: "Sahih al Bukhari", count: 7563 },
  { slug: "eng-muslim",   bookName: "Sahih Muslim",     count: 7563 },
  { slug: "eng-abudawud", bookName: "Sunan Abu Dawud",  count: 5274 },
  { slug: "eng-ibnmajah", bookName: "Sunan Ibn Majah",  count: 4341 },
  { slug: "eng-tirmidhi", bookName: "Jami At Tirmidhi", count: 3956 },
];

function HomePage() {
  const [pageNum, setPageNum] = useState("");
  const [pageError, setPageError] = useState("");
  const navigate = useNavigate();

  const [hadith, setHadith] = useState(null);
  const [hadithLoading, setHadithLoading] = useState(true);

  useEffect(() => {
    const daysSinceEpoch = Math.floor(Date.now() / 86400000);
    const collection = HADITH_COLLECTIONS[daysSinceEpoch % HADITH_COLLECTIONS.length];
    const hadithNumber = (daysSinceEpoch % collection.count) + 1;

    const primary  = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${collection.slug}/${hadithNumber}.json`;
    const fallback = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${collection.slug}/${hadithNumber}.min.json`;

    fetch(primary)
      .catch(() => fetch(fallback))
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data) => {
        // Response shape: { hadiths: [{ hadithnumber, text, grades, reference }], metadata: { name, section, section_detail } }
        const h = data.hadiths?.[0];
        if (!h) throw new Error("No hadith found");

        // section is an object like { "70": "Food, Meals" } — grab the first value
        const sectionKey = Object.keys(data.metadata?.section || {})[0];
        const sectionName = sectionKey ? data.metadata.section[sectionKey] : null;

        setHadith({
          text: h.text,
          hadithnumber: h.hadithnumber,
          bookName: data.metadata?.name,
          sectionName,
        });
      })
      .catch(() => null)
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
          <h2 className="home-card-title">Browse by Surah</h2>
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
          <h2 className="home-card-title">Browse by Juz</h2>
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
          <h2 className="home-card-title">Jump to Page</h2>
          <p className="home-card-arabic">انتقل إلى صفحة</p>
          <p className="home-card-desc">
            Navigate directly to any of the 604 pages of the Mushaf. Enter a page number below.
          </p>
          <div className="page-jump-row">
            <Form.Control
              type="number"
              className="page-jump-input"
              placeholder="Page number (1-604)"
              aria-label="Go to page number"
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
          {pageError && <Alert variant="danger" className="page-jump-error">{pageError}</Alert>}
        </div>
      </section>

      {/* Quick Reference Stats */}
      <section className="home-stats">
        <h2 className="home-stats-title">Quick Reference</h2>
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
        <h2 className="home-hadith-title">
          <span className="home-hadith-title-icon">☽</span>
          Hadith of the Day
        </h2>
        {hadithLoading && (
          <p className="home-hadith-loading">Loading hadith…</p>
        )}
        {hadith && !hadithLoading && (
          <div className="home-hadith-card">
            <div className="home-hadith-meta">
              <span className="home-hadith-book">{hadith.bookName}</span>
              {hadith.sectionName && (
                <span className="home-hadith-chapter">{hadith.sectionName}</span>
              )}
            </div>
            <p className="home-hadith-text">{hadith.text}</p>
            <p className="home-hadith-ref">Hadith #{hadith.hadithnumber}</p>
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
