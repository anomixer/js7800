**English** | [繁體中文](README.zh-TW.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Français](README.fr.md) | [Italiano](README.it.md) | [Português](README.pt.md) | [Русский](README.ru.md)

[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
[![Actions Status](https://github.com/raz0red/js7800/workflows/Build/badge.svg)](https://github.com/raz0red/js7800/actions)

# JS7800

Ported by raz0red

JS7800는 Greg Stanton가 개발한 ProSystem Atari 7800 에뮬레이터를 JavaScript로 강화 이식한 프로젝트입니다.

https://raz0red.github.io/js7800/

올바르고 원활하게 작동하려면(지연 등이 없도록)，최신 버전의 최신 브라우저(Chrome/Firefox/Safari)와 적절히 구성된 시스템이 필요합니다.

[![JS7800](https://github.com/raz0red/js7800/raw/master/screenshots/screenshot.png)](https://raz0red.github.io/js7800/)

## Fork Information

이것은 원본 [raz0red/js7800](https://github.com/raz0red/js7800) 리포지토리의 포크로，다국어 지원과 로컬 개발 환경 개선을 위한 수정 사항이 포함되어 있습니다.

**Note:** 이 포크는 국제화 개선에 중점을 두고 있으며，원본의 우수한 게임 플레이 경험을 유지합니다. 코어 에뮬레이션과 게임 호환성은 변경되지 않습니다.

**지금 플레이**: https://js7800.pages.dev

### 수정 사항

*   **다국어 지원**: UI가 영어，번체 중국어(繁體中文)，간체 중국어(简体中文)，일본어，한국어，독일어(Deutsch)，스페인어(Español)，프랑스어(Français)，이탈리아어(Italiano)，포르투갈어(Português)，러시아어(Русский)를 지원하도록 되었습니다.
*   **자동 언어 감지**: 첫 로드 시 브라우저의 기본 언어와 자동으로 일치하려고 시도합니다. 언어는 설정 메뉴에서 수동으로 변경할 수도 있습니다.
*   **글로벌 리더보드 다국어 지원**: 글로벌 리더보드 페이지도 동일한 언어를 지원하며 메인 에뮬레이터의 언어 설정과 자동으로 동기화됩니다.
*   **기본적으로 글로벌 하이스코어**: 기본 하이스코어 저장소가 "글로벌 (전 세계 리더보드)"로 설정되어 Cloudflare Workers 프록시를 통해 원본 리더보드 시스템과 원활하게 동기화됩니다.
*   **번역된 문서**: README 및 내부 도움말 파일이 번역되었습니다.
*   **글로벌 리더보드 동기화**: Cloudflare Workers 통합을 구현하여 포크된 배포에서 글로벌 하이스코어 동기화를 활성화했습니다.

### 로컬에서 실행하는 방법

1.  **종속성 설치:**
    ```sh
    npm install
    ```

2.  **사이트 빌드:**
    ```sh
    set NODE_OPTIONS=--openssl-legacy-provider
    npm run build
    ```

3.  **파일 제공:**
    프로젝트 루트로 이동하여 `site/deploy` 디렉토리를 제공합니다. `npx` 또는 Python의 내장 웹 서버를 사용할 수 있습니다.

    *   **Node.js를 사용하는 경우:**
        ```sh
        npx http-server site/deploy -p 8081
        ```

    *   **Python 3을 사용하는 경우:**
        ```sh
        python -m http.server 8081 --directory site/deploy
        ```

    그런 다음 브라우저에서 `http://localhost:8081`을 엽니다.

## 특징

* 글로벌 하이스코어 추적(HSC 호환 게임용)
* 사용자 정의 키보드 매핑
* 게임패드 호환성(Robotron 스타일 게임에서 듀얼 아날로그 지원)
* 전체화면 지원
* 다양한 화면 비율
* 비디오 필터 활성화/비활성화
* 로컬 파일 및 원격 파일 링크 드래그 앤 드롭 지원
* 카트리지 목록 지원([JS7800 Wiki](https://github.com/raz0red/js7800/wiki/Cartridge%20Lists) 참조)
* 라이트 건 지원(마우스를 통해)
* 확장 모듈(XM) 지원
* 강화된 뱅크 스위칭 및 카트리지 감지

## 문서

JS7800에는 에뮬레이터 화면 아래의 명령 모음에 있는 "도움말/정보" 버튼을 통해 통합 문서가 포함되어 있습니다.

["cartridge list"](https://github.com/raz0red/js7800/wiki/Cartridge%20Lists) 형식，[request parameters](https://github.com/raz0red/js7800/wiki/Request%20Parameters)，기타 자세한 내용은 [JS7800 Wiki](https://github.com/raz0red/js7800/wiki)를 참조하십시오.

## 변경 이력

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
