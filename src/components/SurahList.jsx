import { useState } from "react";
import { Card } from "react-bootstrap";
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
          <Card
            role="button"
            key={surah.number}
            onClick={() => navigate(`/surah/${surah.number}`)}
            className="mb-3 shadow-sm surah-card"
          >
            <Card.Body>
              <Card.Title>{surah.englishName}</Card.Title>
              <Card.Text>{surah.name}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default SurahList;
