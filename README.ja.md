**English** | [繁體中文](README.zh-TW.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
[![Actions Status](https://github.com/raz0red/js7800/workflows/Build/badge.svg)](https://github.com/raz0red/js7800/actions)

# JS7800

Ported by raz0red

JS7800 は Greg Stanton が開発した ProSystem Atari 7800 エミュレーターを JavaScript で強化移植したプロジェクトです。

https://raz0red.github.io/js7800/

正しくスムーズに動作させるためには（ラグなどがないように）、最新バージョンのモダンブラウザ（Chrome/Firefox/Safari）と適切に構成されたシステムが必要です。

[![JS7800](https://github.com/raz0red/js7800/raw/master/screenshots/screenshot.png)](https://raz0red.github.io/js7800/)

## Fork Information

これはオリジナル [raz0red/js7800](https://github.com/raz0red/js7800) リポジトリのフォークで、多言語サポートとローカル開発環境の改善のための修正が含まれています。

**Note:** このフォークは国際化の強化に焦点を当てており、オリジナルの優れたゲームプレイ体験を維持しています。コアエミュレーションとゲーム互換性は変更されていません。

**今すぐプレイ**: https://js7800.pages.dev

### 修正内容

*   **多言語サポート**: UI が英語、繁体字中国語（繁體中文）、簡体字中国語（简体中文）、日本語、韓国語をサポートするようになりました。
*   **自動言語検出**: 初回ロード時にブラウザの優先言語に自動的に一致しようとします。言語は設定メニューで手動変更することもできます。
*   **グローバルリーダーボード多言語サポート**: グローバルリーダーボードページも同じ言語をサポートし、メインモジュレーターの言語設定と自動的に同期します。
*   **デフォルトでグローバルハイスコア**: デフォルトのハイスコアストレージが「グローバル（世界ランキング）」に設定され、Cloudflare Workers プロキシ経由で元のリーダーボードシステムとシームレスに同期されます。
*   **翻訳されたドキュメント**: README と内部ヘルプファイルが翻訳されました。
*   **グローバルリーダーボード同期**: Cloudflare Workers 統合を実装して、フォークされたデプロイメントでのグローバルハイスコア同期を有効にしました。

### ローカルでの実行方法

1.  **依存関係のインストール:**
    ```sh
    npm install
    ```

2.  **サイトのビルド:**
    ```sh
    set NODE_OPTIONS=--openssl-legacy-provider
    npm run build
    ```

3.  **ファイルの提供:**
    プロジェクトルートに移動し、`site/deploy` ディレクトリを提供します。`npx` または Python の組み込みウェブサーバーを使用できます。

    *   **Node.js を使用する場合:**
        ```sh
        npx http-server site/deploy -p 8081
        ```

    *   **Python 3 を使用する場合:**
        ```sh
        python -m http.server 8081 --directory site/deploy
        ```

    次に、ブラウザで `http://localhost:8081` を開きます。

## 特徴

* グローバルハイスコア追跡（HSC 対応ゲーム用）
* カスタマイズ可能なキーボードマッピング
* ゲームパッド互換性（Robotron スタイルゲームでデュアルアナログ対応）
* フルスクリーンサポート
* 複数のアスペクト比
* ビデオフィルターの有効/無効切り替え
* ローカルファイルとリモートファイルリンクのドラッグアンドドロップサポート
* カートリッジリストサポート（[JS7800 Wiki](https://github.com/raz0red/js7800/wiki/Cartridge%20Lists) を参照）
* ライトガンサポート（マウス経由）
* 拡張モジュール（XM）サポート
* 強化されたバンク切り替えとカートリッジ検出

## ドキュメント

JS7800 には、エミュレーター画面下のコマンドバーにある「ヘルプ/情報」ボタン経由で統合ドキュメントが含まれています。

["cartridge list"](https://github.com/raz0red/js7800/wiki/Cartridge%20Lists) 形式、[request parameters](https://github.com/raz0red/js7800/wiki/Request%20Parameters)、その他の詳細については、[JS7800 Wiki](https://github.com/raz0red/js7800/wiki) を参照してください。

## 変更履歴

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
