import { useEffect, useState } from "react";
import SurahList from "./components/SurahList.jsx";
import SurahPage from "./pages/SurahPage";
import { Routes, Route } from "react-router-dom";

function App() {
  const [surahs, setSurahs] = useState([]);

  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/meta")
      .then((res) => res.json())
      .then((data) => {
        setSurahs(data.data.surahs.references);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<SurahList surahs={surahs} />} />
        <Route path="/surah/:id" element={<SurahPage />} />
      </Routes>
    </div>
  );
}

export default App;