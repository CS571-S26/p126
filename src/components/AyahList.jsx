function AyahList({ ayahs, showTranslation, onAyahClick }) {
  if (showTranslation) {
    return ayahs.map((ayah) => (
      <div key={ayah.number} className="ayah-row" onClick={() => onAyahClick(ayah)}>
        <div className="ayah-english-col">{ayah.translation}</div>
        <div className="ayah-arabic-col">
          {ayah.text}
          <span className="ayah-number">{ayah.numberInSurah}</span>
        </div>
      </div>
    ));
  }
  return ayahs.map((ayah) => (
    <span key={ayah.number} className="ayah-clickable" onClick={() => onAyahClick(ayah)}>
      {ayah.text}
      <span className="ayah-number">{ayah.numberInSurah}</span>
    </span>
  ));
}

export default AyahList;
