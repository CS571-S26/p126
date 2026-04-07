right now im feeling like changing the API. 

http://api.alquran.cloud/v1/meta will return: 
{
    "code": 200,
    "status": "OK",
    "data": {
        "ayahs": {
            "count": 6236
        },
        "surahs": {
            "count": 114,
            "references": [
                {
                    "number": 1,
                    "name": "سُورَةُ ٱلْفَاتِحَةِ",
                    "englishName": "Al-Faatiha",
                    "englishNameTranslation": "The Opening",
                    "numberOfAyahs": 7,
                    "revelationType": "Meccan"
                },
                {
                    "number": 2,
                    "name": "سُورَةُ البَقَرَةِ",
                    "englishName": "Al-Baqara",
                    "englishNameTranslation": "The Cow",
                    "numberOfAyahs": 286,
                    "revelationType": "Medinan"
                },
                {
                    "number": 3,
                    "name": "سُورَةُ آلِ عِمۡرَانَ",
                    "englishName": "Aal-i-Imraan",
                    "englishNameTranslation": "The Family of Imraan",
                    "numberOfAyahs": 200,
                    "revelationType": "Medinan"
                },...

if we want to get each surah of the quran, we will use:https://api.alquran.cloud/v1/surah/114/editions/quran-uthmani

response is: 
{
    "code": 200,
    "status": "OK",
    "data": {
        "surahs": [
            {
                "number": 1,
                "name": "سُورَةُ ٱلْفَاتِحَةِ",
                "englishName": "Al-Faatiha",
                "englishNameTranslation": "The Opening",
                "revelationType": "Meccan",
                "ayahs": [
                    {
                        "number": 1,
                        "text": "﻿بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
                        "numberInSurah": 1,
                        "juz": 1,
                        "manzil": 1,
                        "page": 1,
                        "ruku": 1,
                        "hizbQuarter": 1,
                        "sajda": false
                    },
                    {
                        "number": 2,
                        "text": "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
                        "numberInSurah": 2,
                        "juz": 1,
                        "manzil": 1,
                        "page": 1,
                        "ruku": 1,
                        "hizbQuarter": 1,
                        "sajda": false
                    },
                    {
                        "number": 3,
                        "text": "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
                        "numberInSurah": 3,
                        "juz": 1,
                        "manzil": 1,
                        "page": 1,
                        "ruku": 1,
                        "hizbQuarter": 1,
                        "sajda": false
                    },
                    {
                        "number": 4,
                        "text": "مَٰلِكِ يَوْمِ ٱلدِّينِ",
                        "numberInSurah": 4,
                        "juz": 1,
                        "manzil": 1,
                        "page": 1,
                        "ruku": 1,
                        "hizbQuarter": 1,
                        "sajda": false
                    },

Quran Reader Web App — Implementation Guide (Mushaf-Style + Interactive)
🎯 Objective

Build a Quran reading website that:

Displays a full surah in a continuous, Mushaf-like layout
Allows users to click any ayah
Shows a popup (modal) with:
English translation
Optional audio playback

🧱 System Overview
Core Architecture

The application consists of three conceptual layers:

1. Data Layer
Fetch Quran data from an external API
Each ayah should include:
Arabic text
Ayah number
Translation (English)
Optional audio URL

2. Rendering Layer (UI)
Display the entire surah as a single flowing block of text
Ayat are rendered inline, not as separate cards
Layout should resemble a physical Quran page (Mushaf)

3. Interaction Layer
- Make each ayah interactive. Even though ayat are inline, each ayah must still be treated as a distinct clickable unit. 

Clicking an ayah opens a modal
- Modal displays translation and optional audio (implement later)
- When an ayah is clicked:
- Open modal
- Display translation english 
- Optionally include audio player (implement later)

Modal Requirements
- Centered on screen
- Overlay background (dimmed)
- Close button or click outside to dismiss

eg: 
for english translation for surah 110: fetch: http://api.alquran.cloud/v1/surah/110/en.arberry
response: 
{
    "code": 200,
    "status": "OK",
    "data": {
        "number": 110,
        "name": "سُورَةُ النَّصۡرِ",
        "englishName": "An-Nasr",
        "englishNameTranslation": "Divine Support",
        "revelationType": "Medinan",
        "numberOfAyahs": 3,
        "ayahs": [
            {
                "number": 6214,
                "text": "When comes the help of God, and victory,",
                "numberInSurah": 1,
                "juz": 30,
                "manzil": 7,
                "page": 603,
                "ruku": 552,
                "hizbQuarter": 240,
                "sajda": false
            },
            {
                "number": 6215,
                "text": "and thou seest men entering God's religion in throngs,",
                "numberInSurah": 2,
                "juz": 30,
                "manzil": 7,
                "page": 603,
                "ruku": 552,
                "hizbQuarter": 240,
                "sajda": false
            },...

4. Selected ayah audio implementation

to get the audio, we will fetch: http://api.alquran.cloud/v1/quran/ar.alafasy
response: 
{
    "code": 200,
    "status": "OK",
    "data": {
        "surahs": [
            {
                "number": 1,
                "name": "سُورَةُ ٱلْفَاتِحَةِ",
                "englishName": "Al-Faatiha",
                "englishNameTranslation": "The Opening",
                "revelationType": "Meccan",
                "ayahs": [
                    {
                        "number": 1,
                        "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3",
                        "audioSecondary": [
                            "https://cdn.islamic.network/quran/audio/64/ar.alafasy/1.mp3"
                        ],
                        "text": "﻿بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
                        "numberInSurah": 1,
                        "juz": 1,
                        "manzil": 1,
                        "page": 1,
                        "ruku": 1,
                        "hizbQuarter": 1,
                        "sajda": false
                    },...

how it should work: 
- when user clicks an ayah, modal opens, audio player reads ayah.audio. 

modal behavior: 
inside the modal: 
- should also show audio player alongside all the other detail

behavior expectation: 
when modal opens: 
- user presses play, then audio plays
- when modal closes, then audio stops


