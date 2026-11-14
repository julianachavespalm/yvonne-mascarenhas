# FEAT-002: Especificação de Navegação Semântica, Menu Responsivo e Atalhos

## 1. Governança SDD

| Atributo | Definição |
| :--- | :--- |
| **Status** | Approved · Implemented · Verified |
| **Spec Owner** | Juliana Chaves Palm (Software Engineer & Solution Designer) |
| **Prioridade** | P1 · MVP |
| **Decisões Arquiteturais** | [ADR-001: CSS em 4 Camadas](../../decisions/ADR-001-css-layers.md), [ADR-004: Arquitetura Modular Enxuta](../../decisions/ADR-004-lean-modular-architecture.md) |
| **Implementação** | `index.html`, `src/css/components.css`, `src/js/navigation.js`, `src/js/main.js` |
| **Verificação** | `tests/navigation.test.js`, `tests/accessibility-and-dom.test.js` |

---

## 2. Contexto e Declaração de Valor + Histórias de Usuário

A navegação em páginas editoriais ricas exige fluidez tanto para quem usa mouse quanto para quem depende de navegação por teclado ou leitores de tela. O sistema implementa atalhos diretos para marcos semânticos (`Alt+1` a `Alt+4`), skip link de salto rápido e adaptação responsiva (links em linha única no desktop ou recolhidos em menu hambúrguer acessível em larguras restritas).

### História de Usuário (User Story)

**Como** leitor com navegação por teclado ou usuário de tecnologia assistiva,

**Eu quero** percorrer as seções do artigo utilizando atalhos ágeis, link de salto inicial e menu adaptável,

**Para que** eu possa acessar o conteúdo principal e os controles do artigo rapidamente, sem esforço motor repetitivo.

---

## 3. Escopo e Fronteiras do Sistema

| Em Escopo (In-Scope) | Racional de Engenharia | Fora de Escopo (Out-of-Scope) | Racional de Negócio |
| :--- | :--- | :--- | :--- |
| Skip link acessível no primeiro `Tab` da página | Atende WCAG 2.4.1 permitindo saltar blocos repetitivos | Menus com múltiplos subníveis suspensos | A página é monotemática e não possui subcategorias |
| Navegação responsiva: linha única no desktop vs. menu hambúrguer | Garante legibilidade sem quebra desordenada de linhas | Animações complexas de abertura de menu | Prejudicam pessoas com sensibilidade a movimento |
| Atalhos globais `Alt+1` a `Alt+4` com anúncios em leitor de tela | Permite deslocamento instantâneo entre marcos semânticos | Atalhos com três ou mais teclas simultâneas | Dificultam o acionamento por pessoas com limitações motoras |

---

## 4. Especificação Funcional e Regras de Negócio (Normativo)

- **RN-01 (Skip Link):** O sistema DEVE exibir o `.skip-link` no topo visual com anel de foco destacado QUANDO a tecla `Tab` for pressionada pela primeira vez.
- **RN-02 (Layout de Navegação):** O sistema DEVE renderizar os 6 links em linha única horizontal no desktop (largura >= 992px) e DEVE recolher os links no menu hambúrguer QUANDO não houver espaço suficiente.
- **RN-03 (Menu Hambúrguer):** QUANDO o leitor acionar `#btn-menu-toggle`, o sistema DEVE alternar o atributo `aria-expanded` entre `"true"` e `"false"`, permitindo fechar o menu ao teclar `Escape`, clicar em um link ou clicar fora.
- **RN-04 (Atalhos Semânticos):** O sistema DEVE mapear os atalhos `Alt+1` (Conteúdo: `#conteudo`), `Alt+2` (Navegação: `#navegacao-principal`), `Alt+3` (Acessibilidade: `#btn-a11y-contrast`) e `Alt+4` (Rodapé: `#rodape`), movendo o foco do teclado e anunciando a ação no `#a11y-announcer`.

---

## 5. Contrato Técnico e Semântica de Interface

- **Contrato Módulo:** `initNavigation({ doc, win })` exporta `{ toggleMenu, checkOverflow, handleKeyDown }`. Funções puras exportadas: `resolveShortcut(eventLike)`, `focusLandmark(doc, selector)`.
- **Invariantes e SLAs:** Resposta imediata a eventos de teclado (< 10ms), anúncio assertivo/polite em `#a11y-announcer`.
- **Dependências Internas:** Tokens CSS (`src/css/tokens.css`) e estilos de navegação (`src/css/components.css`).

---

## 6. Critérios de Aceitação (BDD) + Casos de Borda + Matriz de Rastreabilidade

### Critérios de Aceitação (BDD)

- **CA-01:** **Dado** que a página foi carregada, **Quando** o leitor pressionar `Tab` no início da navegação, **Então** o sistema DEVE focar e exibir visualmente o `.skip-link`.
- **CA-02:** **Dado** que a janela possui largura menor que 992px, **Quando** o leitor clicar em `#btn-menu-toggle`, **Então** o sistema DEVE expandir o menu e definir `aria-expanded="true"`.
- **CA-03:** **Dado** que o menu de navegação está expandido, **Quando** a tecla `Escape` for acionada, **Então** o sistema DEVE recolher o menu e definir `aria-expanded="false"`.
- **CA-04:** **Dado** que o leitor pressiona `Alt+1` sem modificadores conflitantes, **Quando** o atalho for interceptado, **Então** o sistema DEVE mover o foco para `#conteudo` e emitir anúncio em leitor de tela.

### Casos de Borda (Edge Cases)

- **EC-01:** QUANDO teclas modificadoras como `Ctrl`, `Meta` ou `Shift` forem combinadas com `Alt+1..4`, o sistema DEVE ignorar o atalho para não conflitar com atalhos nativos do sistema operacional.

### Matriz de Rastreabilidade

| Regra / Critério | Componente / Módulo | Caso de Teste Automatizado |
| :--- | :--- | :--- |
| RN-01 / CA-01 | `index.html`, `src/css/base.css` | `tests/accessibility-and-dom.test.js` -> FEAT-002 |
| RN-02, RN-03 / CA-02, CA-03 | `src/js/navigation.js` | `tests/navigation.test.js` -> FEAT-002 |
| RN-04 / CA-04 | `src/js/navigation.js` | `tests/navigation.test.js` -> FEAT-002 |
