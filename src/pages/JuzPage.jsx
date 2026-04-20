import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function JuzPage() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="placeholder-page">
        <div className="placeholder-icon placeholder-icon--teal">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        </div>
        <h2 className="placeholder-title">Browse by Juz</h2>
        <p className="placeholder-arabic">تصفح بالجزء</p>
        <p className="placeholder-desc">
          This feature is coming soon. You will be able to explore all 30 Juz of the Quran here.
        </p>
        <button className="placeholder-back-btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default JuzPage;