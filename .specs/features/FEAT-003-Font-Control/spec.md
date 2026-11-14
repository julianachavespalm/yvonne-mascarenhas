# FEAT-003: Especificação de Redimensionamento Fluido e Escala de Fonte

## 1. Governança SDD

| Atributo | Definição |
| :--- | :--- |
| **Status** | Approved · Implemented · Verified |
| **Spec Owner** | Juliana Chaves Palm (Software Engineer & Solution Designer) |
| **Prioridade** | P1 · MVP |
| **Decisões Arquiteturais** | [ADR-001: CSS em 4 Camadas](../../decisions/ADR-001-css-layers.md), [ADR-004: Arquitetura Modular Enxuta](../../decisions/ADR-004-lean-modular-architecture.md) |
| **Implementação** | `src/css/base.css`, `src/js/font-scale.js`, `src/js/safe-storage.js` |
| **Verificação** | `tests/font-scale.test.js` |

---

## 2. Contexto e Declaração de Valor + Histórias de Usuário

Pessoas com presbiopia, visão subnormal ou cansaço visual necessitam de controle sobre a dimensão do texto. O projeto combina suporte nativo ao zoom do navegador (`Ctrl +` / `Ctrl -`) via unidades fluidas com um módulo determinístico de escala de fonte (`80%` a `150%`, passo de `10%`), com sanitização contra entradas corrompidas e persistência resiliente.

### História de Usuário (User Story)

**Como** leitor com necessidade de ajuste visual do tamanho do texto,

**Eu quero** ler parágrafos e títulos redimensionáveis confortavelmente sem perda de conteúdo,

**Para que** eu possa ler todo o artigo com ergonomia visual e sem quebras de alinhamento na página.

---

## 3. Escopo e Fronteiras do Sistema

| Em Escopo (In-Scope) | Racional de Engenharia | Fora de Escopo (Out-of-Scope) | Racional de Negócio |
| :--- | :--- | :--- | :--- |
| Escala fluida em CSS via unidades relativas (`rem`, `clamp`) | Permite ao zoom do navegador escalar a interface sem truncamento | Botões redundantes de escala na barra superior principal | O zoom nativo do navegador já cobre a necessidade da maioria |
| Limites estritos de 80% a 150% com passo de 10% no módulo JS | Impede distorções extremas mantendo proporções legíveis | Escala contínua livre sem limites de piso e teto | Valores extremos (ex.: 20% ou 500%) destroem a legibilidade |
| Sanitização de entradas inválidas no armazenamento local | Impede que valores corrompidos quebrem a execução da página | Criação de perfis tipográficos personalizados por usuário | Desnecessário para uma página estática sem autenticação |

---

## 4. Especificação Funcional e Regras de Negócio (Normativo)

- **RN-01 (Limites e Passo):** O sistema DEVE limitar a escala de fonte entre `80%` (mínimo) e `150%` (máximo), operando em passos inteiros de `10%` com padrão em `100%`.
- **RN-02 (Sanitização):** QUANDO uma entrada de escala for nula, vazia, não numérica ou `NaN`, o sistema DEVE sanitizá-la retornando com segurança o valor padrão de `100%`.
- **RN-03 (Persistência Resiliente):** O sistema DEVE persistir a escala válida na chave `"fontSize"` via `src/js/safe-storage.js` e anunciar o ajuste no `#a11y-announcer`.
- **RN-04 (Sinalização ARIA):** O sistema DEVE atualizar o atributo `aria-disabled="true"` no controle correspondente QUANDO a escala atingir o teto de `150%` ou o piso de `80%`.

---

## 5. Contrato Técnico e Semântica de Interface

- **Contrato Módulo:** `initFontScale({ doc, storage })` exporta `{ increase, decrease, reset, getState }`. Funções puras: `sanitizeFontScale(raw)`, `calculateNextFontScale(current, command)`, `createFontScaleState(raw)`.
- **Invariantes e SLAs:** Zero quebra de layout entre 80% e 150%, conformidade WCAG 2.2 Critério 1.4.4 (Resize Text - Nível AA).
- **Dependências Internas:** `src/js/safe-storage.js` e `src/css/base.css`.

---

## 6. Critérios de Aceitação (BDD) + Casos de Borda + Matriz de Rastreabilidade

### Critérios de Aceitação (BDD)

- **CA-01:** **Dado** que a escala tipográfica atual é 100%, **Quando** o comando `increase` for processado, **Então** o sistema DEVE ajustar a escala para 110%, atualizar o DOM e persistir o valor.
- **CA-02:** **Dado** que a escala atingiu o limite máximo de 150%, **Quando** novo comando de aumento for acionado, **Então** o sistema DEVE manter 150% e anunciar que o limite máximo foi alcançado.
- **CA-03:** **Dado** que o valor armazenado na chave `fontSize` contém dados corrompidos (`"NaN"`), **Quando** o módulo for inicializado, **Então** o sistema DEVE aplicar o valor padrão seguro de 100%.

### Casos de Borda (Edge Cases)

- **EC-01:** Se a escrita no `localStorage` falhar por `QuotaExceededError` ou bloqueio de cookies, o sistema DEVE manter o valor no `Map` em memória sem lançar erros ao leitor.

### Matriz de Rastreabilidade

| Regra / Critério | Componente / Módulo | Caso de Teste Automatizado |
| :--- | :--- | :--- |
| RN-01, RN-02 / CA-01, CA-03 | `src/js/font-scale.js` | `tests/font-scale.test.js` -> FEAT-003 |
| RN-03, RN-04 / CA-02 | `src/js/font-scale.js`, `src/js/safe-storage.js` | `tests/font-scale.test.js` -> FEAT-003 |
