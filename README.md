**English** | [繁體中文](README.zh-TW.md) | [简体中文](README.zh-CN.md)

[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
[![Actions Status](https://github.com/raz0red/js7800/workflows/Build/badge.svg)](https://github.com/raz0red/js7800/actions)

# JS7800

Ported by raz0red

JS7800 is an enhanced JavaScript port of the ProSystem Atari 7800 emulator that was originally developed by Greg Stanton.

https://raz0red.github.io/js7800/

In order to operate correctly and smoothly (no lags, etc.), JS7800 requires an updated version of a modern browser (Chrome, Firefox, Safari) on a capably configured system.

[![JS7800](https://github.com/raz0red/js7800/raw/master/screenshots/screenshot.png)](https://raz0red.github.io/js7800/)

## Fork Information

This is a fork of the original [raz0red/js7800](https://github.com/raz0red/js7800) repository with modifications to support multiple languages and improve the local development experience.

### Modifications

*   **Multi-language Support**: The UI now supports English, Traditional Chinese (繁體中文), and Simplified Chinese (简体中文).
*   **Automatic Language Detection**: On first load, the application will attempt to match the browser's preferred language. The language can also be changed manually in the Settings menu.
*   **Default to Local High Scores**: The default high score storage has been changed to "Local" to prevent network errors, as the global leaderboard is inaccessible.
*   **Translated Documentation**: The README and internal help files have been translated.

### How to Run Locally

1.  **Install Dependencies:**
    ```sh
    npm install
    ```

2.  **Build the Site:**
    ```sh
    npm run buildSite
    ```

3.  **Serve the Files:**
    Navigate to the project root and serve the `site/deploy` directory. You can use `npx` or Python's built-in web server.

    *   **Using Node.js:**
        ```sh
        npx http-server site/deploy -p 8081
        ```

    *   **Using Python 3:**
        ```sh
        python -m http.server 8081 --directory site/deploy
        ```
    
    Then, open your browser to `http://localhost:8081`.

### Limitations

*   **Global Leaderboard Status**: The original global leaderboard service, which fetches high score data from https://twitchasylum.com/x, is protected by a CORS policy that only allows requests from the official `raz0red.github.io` domain. We are currently working on re-enabling this feature for forked deployments by integrating a custom Cloudflare Worker backend. While the backend is functional, the frontend display of the leaderboard page is still under development. Please ensure the "High Score" save location is set to "Local" in the settings to avoid errors.

## Features

* Global high score tracking (for HSC compatible games)
* Customizable keyboard mappings
* Gamepad compatibility (with dual-analog support for Robotron-style games)
* Full screen support
* Multiple aspect ratios
* Ability to enable/disable video filters
* Drag and drop support for local files and remote file links
* Cartridge list support (see [JS7800 Wiki](https://github.com/raz0red/js7800/wiki/Cartridge%20Lists))
* Light gun support (via mouse)
* Expansion Module (XM) support
* Enhanced bank switching and cartridge detection

## Future consideration

* Mobile support (virtual buttons, proper screen sizing, etc.)
  * (partially available in [webЯcade](https://www.webrcade.com))
* Paddle controller support (via mouse)
* Updating the emulation core to integrate accuracy and compatibility improvements that are part of the incredible [A7800 emulator](http://7800.8bitdev.org/index.php/A7800_Emulator)
* Save/load state support (available in [webЯcade](https://www.webrcade.com))
* Network-based multiplayer support
* Improved cartridge browser with detailed descriptions and screenshots (available in [webЯcade](https://www.webrcade.com))

## Documentation

JS7800 includes integrated documentation via the "Help/Information" button located in the commands bar directly below the emulator screen.

For information on the ["cartridge list"](https://github.com/raz0red/js7800/wiki/Cartridge%20Lists) format,  [request parameters](https://github.com/raz0red/js7800/wiki/Request%20Parameters), and more, refer to the [JS7800 Wiki](https://github.com/raz0red/js7800/wiki).

## Change log

### 01/25/24 (0.0.9)
    - Souper support
    - Activision OM ROM layout support
    - Pole Position II track selection fix (by RevEng @ AtariAge)
    - Tower Toppler and Jinks composite smoothing (by RevEng @ AtariAge)
    - Updated palettes (contributed by Trebor @ AtariAge)
    - Updated Popeye (JS7800 Demo 2.41) (contributed by darryl1970 @ AtariAge)

### 08/16/23 (0.0.8)
    - TIA fidelity issue fix (contributed by RevEng @ AtariAge)

### 08/13/23 (0.0.7)
    - Pokey rewrite (contributed by RevEng @ AtariAge)
    - RIOT interrupt mirror fix (contributed by RevEng @ AtariAge)
    - Added Drelbs homebrew
    - Added latest version of Arkanoid homebrew (now works due to RIOT fix)
    - Added several Pokey-based demos

### 08/10/23 (0.0.6)
    - Updated palettes (contributed by Trebor @ AtariAge)
    - YM-2151 default volume level adjustment
    - Cartridge header fix for television type

### 07/30/23 (0.0.5)
    - Banksets support
    - Maria background color fix (Keystone Koppers)
    - Cartridge headers fix (Fixes several ROMs that required special versions)
    - Improved cycle accuracy (resolves several game glitches)
    - YM-2151 homebrew auto-detect support
    - Pokey filter support (contributed by RevEng @ AtariAge)
    - Support for 7800 Diagnostic cartridge
    - Save state support (only accessible via webЯcade)
    - Added to default game list: IE78 (Demo), Bad Apple (Demo), Bankset Tests,
      Baby Pac-Man, 7800 Test, Keystone Koppers (Demo), Galaxian, PentaGo!
    - Updated several games to latest versions
    - Added high score support for: 1942, Galaxian, Keystone Koppers, PentaGo!,
      latest versions of games that were already supported.

### 01/05/21 (0.0.4)
    - Added global high score support for "Popeye"
    - Added global high score support for the latest version of "Pac-Man Collection!"
    - Updated to the latest versions of "Dragon's Cache", "Dragon's Descent", "Popeye",
      "Spire of the Ancients", "E.X.O", and "Knight Guy: Castle Days"

### 09/03/20 (0.0.3)
    - Added support for undocumented ASR and ANC opcodes (fixes graphical glitches with
      "Popeye 7800: Mini-game")
    - Added global high score support for the latest version of "Pac-Man XM"
    - Added "Popeye 7800: Mini-game" and "Knight Guy: Castle Days" to the default list of
      in-development games
    - Updated to the latest versions of "Dragon's Cache", "Dragon's Descent", "GoSub", and
      "Spire of the Ancients"
    - Updating to the latest version of "Dragon's Descent" required the global high scores for
      this game to be reset (the latest version modified the way high scores were stored)

### 06/18/20 (0.0.2)
    - XM implementation has been updated to be consistent with the released hardware
    - Initial support for the Yamaha (YM2151) sound chip
    - Ability to disable vertical sync ("Advanced" tab of settings dialog)
    - Zanac and Side-Crawler's Dance Yamaha music demos added to default cartridge list
    - XM memory test added to default cartridge list
    - By default, high scores for games that are not supported by the Global High Score server
      will be stored locally
    - Resolved defect where Global High Scores were not supported when local storage was disabled

### 05/26/20 (0.0.1)
    - Ability to select a color palette ("Cool", "Warm", and "Hot") in "Dark" and "Light" variations
    - "Fullscreen" scaling option (Integer vs. Fill)
    - "Global Leaderboard" page
    - Contextual launch of "Global Leaderboard" via controls bar

### 05/16/20 (0.0.0)
    - Initial release

