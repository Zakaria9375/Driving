# Ceļš — Latvia and Germany driving practice

320 official Latvian road-sign images, with English and German names and study descriptions.

The **Study collection** selector also opens **Germany · differences**, a separate collection of 45 cards: 30 signs, 5 supplementary-plate examples and 10 driving-rule scenarios. It covers selected differences from Latvia, including environmental zones, bicycle streets, walking-pace areas, motorway rules, winter tyres and parking. Every card includes an English and German explanation and comparison. Germany progress and resets are independent of Latvia; existing Latvia progress is preserved.

Use the **Language / Sprache** selector at the top of the page to switch between **English** and **Deutsch**. It translates the interface and all 365 cards, remembers your choice in this browser, and preserves your current card, revealed answer, filters and ratings. Search works with English and German names and scenario prompts. Original names and official source links remain available.

## Start
```
npm install
npm run dev
```
Open http://localhost:5173. For production use `npm run build` and `npm run preview`.

Reveal each meaning, then choose **Practice again** or **I know this**. Use the category list, search, shuffle, and saved-rating filters to target your practice. The library lets you open any sign as a card. Keyboard shortcuts: Space reveals, left/right arrows browse, 1 marks for review, 2 marks known. Keyboard shortcuts are paused while using inputs and other interactive controls.

Progress is stored in this browser and can be reset. All sign images are local; the running app needs no AI service. The optional font uses Google Fonts, with a system-font fallback.

## Source and checks
Images and Latvian names: [Latvian traffic regulations, Appendix 4](https://likumi.lv/ta/id/274865-celu-satiksmes-noteikumi). Retrieved 14 October 2026, current edition effective from 1 July 2026. English and German text are study summaries of section 26; exceptions and full rules remain in the linked official regulations.

`npm run check:data` verifies every English and German entry, scenario prompt, comparison and local image. `npm run import:signs` extracts the catalogue from `regulations.html`; `npm run assets` downloads its images. All 320 numbered signs in Appendix 4 are included; road markings, signals, and every possible variable text/value configuration are separate from this deck.

Germany sources: [StVO](https://www.gesetze-im-internet.de/stvo_2013/), particularly Annexes 2 and 3 and the linked rule sections. The Germany collection is curated, not an exhaustive German sign catalogue or driving course. `node scripts/germany-sources.mjs` retrieves its official source pages; `node scripts/download-germany.mjs` downloads the selected official images. `sources/germany-images.json` records each asset's origin. Sources checked 14 October 2026.
