**English** | [繁體中文](README.zh-TW.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Français](README.fr.md) | **Italiano** | [Português](README.pt.md) | [Русский](README.ru.md)

[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
[![Actions Status](https://github.com/raz0red/js7800/workflows/Build/badge.svg)](https://github.com/raz0red/js7800/actions)

# JS7800

Portato da raz0red

JS7800 è una porta JavaScript migliorata dell'emulatore ProSystem Atari 7800 che è stato sviluppato originariamente da Greg Stanton.

https://raz0red.github.io/js7800/

Per funzionare correttamente e senza intoppi (senza ritardi, ecc.), JS7800 richiede una versione aggiornata di un browser moderno (Chrome, Firefox, Safari) su un sistema correttamente configurato.

[![JS7800](https://github.com/raz0red/js7800/raw/master/screenshots/screenshot.png)](https://raz0red.github.io/js7800/)

## Informazioni sul Fork

Questo è un fork del repository originale [raz0red/js7800](https://github.com/raz0red/js7800) con modifiche per supportare più lingue e migliorare l'esperienza di sviluppo locale.

**Nota:** Questo fork si concentra sui miglioramenti dell'internazionalizzazione mantenendo la stessa eccellente esperienza di gioco dell'originale. L'emulazione di base e la compatibilità dei giochi rimangono invariate.

**Gioca ora**:
- **Cloudflare Pages**: https://js7800.pages.dev
- **GitHub Pages Mirror**: https://anomixer.github.io/js7800/

### Modifiche

*   **Supporto Multilingua**: L'interfaccia utente ora supporta Inglese, Cinese Tradizionale (繁體中文), Cinese Semplificato (简体中文), Giapponese (日本語), Coreano (한국어), Tedesco (Deutsch), Spagnolo (Español), Francese (Français), Italiano, Portoghese (Português) e Russo (Русский).
*   **Rilevamento Automatico della Lingua**: Al primo caricamento, l'applicazione tenterà di corrispondere alla lingua preferita del browser. La lingua può anche essere cambiata manualmente nel menu Impostazioni.
*   **Supporto Multilingua della Classifica Globale**: La pagina della Classifica Globale supporta anche le stesse undici lingue e si sincronizza automaticamente con le impostazioni di lingua dell'emulatore principale.
*   **Punteggi Alti Globali per Default**: L'archiviazione dei punteggi alti per default è stata configurata come "Globale (classifica mondiale)" per permettere una sincronizzazione senza interruzioni con il sistema di classifica originale tramite proxy Cloudflare Workers.
*   **Documentazione Tradotta**: I file README e di aiuto interno sono stati tradotti.
*   **Sincronizzazione della Classifica Globale**: Integrazione Cloudflare Workers implementata per abilitare la sincronizzazione dei punteggi alti globali nelle distribuzioni forkate.

### Come Eseguire Localmente

1.  **Installare le Dipendenze:**
    ```sh
    npm install
    ```

2.  **Costruire il Sito:**
    ```sh
    set NODE_OPTIONS=--openssl-legacy-provider
    npm run build
    ```

3.  **Servire i File:**
    Navigare alla radice del progetto e servire la directory `site/deploy`. È possibile utilizzare `npx` o il server web integrato di Python.

    *   **Utilizzando Node.js:**
        ```sh
        npx http-server site/deploy -p 8081
        ```

    *   **Utilizzando Python 3:**
        ```sh
        python -m http.server 8081 --directory site/deploy
        ```

    Quindi, aprire il browser su `http://localhost:8081`.

## Caratteristiche

* Tracciamento globale dei punteggi alti (per giochi compatibili con HSC)
* Mappature tastiera personalizzabili
* Compatibilità gamepad (con supporto dual analogico per giochi stile Robotron)
* Supporto schermo intero
* Rapporti d'aspetto multipli
* Capacità di attivare/disattivare i filtri video
* Supporto trascina e rilascia per file locali e link di file remoti
* Supporto liste cartucce (vedere [JS7800 Wiki](https://github.com/raz0red/js7800/wiki/Cartridge%20Lists))
* Supporto pistola luce (tramite mouse)
* Supporto Modulo di Espansione (XM)
* Bank switching migliorato e rilevamento cartucce

## Documentazione

JS7800 include documentazione integrata tramite il pulsante "Aiuto/Informazioni" situato nella barra comandi direttamente sotto lo schermo dell'emulatore.

Per informazioni sul formato delle ["liste cartucce"](https://github.com/raz0red/js7800/wiki/Cartridge%20Lists), i [parametri richiesta](https://github.com/raz0red/js7800/wiki/Request%20Parameters) e altro, consultare il [JS7800 Wiki](https://github.com/raz0red/js7800/wiki).

## Registro delle Modifiche (Change Log)

### 08/28/26 (0.1.0 - Versione Fork)
    - Supporto multilingua (11 lingue: Italiano, Inglese, Cinese Tradizionale, Cinese Semplificato,
      Giapponese, Coreano, Tedesco, Spagnolo, Francese, Portoghese, Russo)
    - Sincronizzazione in tempo reale della Classifica Globale con protezione Master SRAM
    - Doppio deployment su Cloudflare Pages e mirror GitHub Pages
    - Supporto scrittura SRAM a due fasi per compatibilità hardware HighScore Cartridge
    - Sincronizzazione parallela veloce (concorrenza 8x) e ottimizzazione cache Smart Diff gratuita
    - Sincronizzazione guidata da eventi: scrittura a monte istantanea (0s) e mirror cloud automatizzato (~18s)

### 01/25/24 (0.0.9)
    - Supporto Souper
    - Supporto layout Activision OM ROM
    - Correzione selezione traccia Pole Position II (di RevEng @ AtariAge)
    - Smoothing composito per Tower Toppler e Jinks (di RevEng @ AtariAge)
    - Palette aggiornate (contribuito da Trebor @ AtariAge)
    - Popeye aggiornato (JS7800 Demo 2.41) (contribuito da darryl1970 @ AtariAge)

### 08/16/23 (0.0.8)
    - Risolto problema di fedeltà TIA (contribuito da RevEng @ AtariAge)

### 08/13/23 (0.0.7)
    - Riscrittura Pokey (contribuito da RevEng @ AtariAge)
    - Correzione mirror interrupt RIOT (contribuito da RevEng @ AtariAge)
    - Aggiunto homebrew Drelbs
    - Aggiunta ultima versione di Arkanoid homebrew (ora funzionante grazie al fix RIOT)
    - Aggiunte diverse demo basate su Pokey

### 08/10/23 (0.0.6)
    - Palette aggiornate (contribuito da Trebor @ AtariAge)
    - Regolazione volume predefinito YM-2151
    - Correzione intestazione cartuccia per tipo di televisione

### 07/30/23 (0.0.5)
    - Supporto Banksets
    - Correzione colore di sfondo Maria (Keystone Koppers)
    - Correzione intestazioni cartucce (risolve diverse ROM che richiedevano versioni speciali)
    - Precisione dei cicli migliorata (risolve vari bug)
    - Rilevamento automatico homebrew YM-2151
    - Supporto filtri Pokey (contribuito da RevEng @ AtariAge)
    - Supporto per cartuccia diagnostica 7800
    - Supporto salvataggio stato (accessibile solo via webЯcade)
    - Aggiunti alla lista giochi predefinita: IE78 (Demo), Bad Apple (Demo), Bankset Tests,
      Baby Pac-Man, 7800 Test, Keystone Koppers (Demo), Galaxian, PentaGo!
    - Diversi giochi aggiornati alle ultime versioni
    - Aggiunto supporto punteggi più alti per: 1942, Galaxian, Keystone Koppers, PentaGo!

### 01/05/21 (0.0.4)
    - Aggiunto supporto punteggi globali per "Popeye"
    - Aggiunto supporto punteggi globali per l'ultima versione di "Pac-Man Collection!"
    - Aggiornato alle ultime versioni di "Dragon's Cache", "Dragon's Descent", "Popeye",
      "Spire of the Ancients", "E.X.O" e "Knight Guy: Castle Days"

### 09/03/20 (0.0.3)
    - Supporto per opcode ASR e ANC non documentati
    - Supporto punteggi globali per l'ultima versione di "Pac-Man XM"
    - "Popeye 7800: Mini-game" e "Knight Guy: Castle Days" aggiunti alla lista di sviluppo
    - Aggiornato alle ultime versioni di "Dragon's Cache", "Dragon's Descent", "GoSub" e
      "Spire of the Ancients"

### 06/18/20 (0.0.2)
    - Implementazione XM aggiornata
    - Supporto iniziale per il chip audio Yamaha (YM2151)
    - Possibilità di disabilitare la sincronizzazione verticale
    - Demo musicali Yamaha Zanac e Side-Crawler's Dance aggiunte
    - I punteggi non supportati dal server globale vengono salvati localmente

### 05/26/20 (0.0.1)
    - Selezione palette colori ("Cool", "Warm" e "Hot") in variazioni "Dark" e "Light"
    - Opzione ridimensionamento "Schermo Intero" (Intero vs Riempi)
    - Pagina "Classifica Globale"

### 05/16/20 (0.0.0)
    - Rilascio iniziale
