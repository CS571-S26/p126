import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SurahList({ surahs }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = surahs.filter((surah) =>
    surah.englishName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
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
<<<<<<< HEAD
            <div className="surah-number-badge">{surah.number}</div>
            <Card.Body className="surah-card-body">
              <Card.Title className="surah-title">{surah.englishName}</Card.Title>
              <Card.Text className="surah-text">{surah.name}</Card.Text>
            </Card.Body>
          </Card>
=======
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
>>>>>>> 18abb10 (reorganize based on pages in surahs. add sticky nav bar to SurahPage with back button and translation toggle. redesign some styling.)
        ))}
      </div>
    </div>
  );
}

export default SurahList;
