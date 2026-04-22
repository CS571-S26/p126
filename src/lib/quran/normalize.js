const ZERO_WIDTH_PATTERN = /[\u200f\u200e\ufeff\u200b]/g;

function buildAyah(arabicAyah, translationAyah, audioAyah) {
  return {
    number: arabicAyah.number,
    numberInSurah: arabicAyah.numberInSurah,
    page: arabicAyah.page,
    text: arabicAyah.text,
    translation: translationAyah?.text || "Translation not available",
    audio: audioAyah?.audioSecondary,
    surah: arabicAyah.surah,
  };
}

function shouldStripBismillah(surahNumber, ayah) {
  return Boolean(ayah) && ayah.numberInSurah === 1 && surahNumber !== 1 && surahNumber !== 9;
}

export function stripPrependedBismillah(ayahs, surahNumber) {
  if (!ayahs.length || !shouldStripBismillah(surahNumber, ayahs[0])) {
    return { ayahs, bismillah: null };
  }

  const clean = ayahs[0].text.replace(ZERO_WIDTH_PATTERN, "").trim();
  const words = clean.split(/\s+/);

  if (!words[0]?.startsWith("بِسْمِ")) {
    return { ayahs, bismillah: null };
  }

  return {
    bismillah: words.slice(0, 4).join(" "),
    ayahs: [{ ...ayahs[0], text: words.slice(4).join(" ") }, ...ayahs.slice(1)],
  };
}

export function groupAyahsByPage(ayahs) {
  return ayahs.reduce((pages, ayah) => {
    const last = pages[pages.length - 1];

    if (!last || last.page !== ayah.page) {
      pages.push({ page: ayah.page, ayahs: [ayah] });
    } else {
      last.ayahs.push(ayah);
    }

    return pages;
  }, []);
}

export function groupAyahsBySurah(ayahs) {
  return ayahs.reduce((groups, ayah) => {
    const last = groups[groups.length - 1];

    if (!last || last.surahNumber !== ayah.surah.number) {
      groups.push({
        surahNumber: ayah.surah.number,
        surah: ayah.surah,
        ayahs: [ayah],
      });
    } else {
      last.ayahs.push(ayah);
    }

    return groups;
  }, []);
}

export function addBismillahToSurahGroups(groups) {
  return groups.map((group) => {
    const { ayahs, bismillah } = stripPrependedBismillah(group.ayahs, group.surahNumber);
    return { ...group, ayahs, bismillah };
  });
}

export function normalizeSurahData(editions, surahId) {
  const [arabic, english, audio] = editions;
  const surahMeta = {
    englishName: arabic.englishName,
    englishNameTranslation: arabic.englishNameTranslation,
    name: arabic.name,
    numberOfAyahs: arabic.numberOfAyahs,
    revelationType: arabic.revelationType,
  };

  const combinedAyahs = arabic.ayahs.map((ayah, index) =>
    buildAyah(ayah, english.ayahs[index], audio.ayahs[index])
  );
  const { ayahs, bismillah } = stripPrependedBismillah(combinedAyahs, parseInt(surahId, 10));

  return {
    surahMeta,
    ayahs,
    bismillah,
    pages: groupAyahsByPage(ayahs),
  };
}

export function normalizeJuzData(arabic, english) {
  const arabicAyahs = arabic?.ayahs;
  const englishAyahs = english?.ayahs;

  if (!Array.isArray(arabicAyahs) || !Array.isArray(englishAyahs)) {
    throw new Error("Invalid data format from API");
  }

  const ayahs = arabicAyahs.map((ayah, index) => buildAyah(ayah, englishAyahs[index]));
  return addBismillahToSurahGroups(groupAyahsBySurah(ayahs));
}

export function normalizePageData(arabic, english, audio) {
  const arabicAyahs = arabic?.ayahs;
  const englishAyahs = english?.ayahs;
  const audioAyahs = audio?.ayahs;

  if (!Array.isArray(arabicAyahs) || !Array.isArray(englishAyahs) || !Array.isArray(audioAyahs)) {
    throw new Error("Invalid data format from API");
  }

  const ayahs = arabicAyahs.map((ayah, index) =>
    buildAyah(ayah, englishAyahs[index], audioAyahs[index])
  );

  return addBismillahToSurahGroups(groupAyahsBySurah(ayahs));
}
