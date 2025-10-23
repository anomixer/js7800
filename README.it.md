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

**Gioca ora**: https://js7800.pages.dev

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