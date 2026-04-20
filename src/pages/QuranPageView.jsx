import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function QuranPageView() {
  const { num } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="placeholder-page">
        <div className="placeholder-icon placeholder-icon--cyan">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <h2 className="placeholder-title">Page {num}</h2>
        <p className="placeholder-arabic">انتقل إلى صفحة</p>
        <p className="placeholder-desc">
          Page-based navigation is coming soon. You will be able to read Mushaf page {num} of 604 here.
        </p>
        <button className="placeholder-back-btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default QuranPageView;