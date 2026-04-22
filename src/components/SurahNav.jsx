import { useNavigate } from "react-router-dom";

function SurahNav({ title, subtitle, showTranslation, onToggleTranslation, viewMode, onToggleViewMode }) {
  const navigate = useNavigate();
  return (
    <nav className="surah-nav">
      <button className="surah-nav-back" onClick={() => navigate("/")}>← Back to Home</button>
      <div className="surah-nav-title">
        <div className="surah-nav-english">{title}</div>
        <div className="surah-nav-translation">{subtitle}</div>
      </div>
      <div className="surah-nav-controls">
        {onToggleViewMode && (
          <button className="translation-toggle" onClick={onToggleViewMode}>
            {viewMode === "scroll" ? "Page Mode" : "Scroll Mode"}
          </button>
        )}
        <button className="translation-toggle" onClick={onToggleTranslation}>
          {showTranslation ? "Hide Translation" : "Show Translation"}
        </button>
      </div>
    </nav>
  );
}

export default SurahNav;
