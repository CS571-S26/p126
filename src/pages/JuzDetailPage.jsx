import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AyahModal from "../components/AyahModal";
 
function JuzDetailPage() {
  const { num } = useParams();
  const navigate = useNavigate();
  const [surahGroups, setSurahGroups] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [selectedAyah, setSelectedAyah] = useState(null);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchJuzData = async () => {
      try {
        setError(null);
        
        // Fetch Arabic Quran text and English translation in parallel
        const [arabicRes, englishRes] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/juz/${num}/quran-uthmani`),
          fetch(`https://api.alquran.cloud/v1/juz/${num}/en.asad`)
        ]);
        
        if (!arabicRes.ok || !englishRes.ok) {
          throw new Error(`API Error: ${!arabicRes.ok ? arabicRes.status : englishRes.status}`);
        }
        
        const arabicData = await arabicRes.json();
        const englishData = await englishRes.json();
        
        if (!arabicData.data || !arabicData.data.ayahs) {
          throw new Error("Invalid data format from API");
        }
        
        const arabicAyahs = arabicData.data.ayahs;
        const englishAyahs = englishData.data.ayahs;
        
        const ayahs = arabicAyahs.map((ayah, i) => ({
          number: ayah.number,
          numberInSurah: ayah.numberInSurah,
          page: ayah.page,
          text: ayah.text,
          translation: englishAyahs[i]?.text || "Translation not available",
          surah: ayah.surah,
        }));
 
        const groups = ayahs.reduce((acc, ayah) => {
          const last = acc[acc.length - 1];
          if (!last || last.surahNumber !== ayah.surah.number) {
            acc.push({ 
              surahNumber: ayah.surah.number, 
              surah: ayah.surah, 
              ayahs: [ayah], 
              bismillah: null 
            });
          } else {
            last.ayahs.push(ayah);
          }
          return acc;
        }, []);
 
        groups.forEach((group) => {
          if (group.surahNumber !== 1 && group.surahNumber !== 9 && group.ayahs[0]?.numberInSurah === 1) {
            const clean = group.ayahs[0].text.replace(/[‏‎﻿​]/g, "").trim();
            const words = clean.split(/\s+/);
            if (words[0].startsWith("بِسْمِ")) {
              group.bismillah = words.slice(0, 4).join(" ");
              group.ayahs[0] = { ...group.ayahs[0], text: words.slice(4).join(" ") };
            }
          }
        });
 
        setSurahGroups(groups);
      } catch (err) {
        console.error("Error fetching Juz data:", err);
        setError(err.message || "Failed to load Juz. Please try again.");
      }
    };
    
    fetchJuzData();
  }, [num]);
 
  if (error) {
    return (
      <div>
        <Navbar />
        <div className="error-container">
          <p className="error-message">⚠️ {error}</p>
          <button className="error-back-btn" onClick={() => navigate("/juz")}>
            ← Back to Juz List
          </button>
        </div>
      </div>
    );
  }
  
  if (!surahGroups) {
    return (
      <div>
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="juz-loading">Loading Juz {num}...</p>
        </div>
      </div>
    );
  }
 
  return (
    <div>
      <Navbar />
      <nav className="surah-nav">
        <button className="surah-nav-back" onClick={() => navigate("/juz")}>
          {"←"} Back to Juz List
        </button>
        <div className="surah-nav-title">
          <div className="surah-nav-english">Juz {num}</div>
          <div className="surah-nav-translation">{"الجزء"} {num}</div>
        </div>
        <button className="translation-toggle" onClick={() => setShowTranslation((t) => !t)}>
          {showTranslation ? "Hide Translation" : "Show Translation"}
        </button>
      </nav>
 
      {surahGroups.map((group) => (
        <div key={group.surahNumber}>
          <div className="juz-surah-divider" role="button" onClick={() => navigate(`/surah/${group.surahNumber}`)}>
            <div className="juz-surah-divider-number">{group.surahNumber}</div>
            <div className="juz-surah-divider-info">
              <span className="juz-surah-divider-english">{group.surah.englishName}</span>
              <span className="juz-surah-divider-translation">{group.surah.englishNameTranslation}</span>
            </div>
            <div className="juz-surah-divider-arabic">{group.surah.name}</div>
            <span className="juz-surah-divider-link">Read full surah {"→"}</span>
          </div>
 
          {group.bismillah && <div className="bismillah">{group.bismillah}</div>}
 
          <div className={`mushaf-page${showTranslation ? " mushaf-bilingual" : ""}`}>
            {showTranslation
              ? group.ayahs.map((ayah) => (
                  <div key={ayah.number} className="ayah-row" onClick={() => setSelectedAyah(ayah)}>
                    <div className="ayah-english-col">{ayah.translation}</div>
                    <div className="ayah-arabic-col">
                      {ayah.text}
                      <span className="ayah-number">{ayah.numberInSurah}</span>
                    </div>
                  </div>
                ))
              : group.ayahs.map((ayah) => (
                  <span key={ayah.number} className="ayah-clickable" onClick={() => setSelectedAyah(ayah)}>
                    {ayah.text}
                    <span className="ayah-number">{ayah.numberInSurah}</span>
                  </span>
                ))}
          </div>
        </div>
      ))}
 
      <AyahModal ayah={selectedAyah} onClose={() => setSelectedAyah(null)} />
    </div>
  );
}
 
export default JuzDetailPage;