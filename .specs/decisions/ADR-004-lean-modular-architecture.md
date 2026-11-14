# ADR-004: Arquitetura Modular Enxuta Orientada a Features (ES6 Nativo)

- **Status:** Aceito
- **Data:** 2026-11-14
- **Decisora:** Juliana Chaves Palm

## Contexto
O projeto é uma aplicação web editorial estática com interações locais de acessibilidade (alto contraste, escala de fonte e atalhos de navegação). Estruturas multicamadas tradicionais (como arquiteturas em camadas complexas ou frameworks SPA) adicionam abstrações desnecessárias para esse escopo, enquanto scripts procedurais acoplam regras de negócio diretamente ao DOM e dificultam os testes unitários.

## Decisão
Organizar o JavaScript em **5 módulos ES6 coesos e planos** dentro de `src/js/`, sem etapa de build:

* `safe-storage.js`: encapsula `localStorage` em `try/catch` com fallback silencioso em `Map` (evita falhas em navegação privada ou cota excedida).
* `theme-contrast.js`: gerencia a validação do tema, alternância de `data-theme="high-contrast"`, estado `aria-pressed` e anúncios `aria-live`.
* `font-scale.js`: controla os limites de escala (`80%` a `150%`), sanitização de valores e persistência da preferência.
* `navigation.js`: gerencia o menu responsivo (`aria-expanded`) e os atalhos de teclado (`Alt+1` a `Alt+4`).
* `main.js`: ponto único de inicialização (*bootstrap*) dos módulos e do widget VLibras.

Cada módulo separa internamente **funções puras** (regras de cálculo/validação) da **função de inicialização** (que recebe `document`, `window` e `storage` por injeção opcional de dependência).

## Consequências
* **Prós:** Leitura linear do fluxo de cada feature, zero dependências externas, alta resiliência contra bloqueios de storage e testes unitários determinísticos via `node --test`.
* **Contras:** Caso a aplicação evolua para consumir APIs externas ou gerenciar estados globais complexos, será necessário introduzir uma camada dedicada de serviços.

## Verificação
Coberto pelas suítes em `tests/theme-contrast.test.js`, `tests/font-scale.test.js`, `tests/navigation.test.js` e `tests/accessibility-and-dom.test.js`.
