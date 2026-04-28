import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Navbar from "../components/Navbar";

function JuzPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [juzRanges, setJuzRanges] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("https://api.alquran.cloud/v1/surah").then((r) => r.json()),
      fetch("https://api.alquran.cloud/v1/meta").then((r) => r.json()),
    ]).then(([surahRes, metaRes]) => {
      const surahMap = {};
      for (const s of surahRes.data) surahMap[s.number] = s;

      const refs = metaRes.data.juzs.references;
      const ranges = refs.map((ref, i) => {
        const start = { ...ref, englishName: surahMap[ref.surah].englishName };
        let endSurah, endAyah;
        if (i < 29) {
          const next = refs[i + 1];
          if (next.ayah > 1) {
            endSurah = next.surah;
            endAyah = next.ayah - 1;
          } else {
            endSurah = next.surah - 1;
            endAyah = surahMap[endSurah].numberOfAyahs;
          }
        } else {
          endSurah = 114;
          endAyah = surahMap[114].numberOfAyahs;
        }
        const end = { surah: endSurah, ayah: endAyah, englishName: surahMap[endSurah].englishName };
        return { start, end };
      });
      setJuzRanges(ranges);
    });
  }, []);

  const juzData = Array.from({ length: 30 }, (_, i) => ({
    number: i + 1,
    arabicName: `الجزء ${(i + 1).toLocaleString("ar-EG")}`,
  }));

  const filtered = juzData.filter((juz) =>
    juz.number.toString().includes(search) || juz.arabicName.includes(search)
  );

  return (
    <div className="surah-list-page">
      <Navbar />

      <div className="surah-list-header-wrap">
        <div className="surah-list-header">
          <div className="surah-list-header-left">
            <Button variant="" className="back-home-btn" onClick={() => navigate("/")}>← Home</Button>
            <div className="surah-list-header-text">
              <h2 className="surah-list-title">Browse by Juz</h2>
              <p className="surah-list-subtitle">Select a section to begin reading</p>
            </div>
          </div>
          <Form.Control
            type="text"
            className="search-input"
            placeholder="Search Juz..."
            aria-label="Search juz"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="surah-container">
        {filtered.map((juz) => {
          const range = juzRanges[juz.number - 1];
          const subtitle = range
            ? `${range.start.englishName} - ${range.end.englishName}`
            : `Part ${juz.number} of 30`;
          return (
            <div
              key={juz.number}
              className="surah-card"
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/juz/${juz.number}`)}
              onKeyDown={(e) => e.key === "Enter" && navigate(`/juz/${juz.number}`)}
            >
              <div className="surah-card-left">
                <div className="surah-number-badge">{juz.number}</div>
                <div className="surah-card-info">
                  <div className="surah-english-name">Juz {juz.number}</div>
                  <div className="surah-translation">{subtitle}</div>
                </div>
              </div>
              <div className="surah-arabic-name">{juz.arabicName}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default JuzPage;
