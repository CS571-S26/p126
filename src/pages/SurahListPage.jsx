import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Navbar from "../components/Navbar";

function SurahListPage() {
  const navigate = useNavigate();
  const [surahs, setSurahs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/meta")
      .then((res) => res.json())
      .then((data) => setSurahs(data.data.surahs.references))
      .catch((err) => console.error(err));
  }, []);

  const filtered = surahs.filter((surah) =>
    surah.englishName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="surah-list-page">
      <Navbar />
      <div className="surah-list-header-wrap">
        <div className="surah-list-header">
          <div className="surah-list-header-left">
            <Button variant="" className="back-home-btn" onClick={() => navigate("/")}>← Home</Button>
            <div className="surah-list-header-text">
              <h2 className="surah-list-title">Browse by Surah</h2>
              <p className="surah-list-subtitle">Select a chapter to begin reading</p>
            </div>
          </div>
          <Form.Control
            type="text"
            className="search-input"
            placeholder="Search surah..."
            aria-label="Search surahs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="surah-container">
        {filtered.map((surah) => (
          <div
            role="button"
            tabIndex={0}
            key={surah.number}
            onClick={() => navigate(`/surah/${surah.number}`)}
            onKeyDown={(e) => e.key === "Enter" && navigate(`/surah/${surah.number}`)}
            className="surah-card"
          >
            <div className="surah-card-left">
              <div className="surah-number-badge">{surah.number}</div>
              <div className="surah-card-info">
                <div className="surah-english-name">{surah.englishName}</div>
                <div className="surah-translation">{surah.englishNameTranslation}</div>
                <div className="surah-meta">{surah.numberOfAyahs} verses &nbsp;•&nbsp; {surah.revelationType}</div>
              </div>
            </div>
            <div className="surah-arabic-name">{surah.name.split(" ").slice(1).join(" ")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SurahListPage;
