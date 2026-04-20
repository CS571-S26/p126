import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div>
      <Navbar />
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search surah..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="surah-container">
        {filtered.map((surah) => (
          <div
            role="button"
            key={surah.number}
            onClick={() => navigate(`/surah/${surah.number}`)}
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