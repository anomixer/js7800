# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

- Install dependencies
  ```sh path=null start=null
  npm install
  ```
- Full build (library + site + leaderboard + generate ProSystem DB)
  ```sh path=null start=null
  npm run build
  ```
- Build individual bundles
  ```sh path=null start=null
  npm run buildModule         # dist/js7800.min.js (UMD library)
  npm run buildSite           # site/dist/site.min.js -> copies to site/deploy/js/
  npm run buildLeaderboard    # site/leaderboard/dist/leaderboard.min.js -> copies to site/deploy/leaderboard/js/
  ```
- Generate ProSystem database module (from db/ProSystem.dat)
  ```sh path=null start=null
  npm run dbConvert
  # writes src/js/prosystem/ProSystemDat.js
  ```
- Development servers (webpack-dev-server on port 8000)
  ```sh path=null start=null
  npm run devServer           # serves site/deploy with /js/js7800.min.js from dist
  npm run devServerSite       # serves the demo site (site/webpack.config.js)
  npm run devServerDebug      # debug variant
  npm run devServerDebugSite  # debug variant for site
  ```
- Watch builds
  ```sh path=null start=null
  npm run webpackWatch                # library
  npm run webpackWatchLeaderboard     # leaderboard bundle
  ```
- Linting / tests
  ```text path=null start=null
  No linter or test suite is configured in package.json.
  ```
- Optional: rebuild bupboop (Souper/BupChip WASM/JS) after C changes
  ```sh path=null start=null
  # Requires Emscripten (emcc) in PATH
  cd bupboop
  make
  # produces bupboop.js (site/deploy references js/bupboop.js)
  ```

## Architecture overview

- Public entrypoint and UMD library
  - `src/js/index.js` is the UMD entry that re-exports the main runtime (`js7800.js`) and key subsystems under the `js7800` global for browser usage. Webpack outputs `dist/js7800.min.js` and a post-build step copies it into `site/deploy/js/` for the demo site.

- Runtime and orchestration
  - `src/js/js7800.js` initializes DOM elements, wires inputs, starts/stops emulation, and drives the frame loop. It coordinates timing (requestAnimationFrame vs. setTimeout), frame skipping, save/load state, VSYNC, and pause/resume when page visibility changes.

- Event bus
  - `src/js/common/events-common.js` implements a lightweight pub/sub used across layers. Key topics used by the runtime and subsystems include:
    - `init` (emulator UI scaffolding and contexts),
    - `onCartridgeLoaded`,
    - `onEmulationStarted`,
    - `restart`,
    - `fullscreen`,
    - `highScoreCallbackChanged`.

- Core emulator (ProSystem)
  - `src/js/prosystem/*` contains modules translated from the ProSystem emulator:
    - CPU/SoC and chips: `Sally` (6502), `Tia` (video/IO), `Maria` (7800 graphics), `Pokey` (audio), `Riot` (I/O/timers), `Bios`.
    - Expansion: `Xm` (Expansion Module, incl. optional Pokey/YM2151), `../3rdparty/ym2151.js`.
    - Cartridge handling: `Cartridge.js` for header parsing, bank switching (Normal, Supercart, Absolute, Activision, Souper), region, controllers, flags, and high-score cart integration. Souper/BupChip audio is bridged via Emscripten `window.Module.*` calls.
    - System driver: `ProSystem.js` orchestrates per-scanline execution, DMA, NMI/WSYNC handling, timing, and exposes save/load state. It reacts to cartridge properties and expansion features.
    - Database overrides: `Database.js` loads metadata from `ProSystemDat.js` (generated from `db/ProSystem.dat`) to tweak per-ROM behavior (type, region, controllers, XM, etc.).

- Web integration layer
  - `src/js/web/*` bridges the emulator to the browser: input (`kb.js`, `pad.js`, `mouse.js`, `input.js`), audio output (`audio.js`), rendering and display management (`video.js`, including canvas blitting, palette selection, scaling/aspect, fullscreen), and UI controls (`cbar.js`).

- Demo site and leaderboard
  - `site/src/js/site.js` is the demo UI: ROM loading (including zip), drag/drop, settings, dialogs, storage, and high score client. Webpack outputs `site/dist/site.min.js` and copies to `site/deploy/js/` consumed by `site/deploy/index.html`.
  - `site/leaderboard/src/js/leaderboard.js` builds the separate leaderboard bundle consumed under `site/deploy/leaderboard`.

- Native/compiled component (Souper/BupChip)
  - `bupboop/` contains C sources and a `Makefile` to build `bupboop.js` with Emscripten. The emulator calls into this module for Souper cartridges. Only needed if you modify the C code; otherwise the prebuilt script is used by the site.

- Build and CI
  - Webpack v4 configs: root library (`webpack.config.js`), site (`site/webpack.config.js`), leaderboard (`site/leaderboard/webpack.config.js`). Each copies its minified artifact to the corresponding `site/deploy` path after emit.
  - GitHub Actions (`.github/workflows/main.yml`) installs Node 12, runs `npm run build`, uploads artifacts, and deploys `site/deploy` to GitHub Pages for various branches.

## Notes from README

- Project homepage and live demo: https://raz0red.github.io/js7800/
- Requires a modern browser for smooth emulation; integrated documentation is accessible via the site’s Help/Information UI.

## Project Analysis & Modifications (as of 2025-10-19)

This section documents analysis and changes performed by a Gemini-based AI assistant.

### Internationalization (i18n)

- **Core Logic**: i18n is handled by `src/js/common/i18n.js`. It uses a `locales` object to store strings for different languages (`en`, `zh-TW`, `zh-CN`).
- **Usage**: UI strings are translated using the `I18n.t('key.name')` function.
- **Static Content**: The Help dialog (`site/src/js/help-dialog.js`) loads its content from static HTML files located in `site/deploy/help/`. To support multiple languages, corresponding translated HTML files must be created (e.g., `page-name.html` requires a `page-name-zh-TW.html` for Traditional Chinese).
- **Language Detection**: The `init()` function in `i18n.js` was modified to automatically detect the browser's language (`navigator.language`) if no language preference is found in `localStorage`. It will attempt to set the language to `zh-TW`, `zh-CN`, or default to `en`.

### Global Leaderboard

- **CORS Issue**: The official global leaderboard service is hosted at `https://twitchasylum.com/x/`. The server is configured with a strict CORS policy (`Access-Control-Allow-Origin: https://raz0red.github.io`) that only accepts requests from the official `raz0red.github.io` domain.
- **Conclusion**: This security policy makes it **impossible** for forked versions of this project (running on `localhost` or other domains like a different GitHub Pages site) to use the official global leaderboard. Any direct client-side requests will be blocked by the browser.
- **Default Setting Change**: To prevent errors in local development and forked deployments, the default high score setting was changed from "Global" to "Local". This was done by modifying the `GLOBAL_DEFAULT` variable in `site/src/js/highscore.js` to `false`.