# Latvia and Germany driving practice

React + Vite personal study app. Run `npm install`, then `npm run dev` (localhost:5173). `npm run build` creates the production bundle; `npm run preview` serves it. `npm run check:data` verifies all catalogue entries and local image assets.

## Structure
- `src/main.jsx`: flashcards, category/search filters, library and saved progress.
- `src/decks.js`: isolated country-deck configuration; keyed study-app instances reset the controls on country changes.
- `src/germany.js`: curated Germany differences deck: 30 signs, 5 supplementary-plate examples and 10 driving-rule scenarios, with English meanings, comparisons and official sources.
- `src/styles.css`: responsive interface and reduced-motion styling.
- `src/signs.raw.json`: 320 numbered entries from Appendix 4 of Latvian Cabinet Regulation 279, as retrieved 14 October 2026.
- `src/english.js` and `src/german.js`: English and German study names and summaries for all Latvian signs; preserve sign-number mappings when editing.
- `src/germany.de.js`: German translations of all Germany card explanations, comparisons and scenario prompts.
- `src/i18n.js`: interface/deck-label translations and language preference helpers. The English/Deutsch selector applies to both country collections without resetting the current study session.
- `public/signs/`: original official sign images, used locally by the app.
- `public/signs/germany/`: 35 official German images, separate from the Latvian assets.
- `sources/`: German official source snapshots and `germany-images.json` image provenance. `scripts/germany-sources.mjs` retrieves the StVO pages; `scripts/download-germany.mjs` downloads the selected images.
- `regulations.html`: source catalogue snapshot with website scripts and inline event handlers removed, not generated build output.
- `scripts/import-signs.mjs`: extract entries from the snapshot; `npm run import:signs`.
- `scripts/download-signs.mjs`: download the catalogue images; `npm run assets`.
- `scripts/check-data.mjs`: content and asset completeness checks.

Latvia progress is stored under `cels-progress-v1`; Germany uses `cels-germany-progress-v1`. Ratings, filters and resets must not cross country boundaries. Preserve the existing Latvia key to retain users’ progress. The interface and all 365 cards support English and German. The language preference is stored separately under `cels-language-v1` (English by default); changing languages preserves ratings, filters, card order and the revealed answer. Search matches names and scenario prompts in both languages. No backend, API keys, or environment variables are required. English and German text are study summaries, with links to the authoritative regulations. Latvia includes all 320 catalogue sign entries; Germany is a curated differences collection, not the complete German catalogue. Rule cards have prompts instead of invented sign images. Additional variable sign layouts are represented by official catalogue examples.

`scripts/browser-check.mjs` verifies the study workflow, country isolation, scoped resets, bilingual interface/content, language persistence, session preservation, keyboard shortcuts and mobile layout using the host's bundled Playwright and Edge. Its runtime path is specific to this machine; screenshots are saved to `.checks/`. It targets localhost:5173 by default; optional `CELS_TEST_URL` selects another local test server. Those checks use a separate browser context and do not change the user's progress.
