**English** | [繁體中文](README.zh-TW.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Deutsch](README.de.md) | **Español** | [Français](README.fr.md) | [Italiano](README.it.md) | [Português](README.pt.md) | [Русский](README.ru.md)

[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
[![Actions Status](https://github.com/raz0red/js7800/workflows/Build/badge.svg)](https://github.com/raz0red/js7800/actions)

# JS7800

Portado por raz0red

JS7800 es un puerto JavaScript mejorado del emulador ProSystem Atari 7800 que fue desarrollado originalmente por Greg Stanton.

https://raz0red.github.io/js7800/

Para funcionar correctamente y sin problemas (sin retrasos, etc.), JS7800 requiere una versión actualizada de un navegador moderno (Chrome, Firefox, Safari) en un sistema configurado adecuadamente.

[![JS7800](https://github.com/raz0red/js7800/raw/master/screenshots/screenshot.png)](https://raz0red.github.io/js7800/)

## Información del Fork

Este es un fork del repositorio original [raz0red/js7800](https://github.com/raz0red/js7800) con modificaciones para soportar múltiples idiomas y mejorar la experiencia de desarrollo local.

**Nota:** Este fork se centra en mejoras de internacionalización mientras mantiene la misma excelente experiencia de juego que el original. La emulación principal y compatibilidad de juegos permanecen sin cambios.

**Jugar ahora**: https://js7800.pages.dev

### Modificaciones

*   **Soporte Multilingüe**: La interfaz de usuario ahora soporta Inglés, Chino Tradicional (繁體中文), Chino Simplificado (简体中文), Japonés (日本語), Coreano (한국어), Alemán (Deutsch), Español, Francés (Français), Italiano (Italiano), Portugués (Português) y Ruso (Русский).
*   **Detección Automática de Idioma**: Al cargar por primera vez, la aplicación intentará coincidir con el idioma preferido del navegador. El idioma también se puede cambiar manualmente en el menú de Configuración.
*   **Soporte Multilingüe de Tabla de Líderes Global**: La página de Tabla de Líderes Global también soporta los mismos once idiomas y se sincroniza automáticamente con la configuración de idioma del emulador principal.
*   **Puntuaciones Altas Globales por Defecto**: El almacenamiento de puntuaciones altas por defecto se ha configurado como "Global (tabla de líderes mundial)" para permitir una sincronización perfecta con el sistema de tabla de líderes original a través del proxy Cloudflare Workers.
*   **Documentación Traducida**: Los archivos README y de ayuda interna han sido traducidos.
*   **Sincronización de Tabla de Líderes Global**: Implementación de integración Cloudflare Workers para habilitar la sincronización de puntuaciones altas globales en despliegues bifurcados.

### Cómo Ejecutar Localmente

1.  **Instalar Dependencias:**
    ```sh
    npm install
    ```

2.  **Construir el Sitio:**
    ```sh
    set NODE_OPTIONS=--openssl-legacy-provider
    npm run build
    ```

3.  **Servir los Archivos:**
    Navega a la raíz del proyecto y sirve el directorio `site/deploy`. Puedes usar `npx` o el servidor web integrado de Python.

    *   **Usando Node.js:**
        ```sh
        npx http-server site/deploy -p 8081
        ```

    *   **Usando Python 3:**
        ```sh
        python -m http.server 8081 --directory site/deploy
        ```

    Luego, abre tu navegador en `http://localhost:8081`.

## Características

* Seguimiento global de puntuaciones altas (para juegos compatibles con HSC)
* Mapeos de teclado personalizables
* Compatibilidad con gamepads (con soporte de doble analógico para juegos estilo Robotron)
* Soporte de pantalla completa
* Múltiples relaciones de aspecto
* Capacidad para activar/desactivar filtros de video
* Soporte de arrastrar y soltar para archivos locales y enlaces de archivos remotos
* Soporte de listas de cartuchos (ver [JS7800 Wiki](https://github.com/raz0red/js7800/wiki/Cartridge%20Lists))
* Soporte de pistola de luz (a través de mouse)
* Soporte de Módulo de Expansión (XM)
* Bank switching mejorado y detección de cartuchos

## Documentación

JS7800 incluye documentación integrada a través del botón "Ayuda/Información" ubicado en la barra de comandos directamente debajo de la pantalla del emulador.

Para información sobre el formato de ["listas de cartuchos"](https://github.com/raz0red/js7800/wiki/Cartridge%20Lists), [parámetros de solicitud](https://github.com/raz0red/js7800/wiki/Request%20Parameters) y más, consulta el [JS7800 Wiki](https://github.com/raz0red/js7800/wiki).