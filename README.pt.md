**English** | [繁體中文](README.zh-TW.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Français](README.fr.md) | [Italiano](README.it.md) | **Português** | [Русский](README.ru.md)

[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
[![Actions Status](https://github.com/raz0red/js7800/workflows/Build/badge.svg)](https://github.com/raz0red/js7800/actions)

# JS7800

Portado por raz0red

JS7800 é uma porta JavaScript aprimorada do emulador ProSystem Atari 7800 que foi desenvolvido originalmente por Greg Stanton.

https://raz0red.github.io/js7800/

Para funcionar corretamente e sem problemas (sem atrasos, etc.), o JS7800 requer uma versão atualizada de um navegador moderno (Chrome, Firefox, Safari) em um sistema adequadamente configurado.

[![JS7800](https://github.com/raz0red/js7800/raw/master/screenshots/screenshot.png)](https://raz0red.github.io/js7800/)

## Informações do Fork

Este é um fork do repositório original [raz0red/js7800](https://github.com/raz0red/js7800) com modificações para suportar múltiplos idiomas e melhorar a experiência de desenvolvimento local.

**Nota:** Este fork se concentra em melhorias de internacionalização mantendo a mesma excelente experiência de jogo do original. A emulação principal e compatibilidade de jogos permanecem inalteradas.

**Jogar agora**: https://js7800.pages.dev

### Modificações

*   **Suporte Multilíngue**: A interface do usuário agora suporta Inglês, Chinês Tradicional (繁體中文), Chinês Simplificado (简体中文), Japonês (日本語), Coreano (한국어), Alemão (Deutsch), Espanhol (Español), Francês (Français), Italiano (Italiano), Português e Russo (Русский).
*   **Detecção Automática de Idioma**: No primeiro carregamento, o aplicativo tentará corresponder ao idioma preferido do navegador. O idioma também pode ser alterado manualmente no menu Configurações.
*   **Suporte Multilíngue da Tabela de Líderes Global**: A página da Tabela de Líderes Global também suporta os mesmos onze idiomas e sincroniza automaticamente com as configurações de idioma do emulador principal.
*   **Pontuações Altas Globais por Padrão**: O armazenamento de pontuações altas padrão foi configurado como "Global (tabela de líderes mundial)" para permitir sincronização perfeita com o sistema de tabela de líderes original através do proxy Cloudflare Workers.
*   **Documentação Traduzida**: Os arquivos README e de ajuda interna foram traduzidos.
*   **Sincronização da Tabela de Líderes Global**: Integração Cloudflare Workers implementada para habilitar sincronização de pontuações altas globais em implantações forkadas.

### Como Executar Localmente

1.  **Instalar Dependências:**
    ```sh
    npm install
    ```

2.  **Construir o Site:**
    ```sh
    set NODE_OPTIONS=--openssl-legacy-provider
    npm run build
    ```

3.  **Servir os Arquivos:**
    Navegar para a raiz do projeto e servir o diretório `site/deploy`. Você pode usar `npx` ou o servidor web integrado do Python.

    *   **Usando Node.js:**
        ```sh
        npx http-server site/deploy -p 8081
        ```

    *   **Usando Python 3:**
        ```sh
        python -m http.server 8081 --directory site/deploy
        ```

    Em seguida, abra seu navegador em `http://localhost:8081`.

## Recursos

* Rastreamento global de pontuações altas (para jogos compatíveis com HSC)
* Mapeamentos de teclado personalizáveis
* Compatibilidade com gamepads (com suporte dual analógico para jogos estilo Robotron)
* Suporte de tela cheia
* Múltiplas proporções de aspecto
* Capacidade de ativar/desativar filtros de vídeo
* Suporte de arrastar e soltar para arquivos locais e links de arquivos remotos
* Suporte de listas de cartuchos (ver [JS7800 Wiki](https://github.com/raz0red/js7800/wiki/Cartridge%20Lists))
* Suporte de pistola de luz (através do mouse)
* Suporte do Módulo de Expansão (XM)
* Bank switching melhorado e detecção de cartuchos

## Documentação

O JS7800 inclui documentação integrada através do botão "Ajuda/Informações" localizado na barra de comandos diretamente abaixo da tela do emulador.

Para informações sobre o formato de ["listas de cartuchos"](https://github.com/raz0red/js7800/wiki/Cartridge%20Lists), [parâmetros de solicitação](https://github.com/raz0red/js7800/wiki/Request%20Parameters) e mais, consulte o [JS7800 Wiki](https://github.com/raz0red/js7800/wiki).