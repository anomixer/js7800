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

**Jugar ahora**:
- **Cloudflare Pages**: https://js7800.pages.dev
- **GitHub Pages Mirror**: https://anomixer.github.io/js7800/

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

## Registro de Cambios (Change Log)

### 08/28/26 (0.1.0 - Versión Fork)
    - Soporte multilingüe (11 idiomas: Español, Inglés, Chino Tradicional, Chino Simplificado,
      Japonés, Coreano, Alemán, Francés, Italiano, Portugués, Ruso)
    - Sincronización en tiempo real de la Tabla de Líderes Global con protección Master SRAM
    - Despliegue dual en Cloudflare Pages y espejo de GitHub Pages
    - Soporte de escritura SRAM en dos etapas para compatibilidad retro HighScore Cartridge
    - Sincronización paralela rápida (8x concurrencia) y optimización de caché Smart Diff sin costo
    - Sincronización impulsada por eventos: escritura upstream instantánea (0s) y espejo en la nube automatizado (~18s)

### 01/25/24 (0.0.9)
    - Soporte para Souper
    - Soporte de diseño Activision OM ROM
    - Corrección de selección de pista de Pole Position II (por RevEng @ AtariAge)
    - Suavizado compuesto de Tower Toppler y Jinks (por RevEng @ AtariAge)
    - Paletas actualizadas (contribuido por Trebor @ AtariAge)
    - Popeye actualizado (JS7800 Demo 2.41) (contribuido por darryl1970 @ AtariAge)

### 08/16/23 (0.0.8)
    - Corrección del problema de fidelidad de TIA (contribuido por RevEng @ AtariAge)

### 08/13/23 (0.0.7)
    - Reescritura de Pokey (contribuido por RevEng @ AtariAge)
    - Corrección del espejo de interrupción RIOT (contribuido por RevEng @ AtariAge)
    - Añadido homebrew Drelbs
    - Añadida la última versión de Arkanoid homebrew (ahora funciona gracias a la corrección de RIOT)
    - Añadidas varias demos basadas en Pokey

### 08/10/23 (0.0.6)
    - Paletas actualizadas (contribuido por Trebor @ AtariAge)
    - Ajuste del nivel de volumen predeterminado de YM-2151
    - Corrección de encabezado de cartucho para tipo de televisión

### 07/30/23 (0.0.5)
    - Soporte para Banksets
    - Corrección del color de fondo de Maria (Keystone Koppers)
    - Corrección de encabezados de cartuchos (corrige varias ROMs que requerían versiones especiales)
    - Precisión de ciclo mejorada (resuelve varios fallos del juego)
    - Soporte de autodetección de homebrew YM-2151
    - Soporte para filtros Pokey (contribuido por RevEng @ AtariAge)
    - Soporte para cartucho de diagnóstico 7800
    - Soporte de guardado de estado (solo accesible a través de webЯcade)
    - Añadido a la lista de juegos predeterminada: IE78 (Demo), Bad Apple (Demo), Bankset Tests,
      Baby Pac-Man, 7800 Test, Keystone Koppers (Demo), Galaxian, PentaGo!
    - Varios juegos actualizados a las últimas versiones
    - Añadido soporte de puntuación alta para: 1942, Galaxian, Keystone Koppers, PentaGo!

### 01/05/21 (0.0.4)
    - Añadido soporte de puntuación alta global para "Popeye"
    - Añadido soporte de puntuación alta global para la última versión de "Pac-Man Collection!"
    - Actualizado a las últimas versiones de "Dragon's Cache", "Dragon's Descent", "Popeye",
      "Spire of the Ancients", "E.X.O" y "Knight Guy: Castle Days"

### 09/03/20 (0.0.3)
    - Soporte para códigos de operación ASR y ANC no documentados
    - Soporte de puntuación alta global para la última versión de "Pac-Man XM"
    - "Popeye 7800: Mini-game" y "Knight Guy: Castle Days" añadidos a la lista de desarrollo
    - Actualizado a las últimas versiones de "Dragon's Cache", "Dragon's Descent", "GoSub" y
      "Spire of the Ancients"

### 06/18/20 (0.0.2)
    - Implementación de XM actualizada
    - Soporte inicial para el chip de sonido Yamaha (YM2151)
    - Capacidad para desactivar la sincronización vertical
    - Demos de música Yamaha de Zanac y Side-Crawler's Dance añadidas
    - Las puntuaciones altas no compatibles con el servidor global se guardan localmente

### 05/26/20 (0.0.1)
    - Selección de paleta de colores ("Cool", "Warm" y "Hot") en variaciones "Dark" y "Light"
    - Opción de escalado "Pantalla Completa" (Entero vs. Rellenar)
    - Página de "Tabla de Líderes Global"

### 05/16/20 (0.0.0)
    - Lanzamiento inicial
