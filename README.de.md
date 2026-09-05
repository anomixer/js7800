**English** | [繁體中文](README.zh-TW.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | **Deutsch** | [Español](README.es.md) | [Français](README.fr.md) | [Italiano](README.it.md) | [Português](README.pt.md) | [Русский](README.ru.md)

[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
[![Actions Status](https://github.com/raz0red/js7800/workflows/Build/badge.svg)](https://github.com/raz0red/js7800/actions)

# JS7800

Ported by raz0red

JS7800 ist eine erweiterte JavaScript-Portierung des ProSystem Atari 7800 Emulators, der ursprünglich von Greg Stanton entwickelt wurde.

https://raz0red.github.io/js7800/

Um korrekt und reibungslos zu funktionieren (ohne Verzögerungen usw.), benötigt JS7800 eine aktualisierte Version eines modernen Browsers (Chrome, Firefox, Safari) auf einem leistungsfähig konfigurierten System.

[![JS7800](https://github.com/raz0red/js7800/raw/master/screenshots/screenshot.png)](https://raz0red.github.io/js7800/)

## Fork-Informationen

Dies ist eine Fork des ursprünglichen [raz0red/js7800](https://github.com/raz0red/js7800) Repositorys mit Modifikationen zur Unterstützung mehrerer Sprachen und Verbesserung der lokalen Entwicklungserfahrung.

**Hinweis:** Dieser Fork konzentriert sich auf Internationalisierungserweiterungen und behält gleichzeitig die gleiche hervorragende Spielerfahrung wie das Original bei. Die Kernemulation und Spielkompatibilität bleiben unverändert.

**Jetzt spielen**:
- **Cloudflare Pages**: https://js7800.pages.dev
- **GitHub Pages Mirror**: https://anomixer.github.io/js7800/

### Modifikationen

*   **Mehrsprachige Unterstützung**: Die Benutzeroberfläche unterstützt jetzt Englisch, Traditionelles Chinesisch (繁體中文), Vereinfachtes Chinesisch (简体中文), Japanisch (日本語), Koreanisch (한국어), Deutsch, Spanisch (Español), Französisch (Français), Italienisch (Italiano), Portugiesisch (Português) und Russisch (Русский).
*   **Automatische Spracherkennung**: Beim ersten Laden versucht die Anwendung, die bevorzugte Sprache des Browsers zu erkennen. Die Sprache kann auch manuell im Einstellungsmenü geändert werden.
*   **Globale Bestenliste mit Mehrsprachigkeit**: Die globale Bestenlistenseite unterstützt dieselben elf Sprachen und synchronisiert sich automatisch mit den Spracheinstellungen des Hauptemulators.
*   **Globale Highscores standardmäßig**: Die standardmäßige Highscore-Speicherung wurde auf "Global (weltweite Bestenliste)" eingestellt, um eine nahtlose Synchronisation mit dem ursprünglichen Bestenlistensystem über Cloudflare Workers Proxy zu ermöglichen.
*   **Übersetzte Dokumentation**: README und interne Hilfedateien wurden übersetzt.
*   **Globale Bestenlistensynchronisation**: Cloudflare Workers Integration implementiert, um globale Highscore-Synchronisation für Fork-Bereitstellungen zu ermöglichen.

### Lokale Ausführung

1.  **Abhängigkeiten installieren:**
    ```sh
    npm install
    ```

2.  **Website erstellen:**
    ```sh
    set NODE_OPTIONS=--openssl-legacy-provider
    npm run build
    ```

3.  **Dateien bereitstellen:**
    Navigieren Sie zum Projektstammverzeichnis und stellen Sie das `site/deploy` Verzeichnis bereit. Sie können `npx` oder den integrierten Python-Webserver verwenden.

    *   **Verwendung von Node.js:**
        ```sh
        npx http-server site/deploy -p 8081
        ```

    *   **Verwendung von Python 3:**
        ```sh
        python -m http.server 8081 --directory site/deploy
        ```

    Öffnen Sie dann Ihren Browser zu `http://localhost:8081`.

## Funktionen

* Globale Highscore-Verfolgung (für HSC-kompatible Spiele)
* Anpassbare Tastaturzuordnungen
* Gamepad-Kompatibilität (mit Dual-Analog-Unterstützung für Robotron-ähnliche Spiele)
* Vollbildunterstützung
* Mehrere Seitenverhältnisse
* Fähigkeit, Videofilter zu aktivieren/deaktivieren
* Drag-and-Drop-Unterstützung für lokale Dateien und Remote-Dateilinks
* Cartridge-Listenunterstützung (siehe [JS7800 Wiki](https://github.com/raz0red/js7800/wiki/Cartridge%20Lists))
* Lightgun-Unterstützung (über Maus)
* Erweiterungsmodul (XM) Unterstützung
* Erweiterte Bank-Switching und Cartridge-Erkennung

## Dokumentation

JS7800 enthält integrierte Dokumentation über die Schaltfläche "Hilfe/Informationen" in der Befehlsleiste direkt unter dem Emulator-Bildschirm.

Für Informationen zum ["Cartridge-Listen"](https://github.com/raz0red/js7800/wiki/Cartridge%20Lists) Format, [Anfrageparametern](https://github.com/raz0red/js7800/wiki/Request%20Parameters) und mehr, beachten Sie das [JS7800 Wiki](https://github.com/raz0red/js7800/wiki).

## Änderungsprotokoll (Change Log)

### 08/28/26 (0.1.0 - Fork-Version)
    - Mehrsprachige Unterstützung (11 Sprachen: Deutsch, Englisch, Traditionelles Chinesisch,
      Vereinfachtes Chinesisch, Japanisch, Koreanisch, Spanisch, Französisch, Italienisch,
      Portugiesisch, Russisch)
    - Globale Bestenliste Echtzeit-Synchronisation mit Master-SRAM-Schutz
    - Duale Bereitstellung auf Cloudflare Pages und GitHub Pages Mirror
    - Zweistufige SRAM-Schreibunterstützung für Retro-HighScore-Cartridge-Hardwarekompatibilität
    - 8-fache parallele Synchronisation und Smart Diff Zero-Bill-Cache-Optimierung
    - Ereignisgesteuerte Synchronisation: Sofortiges Upstream-Schreiben (0s) und automatisierter Cloud-Mirror-Sync (~18s)

### 01/25/24 (0.0.9)
    - Souper-Unterstützung
    - Activision OM ROM-Layout-Unterstützung
    - Pole Position II Streckenauswahl-Korrektur (von RevEng @ AtariAge)
    - Tower Toppler und Jinks Composite-Glättung (von RevEng @ AtariAge)
    - Farbpaletten aktualisiert (beigesteuert von Trebor @ AtariAge)
    - Popeye aktualisiert (JS7800 Demo 2.41) (beigesteuert von darryl1970 @ AtariAge)

### 08/16/23 (0.0.8)
    - TIA-Fidelitätsproblem behoben (beigesteuert von RevEng @ AtariAge)

### 08/13/23 (0.0.7)
    - Pokey-Neuschreibung (beigesteuert von RevEng @ AtariAge)
    - RIOT-Interrupt-Spiegelkorrektur (beigesteuert von RevEng @ AtariAge)
    - Drelbs Homebrew hinzugefügt
    - Neueste Version von Arkanoid Homebrew hinzugefügt (funktioniert jetzt dank RIOT-Fix)
    - Mehrere Pokey-basierte Demos hinzugefügt

### 08/10/23 (0.0.6)
    - Farbpaletten aktualisiert (beigesteuert von Trebor @ AtariAge)
    - Standard-Lautstärkepegel für YM-2151 angepasst
    - Cartridge-Header-Korrektur für Fernsehtyp

### 07/30/23 (0.0.5)
    - Banksets-Unterstützung
    - Maria Hintergrundfarbkorrektur (Keystone Koppers)
    - Cartridge-Header-Korrekturen (behebt mehrere ROMs, die spezielle Versionen erforderten)
    - Verbesserte Zyklusgenauigkeit (behebt mehrere Spielfehler)
    - YM-2151 Homebrew-Auto-Erkennung
    - Pokey-Filter-Unterstützung (beigesteuert von RevEng @ AtariAge)
    - Unterstützung für 7800 Diagnose-Cartridge
    - Spielstand-Speicherunterstützung (nur über webЯcade zugänglich)
    - Zur Standard-Spielliste hinzugefügt: IE78 (Demo), Bad Apple (Demo), Bankset Tests,
      Baby Pac-Man, 7800 Test, Keystone Koppers (Demo), Galaxian, PentaGo!
    - Mehrere Spiele auf die neuesten Versionen aktualisiert
    - Highscore-Unterstützung hinzugefügt für: 1942, Galaxian, Keystone Koppers, PentaGo!

### 01/05/21 (0.0.4)
    - Globale Highscore-Unterstützung für "Popeye" hinzugefügt
    - Globale Highscore-Unterstützung für die neueste Version von "Pac-Man Collection!" hinzugefügt
    - Auf neueste Versionen von "Dragon's Cache", "Dragon's Descent", "Popeye",
      "Spire of the Ancients", "E.X.O" und "Knight Guy: Castle Days" aktualisiert

### 09/03/20 (0.0.3)
    - Unterstützung für undokumentierte ASR- und ANC-Opcodes hinzugefügt
    - Globale Highscore-Unterstützung für "Pac-Man XM" hinzugefügt
    - "Popeye 7800: Mini-game" und "Knight Guy: Castle Days" zur Entwicklungsliste hinzugefügt
    - Auf neueste Versionen von "Dragon's Cache", "Dragon's Descent", "GoSub" und
      "Spire of the Ancients" aktualisiert

### 06/18/20 (0.0.2)
    - XM-Implementierung aktualisiert
    - Erste Unterstützung für den Yamaha (YM2151) Soundchip
    - Möglichkeit zur Deaktivierung der vertikalen Synchronisation
    - Yamaha-Musikdemos zu Zanac und Side-Crawler's Dance hinzugefügt
    - Nicht vom globalen Server unterstützte Highscores werden standardmäßig lokal gespeichert

### 05/26/20 (0.0.1)
    - Farbpalettenauswahl ("Cool", "Warm", "Hot") in "Dark" und "Light" Variationen
    - "Vollbild"-Skalierungsoption (Integer vs. Fill)
    - "Globale Bestenliste"-Seite

### 05/16/20 (0.0.0)
    - Erstveröffentlichung
