import { useState, useEffect } from "react";

const HADITH_COLLECTIONS = [
  { name: "sahih-bukhari", count: 7563 },
  { name: "sahih-muslim", count: 3032 },
  { name: "abu-dawood", count: 3998 },
  { name: "ibn-e-majah", count: 4342 },
  { name: "al-tirmidhi", count: 3956 },
];

const API_KEY = "$2y$10$pEbfRCeC3QQ29yAguJjT5kk0cDAg1UyF9Oh85JAybFK9VlpRGR92";

function HadithOfTheDay() {
  const [hadith, setHadith] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const daysSinceEpoch = Math.floor(Date.now() / 86400000);
    const collection = HADITH_COLLECTIONS[daysSinceEpoch % HADITH_COLLECTIONS.length];
    const hadithNumber = (daysSinceEpoch % collection.count) + 1;

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
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="home-hadith">
      <h3 className="home-hadith-title">
        <span className="home-hadith-title-icon">☽</span>
        Hadith of the Day
      </h3>
      {loading && <p className="home-hadith-loading">Loading hadith…</p>}
      {error && !loading && <p className="home-hadith-loading">Could not load hadith.</p>}
      {hadith && !loading && (
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
  );
}

export default HadithOfTheDay;
