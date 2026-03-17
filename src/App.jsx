import { useEffect, useState } from "react";
import SurahList from "./components/SurahList.jsx";
import SurahPage from "./pages/SurahPage";
import { Routes, Route } from "react-router-dom";

function App() {
  const [surahs, setSurahs] = useState([]);

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/quran-cloud@1.0.0/dist/quran.json")
      .then((res) => res.json())
      .then((data) => {
        setSurahs(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<SurahList surahs={surahs} />} />
        <Route path="/surah/:id" element={<SurahPage surahs={surahs} />} />
      </Routes>
    </div>
  );
}

export default App;