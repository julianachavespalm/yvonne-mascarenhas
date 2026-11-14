# FEAT-004: Especificação do Modo de Alto Contraste AAA

## 1. Governança SDD

| Atributo | Definição |
| :--- | :--- |
| **Status** | Approved · Implemented · Verified |
| **Spec Owner** | Juliana Chaves Palm (Software Engineer & Solution Designer) |
| **Prioridade** | P1 · MVP |
| **Decisões Arquiteturais** | [ADR-002: data-theme no html](../../decisions/ADR-002-data-theme.md), [ADR-003: Hero Editorial Desacoplado](../../decisions/ADR-003-hero-editorial.md), [ADR-004: Arquitetura Modular Enxuta](../../decisions/ADR-004-lean-modular-architecture.md), [ADR-006: Design System](../../decisions/ADR-006-design-system-wcag-palette.md) |
| **Implementação** | `src/css/tokens.css`, `src/css/components.css`, `src/js/theme-contrast.js`, `src/js/safe-storage.js` |
| **Verificação** | `tests/theme-contrast.test.js`, `tests/accessibility-and-dom.test.js` |

---

## 2. Contexto e Declaração de Valor + Histórias de Usuário

Pessoas com baixa visão, catarata, daltonismo severo ou fotofobia necessitam de um modo de Alto Contraste que forneça fundo preto absoluto e máxima luminância de texto (WCAG 2.2 AAA >= 7:1). O sistema aplica a transição via atributo `data-theme="high-contrast"` na raiz `<html>`, informando o estado a leitores de tela via `aria-pressed` e preservando o retrato oficial com borda branca.

### História de Usuário (User Story)

**Como** pessoa com baixa visão, catarata ou sensibilidade a fundos escuros de baixo contraste,

**Eu quero** alternar a página para o tema de Alto Contraste com fundo preto absoluto e texto brilhante,

**Para que** eu possa ler todo o conteúdo editorial com máximo conforto visual, distinção clara e conformidade WCAG 2.2 AAA.

---

## 3. Escopo e Fronteiras do Sistema

| Em Escopo (In-Scope) | Racional de Engenharia | Fora de Escopo (Out-of-Scope) | Racional de Negócio |
| :--- | :--- | :--- | :--- |
| Alternância de `data-theme="high-contrast"` no `<html>` | Redefine instantaneamente os tokens CSS em complexidade O(1) | Inversão cromática por filtro CSS `filter: invert()` | Distorce fotos e degrada a performance gráfica |
| Atualização de `aria-pressed` no botão e anúncio em `aria-live` | Informa o estado de acessibilidade imediatamente aos leitores de tela | Recarregamento da página para troca de folha CSS | Causa FOUC e prejudica a experiência de navegação |
| Preservação da fotografia oficial com borda branca | A foto não tem textos sobrepostos e é elemento biográfico central | Remoção de imagens científicas da página | A imagem é conteúdo biográfico indispensável |

---

## 4. Especificação Funcional e Regras de Negócio (Normativo)

- **RN-01 (Mutação Semântica):** QUANDO o leitor acionar o controle de contraste, o sistema DEVE alternar o atributo `data-theme="high-contrast"` no elemento `<html>` e definir `aria-pressed="true"` no botão.
- **RN-02 (Contraste Matemático AAA):** O sistema DEVE garantir razão de contraste de `21:1` para texto branco sobre fundo preto e `19.56:1` para botões e links em amarelo sobre fundo preto no Alto Contraste.
- **RN-03 (Preservação do Retrato):** QUANDO o modo de Alto Contraste estiver ativo, o sistema NÃO DEVE ocultar a foto da cientista e DEVE aplicar borda nítida de `2px solid #ffffff`.
- **RN-04 (Persistência Resiliente):** O sistema DEVE persistir a escolha na chave `"highContrast"` via `src/js/safe-storage.js` e restaurar o estado ao recarregar a página.

---

## 5. Contrato Técnico e Semântica de Interface

- **Contrato Módulo:** `initThemeContrast({ doc, storage })` exporta `{ toggle, reset, getState }`. Funções puras: `createThemeState(isHighContrast)`, `resolveThemeFromStorage(storedValue)`, `toggleThemeState(currentState)`.
- **Invariantes e SLAs:** Troca de tema em < 16ms, zero reflow de layout, razão de contraste >= 7:1 (AAA).
- **Dependências Internas:** `src/js/safe-storage.js` e tokens CSS (`src/css/tokens.css`).

---

## 6. Critérios de Aceitação (BDD) + Casos de Borda + Matriz de Rastreabilidade

### Critérios de Aceitação (BDD)

- **CA-01:** **Dado** que a página está no tema padrão, **Quando** o leitor acionar `#btn-a11y-contrast`, **Então** o sistema DEVE definir `data-theme="high-contrast"` no `<html>`, `aria-pressed="true"` no botão e anunciar a ativação no `#a11y-announcer`.
- **CA-02:** **Dado** que o tema de Alto Contraste está ativo, **Quando** o leitor acionar o botão novamente, **Então** o sistema DEVE remover o atributo `data-theme`, restaurar `aria-pressed="false"` e persistir `"false"`.
- **CA-03:** **Dado** que o leitor ativou o Alto Contraste em sessão anterior, **Quando** a página for recarregada, **Então** o sistema DEVE inicializar diretamente no tema de Alto Contraste.

### Casos de Borda (Edge Cases)

- **EC-01:** Se o valor lido do armazenamento for inesperado ou corrompido, o sistema DEVE iniciar defensivamente no tema padrão sem lançar exceções.

### Matriz de Rastreabilidade

| Regra / Critério | Componente / Módulo | Caso de Teste Automatizado |
| :--- | :--- | :--- |
| RN-01, RN-04 / CA-01, CA-02 | `src/js/theme-contrast.js`, `src/js/safe-storage.js` | `tests/theme-contrast.test.js` -> FEAT-004 |
| RN-02 / CA-01 | `src/css/tokens.css`, `src/css/components.css` | `tests/accessibility-and-dom.test.js` -> FEAT-009 & AD-006 |
| RN-03 / CA-01 | `src/css/layout.css` | `tests/accessibility-and-dom.test.js` -> FEAT-001 |
