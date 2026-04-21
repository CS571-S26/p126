import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";

function JuzPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const juzData = Array.from({ length: 30 }, (_, i) => ({
    number: i + 1,
    arabicName: `الجزء ${i + 1}`,
  }));

  const filtered = juzData.filter((juz) =>
    juz.number.toString().includes(search) || juz.arabicName.includes(search)
  );

  return (
    <div>
      <Navbar />
      
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by Juz number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="surah-container">
        {filtered.map((juz) => (
          <div
            key={juz.number}
            className="surah-card"
            onClick={() => navigate(`/juz/${juz.number}`)}
          >
            <div className="surah-card-left">
              <div className="surah-number-badge">{juz.number}</div>
              <div className="surah-card-info">
                <div className="surah-english-name">Juz {juz.number}</div>
                <div className="surah-translation">Part {juz.number} of 30</div>
              </div>
            </div>
            <div className="surah-arabic-name">{juz.arabicName}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JuzPage;