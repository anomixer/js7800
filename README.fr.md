**English** | [繁體中文](README.zh-TW.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Deutsch](README.de.md) | [Español](README.es.md) | **Français** | [Italiano](README.it.md) | [Português](README.pt.md) | [Русский](README.ru.md)

[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
[![Actions Status](https://github.com/raz0red/js7800/workflows/Build/badge.svg)](https://github.com/raz0red/js7800/actions)

# JS7800

Porté par raz0red

JS7800 est un port JavaScript amélioré de l'émulateur ProSystem Atari 7800 qui a été développé à l'origine par Greg Stanton.

https://raz0red.github.io/js7800/

Pour fonctionner correctement et sans à-coups (sans décalages, etc.), JS7800 nécessite une version mise à jour d'un navigateur moderne (Chrome, Firefox, Safari) sur un système correctement configuré.

[![JS7800](https://github.com/raz0red/js7800/raw/master/screenshots/screenshot.png)](https://raz0red.github.io/js7800/)

## Informations sur le Fork

Ceci est un fork du dépôt original [raz0red/js7800](https://github.com/raz0red/js7800) avec des modifications pour supporter plusieurs langues et améliorer l'expérience de développement local.

**Note :** Ce fork se concentre sur les améliorations d'internationalisation tout en maintenant la même excellente expérience de jeu que l'original. L'émulation de base et la compatibilité des jeux restent inchangées.

**Jouer maintenant** :
- **Cloudflare Pages** : https://js7800.pages.dev
- **Miroir GitHub Pages** : https://anomixer.github.io/js7800/

### Modifications

*   **Support Multilingue** : L'interface utilisateur supporte maintenant l'Anglais, le Chinois Traditionnel (繁體中文), le Chinois Simplifié (简体中文), le Japonais (日本語), le Coréen (한국어), l'Allemand (Deutsch), l'Espagnol (Español), le Français, l'Italien (Italiano), le Portugais (Português) et le Russe (Русский).
*   **Détection Automatique de Langue** : Au premier chargement, l'application tentera de correspondre à la langue préférée du navigateur. La langue peut aussi être changée manuellement dans le menu Paramètres.
*   **Support Multilingue du Classement Global** : La page du Classement Global supporte également les mêmes onze langues et se synchronise automatiquement avec les paramètres de langue de l'émulateur principal.
*   **Scores Élevés Globaux par Défaut** : Le stockage des scores élevés par défaut a été configuré comme "Global (classement mondial)" pour permettre une synchronisation transparente avec le système de classement original via le proxy Cloudflare Workers.
*   **Documentation Traduite** : Les fichiers README et d'aide interne ont été traduits.
*   **Synchronisation du Classement Global** : Intégration Cloudflare Workers implémentée pour permettre la synchronisation des scores élevés globaux dans les déploiements forkés.

### Comment Exécuter Localement

1.  **Installer les Dépendances :**
    ```sh
    npm install
    ```

2.  **Construire le Site :**
    ```sh
    set NODE_OPTIONS=--openssl-legacy-provider
    npm run build
    ```

3.  **Servir les Fichiers :**
    Naviguer vers la racine du projet et servir le répertoire `site/deploy`. Vous pouvez utiliser `npx` ou le serveur web intégré de Python.

    *   **Utilisation de Node.js :**
        ```sh
        npx http-server site/deploy -p 8081
        ```

    *   **Utilisation de Python 3 :**
        ```sh
        python -m http.server 8081 --directory site/deploy
        ```

    Ensuite, ouvrez votre navigateur sur `http://localhost:8081`.

## Fonctionnalités

* Suivi global des scores élevés (pour les jeux compatibles HSC)
* Mappages clavier personnalisables
* Compatibilité gamepad (avec support double analogique pour les jeux style Robotron)
* Support plein écran
* Multiples rapports d'aspect
* Capacité d'activer/désactiver les filtres vidéo
* Support de glisser-déposer pour les fichiers locaux et les liens de fichiers distants
* Support des listes de cartouches (voir [JS7800 Wiki](https://github.com/raz0red/js7800/wiki/Cartridge%20Lists))
* Support de la light gun (via souris)
* Support du Module d'Expansion (XM)
* Bank switching amélioré et détection de cartouches

## Documentation

JS7800 inclut de la documentation intégrée via le bouton "Aide/Informations" situé dans la barre de commandes directement sous l'écran de l'émulateur.

Pour des informations sur le format des ["listes de cartouches"](https://github.com/raz0red/js7800/wiki/Cartridge%20Lists), les [paramètres de requête](https://github.com/raz0red/js7800/wiki/Request%20Parameters) et plus, consultez le [JS7800 Wiki](https://github.com/raz0red/js7800/wiki).

## Journal des Modifications (Change Log)

### 08/28/26 (0.1.0 - Version Fork)
    - Support multilingue (11 langues : Français, Anglais, Chinois Traditionnel, Chinois Simplifié,
      Japonais, Coréen, Allemand, Espagnol, Italien, Portugais, Russe)
    - Synchronisation en temps réel du Classement Global avec protection Master SRAM
    - Déploiement double sur Cloudflare Pages et miroir GitHub Pages
    - Support d'écriture SRAM en deux étapes pour compatibilité matérielle HighScore Cartridge
    - Synchronisation parallèle rapide (concurrence 8x) et optimisation du cache Smart Diff gratuit
    - Synchronisation événementielle : écriture amont instantanée (0s) et miroir cloud automatisé (~18s)

### 01/25/24 (0.0.9)
    - Prise en charge de Souper
    - Prise en charge de la disposition Activision OM ROM
    - Correction de la sélection de piste de Pole Position II (par RevEng @ AtariAge)
    - Lissage composite de Tower Toppler et Jinks (par RevEng @ AtariAge)
    - Palettes mises à jour (contribué par Trebor @ AtariAge)
    - Popeye mis à jour (JS7800 Demo 2.41) (contribué par darryl1970 @ AtariAge)

### 08/16/23 (0.0.8)
    - Correction du problème de fidélité TIA (contribué par RevEng @ AtariAge)

### 08/13/23 (0.0.7)
    - Réécriture de Pokey (contribué par RevEng @ AtariAge)
    - Correction du miroir d'interruption RIOT (contribué par RevEng @ AtariAge)
    - Ajout du homebrew Drelbs
    - Ajout de la dernière version d'Arkanoid homebrew (fonctionne désormais grâce au correctif RIOT)
    - Ajout de plusieurs démos basées sur Pokey

### 08/10/23 (0.0.6)
    - Palettes mises à jour (contribué par Trebor @ AtariAge)
    - Ajustement du niveau de volume par défaut de l'YM-2151
    - Correction de l'en-tête de cartouche pour le type de télévision

### 07/30/23 (0.0.5)
    - Prise en charge des Banksets
    - Correction de la couleur d'arrière-plan Maria (Keystone Koppers)
    - Correction des en-têtes de cartouches (corrige plusieurs ROM nécessitant des versions spéciales)
    - Précision de cycle améliorée (résout plusieurs bugs de jeu)
    - Détection automatique des homebrews YM-2151
    - Prise en charge des filtres Pokey (contribué par RevEng @ AtariAge)
    - Prise en charge de la cartouche de diagnostic 7800
    - Prise en charge de l'état de sauvegarde (uniquement accessible via webЯcade)
    - Ajouté à la liste des jeux par défaut : IE78 (Démo), Bad Apple (Démo), Bankset Tests,
      Baby Pac-Man, 7800 Test, Keystone Koppers (Démo), Galaxian, PentaGo!
    - Plusieurs jeux mis à jour vers les dernières versions
    - Prise en charge des meilleurs scores ajoutée pour : 1942, Galaxian, Keystone Koppers, PentaGo!

### 01/05/21 (0.0.4)
    - Ajout de la prise en charge des meilleurs scores mondiaux pour "Popeye"
    - Ajout de la prise en charge des meilleurs scores mondiaux pour la dernière version de "Pac-Man Collection!"
    - Mise à jour vers les dernières versions de "Dragon's Cache", "Dragon's Descent", "Popeye",
      "Spire of the Ancients", "E.X.O" et "Knight Guy: Castle Days"

### 09/03/20 (0.0.3)
    - Prise en charge des opcodes ASR et ANC non documentés
    - Prise en charge des meilleurs scores mondiaux pour "Pac-Man XM"
    - "Popeye 7800: Mini-game" et "Knight Guy: Castle Days" ajoutés à la liste de développement
    - Mise à jour vers les dernières versions de "Dragon's Cache", "Dragon's Descent", "GoSub" et
      "Spire of the Ancients"

### 06/18/20 (0.0.2)
    - Implémentation XM mise à jour
    - Prise en charge initiale de la puce sonore Yamaha (YM2151)
    - Possibilité de désactiver la synchronisation verticale
    - Démos musicales Yamaha Zanac et Side-Crawler's Dance ajoutées
    - Les meilleurs scores non pris en charge par le serveur mondial sont enregistrés localement

### 05/26/20 (0.0.1)
    - Sélection de palette de couleurs ("Cool", "Warm" et "Hot") en variations "Dark" et "Light"
    - Option de mise à l'échelle "Plein écran" (Entier vs Remplir)
    - Page "Classement Global"

### 05/16/20 (0.0.0)
    - Version initiale
