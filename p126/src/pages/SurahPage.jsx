import { useParams } from "react-router-dom";

function SurahPage({ surahs }) {
  const {id} = useParams();

  const surah = surahs.find((s) => s.transliteration === id);

  if (!surah) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{surah.transliteration}</h2>
      <h3>{surah.name}</h3>

      {surah.verses.map((verse) => (
        <p key={verse.id}>{verse.text}</p>
      ))}
    </div>
  );
}

export default SurahPage;