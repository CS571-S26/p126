import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SurahListPage from "./pages/SurahListPage";
import SurahPage from "./pages/SurahPage";
import JuzPage from "./pages/JuzPage";
import JuzDetailPage from "./pages/JuzDetailPage";
import QuranPageView from "./pages/QuranPageView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/surah" element={<SurahListPage />} />
      <Route path="/surah/:id" element={<SurahPage />} />
      <Route path="/juz" element={<JuzPage />} />
      <Route path="/juz/:num" element={<JuzDetailPage />} />
      <Route path="/page/:num" element={<QuranPageView />} />
    </Routes>
  );
}

export default App;