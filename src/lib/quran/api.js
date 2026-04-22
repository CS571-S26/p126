const API_BASE = "https://api.alquran.cloud/v1";

async function fetchJson(path) {
  const response = await fetch(`${API_BASE}${path}`);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const payload = await response.json();

  if (!payload || typeof payload !== "object" || !("data" in payload)) {
    throw new Error("Invalid data format from API");
  }

  return payload.data;
}

export async function fetchSurahEditions(id) {
  const data = await fetchJson(`/surah/${id}/editions/quran-uthmani,en.sahih,ar.alafasy`);

  if (!Array.isArray(data) || data.length < 3) {
    throw new Error("Invalid surah data format from API");
  }

  return data;
}

export async function fetchJuzArabic(num) {
  return fetchJson(`/juz/${num}/quran-uthmani`);
}

export async function fetchJuzTranslation(num) {
  return fetchJson(`/juz/${num}/en.asad`);
}

export async function fetchPageArabic(num) {
  return fetchJson(`/page/${num}/quran-uthmani`);
}

export async function fetchPageTranslation(num) {
  return fetchJson(`/page/${num}/en.sahih`);
}

export async function fetchPageAudio(num) {
  return fetchJson(`/page/${num}/ar.alafasy`);
}
