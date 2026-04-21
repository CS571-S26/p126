import { useNavigate } from "react-router-dom";

function SurahNav({ title, subtitle, showTranslation, onToggleTranslation }) {
  const navigate = useNavigate();
  return (
    <nav className="surah-nav">
      <button className="surah-nav-back" onClick={() => navigate("/")}>← Back to Home</button>
      <div className="surah-nav-title">
        <div className="surah-nav-english">{title}</div>
        <div className="surah-nav-translation">{subtitle}</div>
      </div>
      <button className="translation-toggle" onClick={onToggleTranslation}>
        {showTranslation ? "Hide Translation" : "Show Translation"}
      </button>
    </nav>
  );
}

export default SurahNav;
