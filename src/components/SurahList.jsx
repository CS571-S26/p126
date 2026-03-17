import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function SurahList({ surahs }) {
  const navigate = useNavigate();

  return (
    <div className="surah-container">
      {surahs.map((surah) => (
        <Card
          role="button"
          key={surah.id}
          onClick={() => navigate(`/surah/${surah.transliteration}`)}
          className="mb-3 shadow-sm surah-card"
        >
          <Card.Body> 
            <Card.Title>{surah.transliteration}</Card.Title>
            <Card.Text>{surah.name}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default SurahList;