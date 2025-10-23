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

**Jouer maintenant** : https://js7800.pages.dev

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