# p126 Quran Web Project

`p126` is a React + Vite Quran reader that lets users explore the Quran by Surah, Juz, or Mushaf page.

## Features

- Browse all 114 surahs with search
- Read any surah in scroll, page, or memorization mode
- Browse all 30 juz and open a juz detail reader
- Jump directly to any Mushaf page from 1 to 604
- Toggle English translation while reading
- Open an ayah modal with audio playback

## Routes

- `/` home page
- `/surah` surah list
- `/surah/:id` surah reader
- `/juz` juz list
- `/juz/:num` juz detail reader
- `/page/:num` Mushaf page reader

## Data Source

The app fetches Quran content from `https://api.alquran.cloud/v1`.

Current editions in use:

- Surah reader: `quran-uthmani`, `en.sahih`, `ar.alafasy`
- Juz reader: `quran-uthmani`, `en.asad`
- Page reader: `quran-uthmani`, `en.sahih`, `ar.alafasy`

## Project Structure

Key directories inside `src/`:

- `pages/` route-level screens
- `components/` reusable UI pieces
- `hooks/` page-focused data hooks such as `useSurahData`, `useJuzData`, and `usePageData`
- `lib/quran/` shared Quran API and normalization helpers

## Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Run lint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

## Deployment

Vite is configured with:

- `base: "/p126/"`
- `build.outDir: "docs"`

That makes the project suitable for GitHub Pages style deployment from the `docs/` directory.
